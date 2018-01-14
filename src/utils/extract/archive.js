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
    await zip.extract(pathFile, pathDir);
    // Ugly workaround to solve filename encoding issues
    if (process.platform != 'win32') {
      await new Promise(resolve => ChildProcess.exec(`mv ${pathDir}/\*.chart ${pathDir}/notes.chart`, () => resolve()));
    }
    // 3. Find the files we need
    // Check if the song is available in the temp folder
    let iniFile, chartFile, midFile, hasStems, hasVideo;
    const fileList = Ls(Path.resolve(pathDir, '*'));
    iniFile = fileList.find(({ file }) => file == 'song.ini');
    chartFile = fileList.find(({ file }) => file.slice(-6) == '.chart');
    midFile = fileList.find(({ file }) => file.slice(-4) == '.mid');
    hasVideo = fileList.find(({ file }) => file.slice(0, 6) == 'video.');
    hasStems = fileList.filter(({ file }) => file.match(
      /(guitar|bass|rhythm|drums|vocals|keys|song).*\.(ogg|mp3|wav)/i
    )).length > 1;
    if (!iniFile && !chartFile && !midFile) return null;
    else {
      const meta = {};
      const { ini, chart, mid } = await getFiles({ iniFile, chartFile, midFile });
      if (ini) Object.assign(meta, getMetaFromIni(ini));
      if (chart) Object.assign(meta, getMetaFromChart(chart));
      else if (mid) Object.assign(meta, getMetaFromMidi(mid));
      return Object.assign(meta, { hasStems, hasVideo: !!hasVideo });
    }
  } catch (err) {
    // Corrupted archives happen, sometimes.
    // More often than not, the archive is actually extractable on Windows (don't ask me why or how).
    // Therefore, we give benefit of doubt and fall back to parsing from the file name.
    console.error(err && err.stack);
    return {};
  }
};
