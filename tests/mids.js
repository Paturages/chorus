const getMetaFromMidi = require('../src/utils/meta/midi');
const fs = require('fs');
const Glob = require('glob');
const path = require('path');
const ls = (folder, pattern) => new Promise((resolve, reject) =>
  Glob(pattern, {
    absolute: true,
    realpath: true,
    cwd: folder
  }, (err, res) => err ? reject(err) : resolve(res))
);

(async () => {
  (await ls(path.resolve(__dirname, 'mids'), `${process.argv[2] || ''}*`))
  .forEach(async path => {
    const content = await new Promise(
      (resolve, reject) =>
        fs.readFile(path, { encoding: null }, (err, res) => err ? reject(err) : resolve(res))
    );
    console.log(path, getMetaFromMidi(content));
  });
})();
