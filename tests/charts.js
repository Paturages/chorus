const getMetaFromChart = require('../src/utils/meta/chart');
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
  (await ls(path.resolve(__dirname, 'charts'), 'reality*'))
  .forEach(path => {
    console.log(path, getMetaFromChart(fs.readFileSync(path, { encoding: 'utf8' })));
  });
})();
