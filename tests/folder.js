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

const ORIGIN = process.argv[2] || __dirname;

const crawl = async root => {
  const files = await ls(root, "*");
  for (let file of files) {
    const stats = await stat(file);
    if (stats.isDirectory()) {
      await crawl(file);
    } else if (file.match(/\.mid$/)) {
      const buffer = await read(file, { encoding: null });
      console.log(file, "(mid)");
      console.log(getMetaFromMidi(buffer).brokenNotes);
    } else if (file.match(/\.chart$/)) {
      const buffer = await read(file, { encoding: null });
      console.log(file, "(chart)");
      console.log(getMetaFromChart(buffer).brokenNotes);
    } 
  }
}

(async () => {
  await crawl(ORIGIN);
})();
