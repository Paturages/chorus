const Node7z = require('node-7z');
const Fs = require('fs');
const Path = require('path');
const Rimraf = require('rimraf');
const Ls = require('ls');
const ChildProcess = require('child_process');

const getMetaFromChart = require('../meta/chart');
const getMetaFromMidi = require('../meta/midi');
const getMetaFromIni = require('../meta/ini');

// Poor man's promisify
const p = (f, ...args) => new Promise((resolve, reject) => f(...args, (err, res) => err ? reject(err) : resolve(res)));
const getFiles = async ({ iniFile, chartFile, midFile }) => {
  const ini = iniFile && (await p(Fs.readFile, iniFile.full));
  const chart = chartFile && (await p(Fs.readFile, chartFile.full));
  let mid;
  if (!chart) mid = midFile && (await p(Fs.readFile, midFile.full));
  return { ini, chart, mid };
};

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
    // 3. Find folders and try to move relevant files to the __process folder for processing
    const songs = [];
    // Normalize folder names to avoid encoding issues (screw platform compatibility)
    await new Promise(resolve => ChildProcess.exec(`find ${pathDir}/* -depth -execdir rename 's/[^A-z0-9.\\\/]/_/g' '{}' \\;`, () => resolve()));
    // Explore folders
    const processFolder = async folder => {
      const list = Ls(Path.resolve(folder.replace(/(\[|\])/g, '\\$1'), '*'));
      if (!list || !list.length) return;
      iniFile = list.find(({ file }) => file == 'song.ini');
      chartFile = list.find(({ file }) => file.slice(-6) == '.chart');
      midFile = list.find(({ file }) => file.slice(-4) == '.mid');
      hasVideo = list.find(({ file }) => file.slice(0, 6) == 'video.');
      hasStems = list.filter(({ file }) => file.match(
        /(guitar|bass|rhythm|drums|vocals|keys|song).*\.(ogg|mp3|wav)/i
      )).length > 1;
      // If this matches a song folder
      if (iniFile || chartFile || midFile) {
        const meta = {};
        const { ini, chart, mid } = await getFiles({ iniFile, chartFile, midFile });
        if (ini) Object.assign(meta, getMetaFromIni(ini));
        if (chart) Object.assign(meta, getMetaFromChart(chart));
        else if (mid) Object.assign(meta, getMetaFromMidi(mid));
        songs.push(Object.assign(meta, { hasStems, hasVideo: !!hasVideo }));
      }
      // Recurse in subfolders
      for (let i = 0; i < list.length; i++) {
        await processFolder(list[i].full);
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
