const Node7z = require('node-7z');
const Fs = require('fs');
const Path = require('path');
const Rimraf = require('rimraf');
const Glob = require('glob');
const ChildProcess = require('child_process');

const getMetaFromChart = require('../meta/chart');
const getMetaFromMidi = require('../meta/midi');
const getMetaFromIni = require('../meta/ini');

// Poor man's promisify
const p = (f, ...args) => new Promise((resolve, reject) => f(...args, (err, res) => err ? reject(err) : resolve(res)));
const getFiles = async ({ iniFile, chartFile, midFile }) => {
  const ini = iniFile && (await p(Fs.readFile, iniFile));
  const chart = chartFile && (await p(Fs.readFile, chartFile));
  let mid;
  if (!chart) mid = midFile && (await p(Fs.readFile, midFile));
  let lastModified = '';
  if (iniFile) {
    const file = await p(Fs.stat, iniFile);
    const time = file.mtime.toISOString();
    if (time > lastModified) lastModified = time.slice(0, 19);
  }
  if (chartFile) {
    const file = await p(Fs.stat, chartFile);
    const time = file.mtime.toISOString();
    if (time > lastModified) lastModified = time.slice(0, 19);
  }
  if (midFile) {
    const file = await p(Fs.stat, midFile);
    const time = file.mtime.toISOString();
    if (time > lastModified) lastModified = time.slice(0, 19);
  }
  return { ini, chart, mid, lastModified };
};
const ls = (folder, pattern) => new Promise((resolve, reject) =>
  Glob(pattern, {
    absolute: true,
    realpath: true,
    cwd: folder
  }, (err, res) => err ? reject(err) : resolve(res))
);
const getFileName = path => path.slice(path.lastIndexOf('/') + 1);

// Archive is a buffer representing the archive
module.exports = async (archive, extension) => {
  try {
    const pathDir = Path.resolve(__dirname, 'tmp');
    const pathFile = Path.resolve(__dirname, `tmp.${extension}`);
    // 1. Write the archive to disk to let 7zip operate on it
    await p(Fs.writeFile, pathFile, archive);
    // 2. Extract the archive in a temp folder
    // Force-delete the folder (for some reason, rimraf doesn't always work, which breaks the entire thing,
    // so we force via `rm -R` on Linux/OSX. Windows is untested.)
    await new Promise((resolve) =>
      process.platform == 'win32' ?
        Rimraf(pathDir, err => resolve()) :
        ChildProcess.exec(`rm -R ${pathDir}`, err => resolve())
    );
    await p(Fs.mkdir, pathDir);
    const zip = new Node7z();
    await zip.extractFull(pathFile, pathDir);
    // 3. Find song folders and try to parse relevant files for metadata
    const songs = [];
    // Explore folders
    const processFolder = async folder => {
      const files = (await ls(folder, '*')) || [];
      const subfolders = (await ls(folder, '*/')) || [];
      if (!files.length && !subfolders.length) return;
      
      const chartFiles = files.filter(path => path.slice(-6) == '.chart');
      const midFiles = files.filter(path => path.slice(-4) == '.mid');
      const audioFiles = files.filter(path => getFileName(path).match(
        /\.(ogg|mp3|wav)$/i
      ));
      const stemFiles = audioFiles.filter(path => getFileName(path).match(
        /(guitar|bass|rhythm|drums_.|vocals|keys|song)/i
      ));

      // Order of priority: "notes.chart" > files with "[Y]" in it > first one we can find
      const chartFile = chartFiles.find(path => getFileName(path) == "notes.chart") ||
        chartFiles.find(path => path.indexOf('[Y]') > -1) ||
        chartFiles[0];
      // Order of priority: "notes.mid" > first one we can find
      const midFile = midFiles.find(path => getFileName(path) == "notes.mid") || midFiles[0];

      const iniFile = files.find(path => getFileName(path).slice(-8) == 'song.ini');
      const hasAlbumArt = !!files.find(path => getFileName(path).slice(0, 6) == 'album.');
      const hasBackground = !!files.find(path => {
        const name = getFileName(path);
        return !name.match(/album\./) && name.match(/\.(png|jpg)/);
      });
      const hasVideo = !!files.find(path => getFileName(path).slice(0, 6) == 'video.');
      const hasNoAudio = !audioFiles.length;
      let needsRenaming;
      if (chartFile) needsRenaming = getFileName(chartFile) != "notes.chart";
      else if (midFile) needsRenaming = getFileName(midFile) != "notes.mid";
      const hasStems = stemFiles.length > 1;
      // If this matches a song folder
      if (iniFile || chartFile || midFile) {
        const meta = {};
        const { ini, chart, mid, lastModified } = await getFiles({ iniFile, chartFile, midFile });
        if (ini) Object.assign(meta, getMetaFromIni(ini));
        if (chart) Object.assign(meta, getMetaFromChart(chart));
        else if (mid) Object.assign(meta, getMetaFromMidi(mid));
        songs.push(
          Object.assign(
            meta,
            { hasStems, hasVideo, hasNoAudio, needsRenaming, hasAlbumArt, hasBackground },
            lastModified && { lastModified }
          )
        );
      }
      // Recurse in subfolders
      for (let i = 0; i < subfolders.length; i++) {
        await processFolder(subfolders[i]);
      }
    };
    await processFolder(pathDir);
    return songs;
  } catch (err) {
    // Corrupted archives happen, sometimes.
    // More often than not, the archive is actually extractable on Windows (don't ask me why or how).
    // Therefore, we give benefit of doubt and fall back to parsing from the file name.
    console.error(err && err.stack);
    return [{}];
  }
};
