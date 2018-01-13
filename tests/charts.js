const getMetaFromChart = require('../src/utils/meta/chart');
const fs = require('fs');
const ls = require('ls');
const path = require('path');
/*
ls(path.resolve(__dirname, 'charts', '*'))
.forEach(file => {
  console.log(file.file, getMetaFromChart(fs.readFileSync(file.full, { encoding: 'utf8' })));
});
*/

fs.readdir(path.resolve(__dirname, 'charts'), (err, files) => 
  files.forEach(file => console.log(fs.readFileSync(file)))
)
