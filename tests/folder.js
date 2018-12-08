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
const read = util.promisify(fs.readFile);

(async () => {
  const folders = await ls(path.resolve(__dirname, 'csc-december'), "*");
  for (let folder of folders) {
    const files = await ls(folder, "*");
    for (let file of files) {
      if (file.match(/\.mid$/)) {
        const buffer = await read(file, { encoding: null });
        console.log(file);
        console.log(getMetaFromMidi(buffer).brokenNotes);
      } else if (file.match(/\.chart$/)) {
        const buffer = await read(file, { encoding: null });
        console.log(file);
        console.log(getMetaFromChart(buffer).brokenNotes);
      }
    }
  }
})();
