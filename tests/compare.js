const getMetaFromChart = require('../src/utils/chart-meta');
const getMetaFromMidi = require('../src/utils/midi-meta');
const fs = require('fs');
const ls = require('ls');
const path = require('path');

const files = ls(path.resolve(__dirname, 'charts', '*'));

(async () => {
  for (let i = 0; i < files.length; i++) {
    const chart = files[i];
    const [mid] = ls(path.resolve(__dirname, 'mids', `${chart.file.slice(0, -6)}.mid`));
    if (mid) {
      const fChart = await new Promise(
        (resolve, reject) =>
          fs.readFile(chart.full, { encoding: 'utf8' }, (err, res) => err ? reject(err) : resolve(res))
      );
      const fMid = await new Promise(
        (resolve, reject) =>
          fs.readFile(mid.full, { encoding: null }, (err, res) => err ? reject(err) : resolve(res))
      );
      console.log(chart.file);
      console.log(JSON.stringify(getMetaFromChart(fChart).hashes));
      console.log(JSON.stringify(getMetaFromMidi(fMid).hashes));
      console.log('---');
    }
  }
})();
