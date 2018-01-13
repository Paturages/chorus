const fs = require('fs');
const { upsertSource, upsertSongs } = require('../utils/db');

module.exports = async fileName => {
  const short = fileName.slice(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'));
  console.log('Adding', short);
  const lines = fs.readFileSync(fileName, { encoding: 'utf8' }).split('\n');
  const lastModified = fs.statSync(fileName).mtime;
  const songs = [];
  let sourceName, sourceLink, sourceCharter;
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    if (line.indexOf('Song:') == 0) return;
    if (line.indexOf('Link:') == 0) return;
    if (line.indexOf('Charter:') == 0) return;
    let match;
    if (match = line.match(/^Source name: ?(.+)$/)) [, sourceName] = match;
    else if (match = line.match(/^Link to source[^:]*: ?(.+)$/)) [, sourceLink] = match;
    else if (match = line.match(/^Charter [^:]*: ?(.+)$/)) [, sourceCharter] = match;
    else if (match = line.match(/^Artist: ?(.+)$/)) {
      const [, artist] = match;
      const name = lines[index+1].slice(6).trim();
      const link = lines[index+2].slice(6).trim();
      const charter = lines[index+3].slice(9).trim() || sourceCharter;
      songs.push({ name, artist, link, charter, lastModified });
    }
  });
  
  console.log('Registering or finding source');
  const source = await upsertSource({
    name: sourceName.trim(),
    link: sourceLink.trim()
  });
  source.chorusId = source.id;

  console.log('Adding/updating songs');
  await upsertSongs(songs.map(song => Object.assign(song, { source })), true);

  console.log(sourceName, 'imported!');
  return 0;
};
