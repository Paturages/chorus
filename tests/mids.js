const getMetaFromMidi = require('../src/utils/midi-meta');
const fs = require('fs');
const ls = require('ls');
const path = require('path');

ls(path.resolve(__dirname, 'mids', '*'))
.forEach(async file => {
  const content = await new Promise(
    (resolve, reject) =>
    fs.readFile(file.full, { encoding: null }, (err, res) => err ? reject(err) : resolve(res))
  );
  console.log(file.file, getMetaFromMidi(content));
});
