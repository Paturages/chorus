// TODO: Update when someone needs it

const fs = require('fs');
const { upsertSource, upsertSongs } = require('../utils/db');
const { read } = require('../utils/excel');

module.exports = async fileName => {
  const short = fileName.slice(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'));
  console.log('Adding', short);
  const data = fs.readFileSync(fileName);
  const lastModified = fs.statSync(fileName).mtime;
  const lines = await read({ name: fileName, data });

  const sourceName = lines[0][1];
  const sourceLink = lines[1][1];
  const sourceCharter = lines[2][1];
  const songs = lines.slice(5).map(([artist, name, link, charter]) => ({
    artist: artist.trim(),
    name: name.trim(),
    link: link.trim(),
    charter: charter.trim() || sourceCharter,
    lastModified,
  }));

  console.log('Registering or finding source');
  const source = await upsertSource({
    short,
    name: sourceName.trim(),
    link: sourceLink.trim()
  });

  console.log('Adding/updating songs');
  await upsertSongs(songs.map(song => Object.assign(song, { sourceId: source.id })), true);

  console.log(sourceName, 'imported!');
};
