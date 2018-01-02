// Library to make HTTP requests
const request = require('request');
// Utility functions to interact with the PostgreSQL database
const { upsertSongs, upsertSource } = require('../src/utils/db');

module.exports = async () => {
  // 1. Register the source in the database
  // or update and fetch it if it already exists.
  // upsertSource takes an object with "short", "name" and "link"
  console.log('Registering or finding source');
  const source = await upsertSource({
    short: 'paturages',
    name: "Paturages' charts",
    link: "https://public.fightthe.pw/clonehero"
  });
  // 2. Fetch the songs to be inserted
  // My drive is served by Caddy's https://caddyserver.com/docs/browse module
  // which provides support for JSON responses
  console.log('Fetching songs');
  const songs = await new Promise((resolve, reject) =>
    request.get('https://public.fightthe.pw/clonehero', { headers: { Accept: 'application/json' } }, (err, res) => {
      if (err) reject(err);
      else resolve(JSON.parse(res.body));
    })
  );
  console.log(songs.length, 'songs found');
  // 3. Build the song objects and upsert them
  await upsertSongs(songs.map(({ Name, URL, ModTime }) => {
    // upsertSongs takes an array of songs
    // Each song is an object with the following attributes:
    // - "name": the name of the song
    // - "artist": the band or artist
    // - "sourceId": the ID of the source from step 1.
    // - "charter": the name of the charter (optional)
    // - "link": the link to download the song
    // - "lastModified": a timestamp in ISO format (e.g. 2017-12-24T21:52:23.617Z)
    const [, artist, name] = Name.match(/\]? ?(.+) - (.+)\.zip$/);
    const link = `https://public.fightthe.pw/clonehero/${URL.slice(2)}`
    return {
      name,
      artist,
      sourceId: source.id,
      charter: "Paturages",
      link,
      lastModified: ModTime
    };
  }));
  console.log('Import from Paturages done');
  return 0;
};
