const getMetaFromArchive = require('../src/utils/extract/archive');
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

ls(path.resolve(__dirname, 'archives'), '*')
.then(x => x.forEach(async file => {
  console.log(file, await getMetaFromArchive(fs.readFileSync(file), file.slice(-3)));
}));
