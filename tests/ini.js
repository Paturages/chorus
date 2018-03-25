const getMetaFromIni = require('../src/utils/meta/ini');
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
  (await ls(path.resolve(__dirname, 'ini'), `${process.argv[2] || ''}*`))
  .forEach(path => {
    console.log(process.argv[2], getMetaFromIni(fs.readFileSync(path)));
  });
})();
