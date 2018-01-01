const Drive = require('../../src/utils/drive');
const request = require('request');
const { upsertSource, upsertSongs } = require('../../src/utils/db');

module.exports = async () => {
  console.log('Registering or finding source');
  const source = await upsertSource({
    short: 'exilelord',
    name: 'ExileLord Setlist',
    link: 'https://drive.google.com/drive/folders/1CK7XDRxH3zyIZgbta1PbSzCeZXXk1uNV'
  });
  console.log('Browsing releases...');
  const songs = await Drive.get({
    q: `'1CK7XDRxH3zyIZgbta1PbSzCeZXXk1uNV' in parents`,
    fields: 'nextPageToken, files(id, name, modifiedTime, webViewLink)'
  });
  console.log(songs.length, 'songs found');
  
  // (Oh boy, here we go)
  // Parsing song.ini files because the folder naming is shit!
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    console.log('Fetching meta for', song.name);
    const [ini] = await Drive.get({
      q: `'${song.id}' in parents and name = 'song.ini'`,
      fields: 'files(id, webContentLink)'
    });
    let meta = await new Promise((resolve, reject) =>
      request.get(ini.webContentLink, { headers: { Accept: 'application/json' } }, (err, res) => {
        if (err) reject(err);
        else resolve(res.body);
      })
    );
    meta = meta.split('\n')
      .reduce((obj, line) => {
        const [param, ...valueParts] = line.split('=');
        if (!valueParts || !valueParts.length) return obj;
        const value = valueParts.join('=').trim();
        if (!value.trim()) return obj;
        return Object.assign(obj, { [param.trim()]: value.trim() });
      });
    Object.assign(song, { meta });
  }

  await upsertSongs(songs.map(({ webViewLink, modifiedTime, meta: { artist, name, charter } }) => (
    {
      name,
      artist,
      sourceId: source.id,
      charter,
      link: webViewLink,
      lastModified: modifiedTime
    }
  )));
  console.log('ExileLord imported!');
  return 0;
};
