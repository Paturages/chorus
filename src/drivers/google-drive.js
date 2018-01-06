const Drive = require('../utils/drive');
const Request = require('request');
const Unzip = require('node-zip');
const Unrar = require('@fknop/node-unrar');
const Ls = require('ls');
const Fs = require('fs');
const Rimraf = require('rimraf');
const Path = require('path');

const getMetaFromChart = require('../utils/meta/chart');
const getMetaFromMidi = require('../utils/meta/midi');
const getMetaFromIni = require('../utils/meta/ini');
const {
  upsertSource,
  upsertSongs,
  upsertLinksToIgnore,
  getLinksMapBySource,
} = require('../utils/db');

const download = (url, encoding = 'utf8') => new Promise((resolve, reject) =>
  Request.get(url, { encoding }, (err, res) => {
    if (err) reject(err);
    else resolve(res.body);
  })
);

const defaultNameParser = txt => {
  let [artist, ...songParts] = txt.split(' - ');
  if (!songParts || !songParts.length) return { artist: 'N/A', name: txt.replace(/\.(zip|rar)$/, '') };
  const name = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
  return { artist, name };
};

module.exports = async ({ name, link }) => {
  console.log('Adding', name);
  // Supporting both https://drive.google.com/open?id=<drive_id>
  // and https://drive.google.com/drive/folders/<drive_id> syntaxes
  const source = { name, link, id: link.slice(
    link.indexOf('/open?id=') > -1 ?
      link.indexOf('/open?id=') + 9 :
      link.lastIndexOf('/') + 1
  ) };
  
  // 1. Registering the source, or finding its ID if it already exists
  console.log('Registering/finding source');
  source.chorusId = (await upsertSource(source)).id;

  // 2. Get the map of already indexed links so that they don't get parsed again
  const linksMap = await getLinksMapBySource(source.chorusId);

  /*
    3. Attempt to discover songs inside the drive
    A song can be either a folder with "song.ini", "notes.chart" and audio files in it,
    or archives (.zip/.rar).
  */
  console.log('Looking for chart folders and archives');
  const songs = [];
  const toIgnore = [];
  const searchSongFolders = async folder => {
    console.log('Looking inside', folder.name);
    // List files inside the folder
    const archives = [];
    let { subfolders, files, hasStems } = (await Drive.list({ q: `'${folder.id}' in parents` }))
      .reduce((content, item) => {
        // Do not parse already indexed songs
        if (linksMap[item.webViewLink] && (linksMap[item.webViewLink].lastModified || '').slice(0, 19) == item.modifiedTime.slice(0, 19)) {
          songs.push(Object.assign(item, { meta: Object.assign(linksMap[item.webViewLink], { source }) }));
          return content;
        }
        if (linksMap[item.webViewLink] == 'ignore') return content;
        // Save subfolders for further processing
        if (item.mimeType == 'application/vnd.google-apps.folder') {
          content.subfolders.push(item);
        // Archives might or might not be songs.
        // The 75 MB threshold is to exclude song packs (and also not kill my bandwidth everyday)
        // (75 MB should be big enough to take stems into account.
        // For reference, Yes' Roundabout from Rock Band 3 archive is 54 MB)
        } else if ((item.fileExtension == 'rar' || item.fileExtension == 'zip') && item.size < 78643200 && item.webContentLink) {
          archives.push(item);
        // Save "song.ini", .chart and .mid files
        } else if (item.name == 'song.ini') {
          content.files.ini = item;
        } else if (item.fileExtension == 'chart' && !content.chart) {
          content.files.chart = item;
        } else if (item.fileExtension == 'mid' && !content.mid) {
          content.files.mid = item;
        } else if (item.name == 'rhythm.ogg') {
          content.hasStems = true;
        }
        return content;
      }, { subfolders: [], files: {} });
    // Process archives
    for (let i = 0; i < archives.length; i++) {
      try {
        const file = archives[i];
        if (linksMap[file.webViewLink] == 'ignore') continue;
        console.log('Extracting', file.name);
        // Computing default artist and song names in case there's no song.ini file,
        // and also inputing already available metadata
        const { artist, name } = defaultNameParser(file.name);
        file.meta = { artist, name, lastModified: file.modifiedTime, source, link: file.webViewLink };
        const archive = await download(file.webContentLink, null);
        if (file.fileExtension == 'zip') {
          // .zip: We can unzip the thing directly from the content
          const { files } = Unzip(archive, { base64: false, checkCRC32: true });
          const iniFileName = Object.keys(files).find(f => f.indexOf('song.ini') > -1);
          const chartFileName = Object.keys(files).find(f => f.indexOf('.chart') > -1);
          const midFileName = Object.keys(files).find(f => f.indexOf('.mid') > -1);
          const hasStems = Object.keys(files).find(f => f.indexOf('rhythm.ogg') > -1);
          const meta = {};
          // Parse song.ini
          if (iniFileName) Object.assign(meta, getMetaFromIni(files[iniFileName]._data));
          // Parse either .chart (safest choice) or .mid
          if (chartFileName) Object.assign(meta, getMetaFromChart(files[chartFileName]._data));
          else if (midFileName) Object.assign(meta, getMetaFromMidi(files[midFileName]._data));
          // If anything was found, add to list of songs with meta,
          // else add it to the ignore list
          if (Object.keys(meta).length) {
            console.log('Found', meta.name, 'by', meta.artist);
            songs.push(Object.assign(file, { meta: Object.assign(file.meta, meta, { hasStems: !!hasStems }) }));
          } else {
            toIgnore.push(Object.assign(file, { sourceId: source.chorusId, link: file.webViewLink }));
          }
        } else {
          let iniFileName, chartFileName, midFileName, hasStems;
          const processFileNames = async (pushToIgnore) => {
            const meta = {};
            // Parse song.ini
            if (iniFileName) {
              const ini = await new Promise((resolve, reject) => Fs.readFile(iniFileName.full, 'utf8', (err, res) => err ? reject(err) : resolve(res)));
              Object.assign(meta, getMetaFromIni(ini));
            }
            // Parse either .chart (safest choice) or .mid
            if (chartFileName) {
              const chart = await new Promise((resolve, reject) => Fs.readFile(chartFileName.full, 'utf8', (err, res) => err ? reject(err) : resolve(res)));
              Object.assign(meta, getMetaFromChart(chart));
            } else if (midFileName) {
              const midi = await new Promise((resolve, reject) => Fs.readFile(midFileName.full, 'utf8', (err, res) => err ? reject(err) : resolve(res)));
              Object.assign(meta, getMetaFromMidi(midi));
            }
            // If anything was found, add to list of songs with meta,
            // else add it to the ignore list
            if (Object.keys(meta).length) {
              console.log('Found', meta.name, 'by', meta.artist);
              songs.push(Object.assign(file, { meta: Object.assign(file.meta, meta, { hasStems: !!hasStems }) }));
            } else if (pushToIgnore) {
              toIgnore.push(Object.assign(file, { sourceId: source.chorusId, link: file.webViewLink }));
            }
          };
          // .rar: Libs depend on .childProcess shenanigans,
          // so we have to save the archive to disk first.
          await new Promise((resolve, reject) => Fs.mkdir(Path.resolve(__dirname, '..', '..', 'tmp'), (err, res) => err ? reject(err) : resolve(res)));
          await new Promise((resolve, reject) => Fs.writeFile(Path.resolve(__dirname, '..', '..', 'tmp.rar'), archive, (err, res) => err ? reject(err) : resolve(res)));
          await new Promise((resolve, reject) => Unrar.extract(Path.resolve(__dirname, '..', '..', 'tmp.rar'), { dest: Path.resolve(__dirname, '..', '..', 'tmp') }, (err, res) => err ? reject(err) : resolve(res)));
          // First, check if the song is available as is
          [iniFileName] = Ls(Path.resolve(__dirname, '..', '..', 'tmp', 'song.ini'));
          [chartFileName] = Ls(Path.resolve(__dirname, '..', '..', 'tmp', '*.chart'));
          [midFileName] = Ls(Path.resolve(__dirname, '..', '..', 'tmp', '*.mid'));
          [hasStems] = Ls(Path.resolve(__dirname, '..', '..', 'tmp', 'rhythm.ogg'));
          // If not, check inside folders for songs
          // (yeah screw it, we're gonna end up indexing some packs, whatever)
          if (!iniFileName && !chartFileName && !midFileName) {
            const items = Ls(Path.resolve(__dirname, '..', '..', 'tmp', '*'));
            let found;
            for (let j = 0; j < items.length; j++) {
              const item = items[j];
              [iniFileName] = Ls(Path.resolve(item.full, 'song.ini'));
              [chartFileName] = Ls(Path.resolve(item.full, '*.chart'));
              [midFileName] = Ls(Path.resolve(item.full, '*.mid'));
              [hasStems] = Ls(Path.resolve(item.full, 'rhythm.ogg'));
              if (iniFileName || chartFileName || midFileName) {
                found = true;
                await processFileNames();
              }
            }
            if (!found) toIgnore.push(Object.assign(file, { sourceId: source.chorusId, link: file.webViewLink }));
          } else await processFileNames(true);
          // Clean up
          await Promise.all([
            new Promise((resolve, reject) => Rimraf(Path.resolve(__dirname, '..', '..', 'tmp'), (err, res) => err ? reject(err) : resolve(res))),
            new Promise((resolve, reject) => Fs.unlink(Path.resolve(__dirname, '..', '..', 'tmp.rar'), (err, res) => err ? reject(err) : resolve(res)))
          ]);
        }
      } catch (err) {
        console.error(archives[i].name, 'failed!');
        console.error(err.stack);
      }
    }
    // If the folder contains a "song.ini", a .chart or a .mid,
    // it's probably a chart folder (maybe without audio in rare cases)
    const { ini, chart, mid } = files;
    if (ini || chart || mid) {
      try {
        const { artist, name } = defaultNameParser(folder.name);
        folder.meta = { artist, name, lastModified: folder.modifiedTime, source, link: folder.webViewLink };
        const meta = {};
        if (ini) {
          const x = await download(ini.webContentLink);
          Object.assign(meta, getMetaFromIni(x));
        }
        if (chart) {
          const x = await download(chart.webContentLink);
          Object.assign(meta, getMetaFromChart(x));
        } else if (mid) {
          const x = await download(mid.webContentLink, null);
          Object.assign(meta, getMetaFromMidi(x));
        }
        console.log('Found', meta.name, 'by', meta.artist);
        songs.push(Object.assign(folder, { meta: Object.assign(folder.meta, meta, { hasStems: !!hasStems }) }));
      } catch (err) {
        console.error(folder.name, 'failed!');
        console.error(err.stack);
      }
    }
    // Recurse on subfolders
    for (let i = 0; i < subfolders.length; i++) {
      await searchSongFolders(subfolders[i]);
    }
  };
  await searchSongFolders(source);

  // 4. Update the list of links to ignore (e.g. invalid archives, stray files...)
  if (toIgnore.length) await upsertLinksToIgnore(toIgnore);

  // 5. Insert the songs with their metadata into the database
  if (songs.length) await upsertSongs(songs);
};
