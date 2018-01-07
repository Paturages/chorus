const Request = require('request');
const Unzip = require('node-zip');

const getMetaFromChart = require('../utils/meta/chart');
const getMetaFromMidi = require('../utils/meta/midi');
const getMetaFromIni = require('../utils/meta/ini');
const {
  upsertSource,
  upsertSongs,
  upsertLinksToIgnore,
  getLinksMapBySource,
} = require('../utils/db');

module.exports = async ({ name, link }) => {
  console.log('Adding', name);
  // 1. Registering the source, or finding its ID if it already exists
  console.log('Registering/finding source');
  const source = await upsertSource({ name, link });
  source.chorusId = source.id;
  // 2. Get the map of already indexed links so that they don't get parsed again
  const linksMap = await getLinksMapBySource(source.chorusId);
  // 3. Get the songs: they're all in the one folder, and they're all .zips.
  // (I'm probably gonna be the only one using it, so whatever)
  console.log('Fetching list of songs');
  const songList = await new Promise((resolve, reject) =>
    Request.get(link, { headers: { Accept: 'application/json' } }, (err, res) => {
      if (err) reject(err);
      else resolve(JSON.parse(res.body));
    })
  );
  const songs = [];
  const toIgnore = [];
  console.log(songList.length, 'songs found');
  for (let i = 0; i < songList.length; i++) {
    try {
      const { Name, URL, ModTime } = songList[i];
      const url = `${link}${URL.slice(2)}`;
      if (linksMap[url] && ModTime.slice(0, 19) == linksMap[url].lastModified.slice(0, 19)) {
        songs.push(Object.assign(item, { meta: Object.assign(linksMap[url], { source }) }));
        continue;
      }
      console.log('Extracting', Name);
      const archive = await new Promise((resolve, reject) =>
        Request.get(url, { encoding: null }, (err, res) => {
          if (err) reject(err);
          else resolve(res.body);
        })
      );
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
        songs.push({ meta: Object.assign(meta, { hasStems: !!hasStems, source, link: url, lastModified: ModTime }) });
      } else {
        toIgnore.push({ sourceId: source.chorusId, link: url });
      }
    } catch (err) {
      console.log(songList[i].Name, 'failed!');
      console.error(err.message);
    }
  }
  // 4. Update the list of links to ignore (e.g. invalid archives, stray files...)
  if (toIgnore.length) await upsertLinksToIgnore(toIgnore);
  // 5. Insert the songs with their metadata into the database
  if (songs.length) await upsertSongs(songs);
};
