const getMetaFromChart = require('../src/utils/chart-meta');
const fs = require('fs');
const ls = require('ls');
const path = require('path');

ls(path.resolve(__dirname, 'charts', '*'))
.forEach(file => {
  console.log(file.file, getMetaFromChart(fs.readFileSync(file.full, { encoding: 'utf8' })));
});
