const getMetaFromChart = require('../src/utils/meta/chart');
const getMetaFromMidi = require('../src/utils/meta/midi');

const fs = require('fs');
const util = require('util');
const Glob = require('glob');
const path = require('path');
const ls = (folder, pattern) => new Promise((resolve, reject) =>
  Glob(pattern, {
    absolute: true,
    realpath: true,
    cwd: folder
  }, (err, res) => err ? reject(err) : resolve(res))
);
const stat = path => util.promisify(fs.stat)(path);

const read = util.promisify(fs.readFile);

const ORIGIN = process.argv[2] || "C:/Users/Paturages/Documents/Clone Hero Songs/Marathon Hero";

const formatTime = time => {
  const ms = time % 1;
  time = time >> 0;
  const seconds = time % 60;
  time = time / 60 >> 0;
  const minutes = time % 60;
  time = time / 60 >> 0;
  return [
    time,
    minutes ? `0${minutes}`.slice(-2) : "00",
    seconds ? `0${seconds}`.slice(-2) : "00",
  ].filter(x => x).join(':') + ms.toFixed(3).slice(1);
}

const crawl = async root => {
  const files = await ls(root, "*");
  for (let file of files) {
    const stats = await stat(file);
    if (stats.isDirectory()) {
      await crawl(file);
    } else if (file.match(/\.mid$/)) {
      /*const buffer = await read(file, { encoding: null });
      console.log(file, "(mid)");
      console.log(getMetaFromMidi(buffer).brokenNotes);*/
    } else if (file.match(/\.chart$/)) {
      const buffer = await read(file, { encoding: null });
      console.log(file);
      // console.log(file.split("\\").slice(-2).join('/'));
      const meta = getMetaFromChart(buffer);
      meta.brokenNotes.forEach(note => {
        note.time = formatTime(note.time);
      });
      console.log(meta.brokenNotes);
    } 
  }
}

(async () => {
  await crawl(ORIGIN);
})();
