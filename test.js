const Node7z = require('node-7z');
const Fs = require('fs');
const Path = require('path');
const Rimraf = require('rimraf');
const ChildProcess = require('child_process');
const Ls = require('ls');
const p = (f, ...args) => new Promise((resolve, reject) => f(...args, (err, res) => err ? reject(err) : resolve(res)));

const rar = `/Users/ingouffchristian/Documents/Projects/Personal/chorus/src/utils/extract/tmp.zip`;
const dir = '/Users/ingouffchristian/Documents/Projects/Personal/chorus/src/utils/extract/tmp';

(async () => {
  try {
    await new Promise((resolve) =>
      process.platform == 'win32' ?
        Rimraf(dir, err => resolve()) :
        ChildProcess.exec(`rm -R ${dir}`, err => resolve())
    );
    console.log('Making folder');
    await p(Fs.mkdir, dir);
    console.log('Extracting');
    const zip = new Node7z();
    await zip.extractFull(rar, dir);
    console.log(Ls('/Users/ingouffchristian/Documents/Projects/Personal/chorus/src/utils/extract/tmp/*'));
    console.log(Ls('/Users/ingouffchristian/Documents/Projects/Personal/chorus/src/utils/extract/tmp/[G.1-X] Between the Buried and me - Laser Speed/*'.replace(/ /g, '\\ ')));
    console.log(Ls('/Users/ingouffchristian/Documents/Projects/Personal/chorus/src/utils/extract/tmp/[G.1-X] Between the Buried and me - Laser Speed/song.ini'.replace(/ /g, '\\ ')));
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err && err.stack);
    process.exit(1);
  }
})();
