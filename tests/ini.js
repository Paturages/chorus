const Iconv = require('iconv-lite');
const Fs = require('fs');
const Path = require('path');

const utf8 = Fs.readFileSync(Path.resolve(__dirname, 'ini', 'song.ini'), 'utf8');
const latin1 = Iconv.decode(Fs.readFileSync(Path.resolve(__dirname, 'ini', 'song.ini')), 'latin1');

// console.log(utf8, utf8.indexOf('�'));
console.log(latin1, latin1.indexOf('�'));
