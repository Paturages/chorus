const getMetaFromArchive = require('../src/utils/extract/archive');
const fs = require('fs');
const ls = require('ls');
const path = require('path');

ls(path.resolve(__dirname, 'archives', '[Never*'))
.forEach(async file => {
  console.log(file.file, await getMetaFromArchive(fs.readFileSync(file.full), file.full.slice(-3)));
});
