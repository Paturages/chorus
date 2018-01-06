// Utility functions to interact with the PostgreSQL database
const { upsertSongs, upsertSource } = require('../../src/utils/db');

// Utility class for getting files on Google Drive
// For the syntax to use for the "q" parameter,
// check https://developers.google.com/drive/v3/web/search-parameters
const Drive = require('../../src/utils/drive');

// where the "letter" folders are
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/0B1lvPFfHBT2LTFN0ODh3OHdJdUk';

const nameParser = name => {
  let [artist, ...songParts] = name.split(' - ');
  if (!songParts || !songParts.length) return { artist: 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
  const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
  return { artist, song };
};

module.exports = async () => {
  // 1. Register the source in the database
  // or update and fetch it if it already exists.
  // upsertSource takes an object with "short", "name" and "link"
  console.log('Registering or finding source');
  const source = await upsertSource({
    short: 'c3',
    name: 'C3 Converted CH Customs',
    link: ROOT_FOLDER
  });

  // 2. Get letters A from Z from the root folder
  // (and the # and special characters folder)
  console.log('Getting letters');
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const letters = (await Drive.get({ q: `'${rootId}' in parents` }))
    .filter(folder => folder.name.length == 1 || folder.name[0] == '#');
  console.log(letters.length, 'letters found');
  // 3. For each letter, get the artist/band
  console.log('Getting artists');
  const artists = [];
  await Promise.all(letters.map(async ({ id, name }) => {
    const payload = await Drive.get({ q: `'${id}' in parents` });
    console.log(payload.length, 'artists inside', name);
    return artists.push(...payload);
  }));
  console.log(artists.length, 'artists found');

  // 4. For each artist, get all the songs and insert them
  await Promise.all(artists.map(async ({ id, name: artistName }) => {
    const songs = await Drive.get({
      q: `'${id}' in parents`,
      fields: 'nextPageToken, files(id, name, modifiedTime, webViewLink)'
    });
    if (!songs.length) return;
    console.log('Found', songs.length, 'songs for', artistName);
    // upsertSongs takes an array of songs
    // Each song is an object with the following attributes:
    // - "name": the name of the song
    // - "artist": the band or artist
    // - "sourceId": the ID of the source from step 1.
    // - "charter": the name of the charter (optional)
    // - "link": the link to download the song
    // - "lastModified": a timestamp in ISO format (e.g. 2017-12-24T21:52:23.617Z)
    return upsertSongs(songs.map(({ id, name, modifiedTime, webViewLink }) => {
      const { artist, song } = nameParser(name);
      return {
        name: song,
        artist,
        sourceId: source.id,
        charter: null,
        link: webViewLink,
        lastModified: modifiedTime
      };
    }));
  }));
  console.log('C3 imports done!');
  return 0;
}
