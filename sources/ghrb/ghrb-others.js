const request = require('request');
const { upsertSongs, upsertSource } = require('../../src/utils/db');

module.exports = async () => {
  const games = await new Promise((resolve, reject) =>
    request.get('https://public.fightthe.pw/ghrb', { headers: { Accept: 'application/json' } }, (err, res) => {
      if (err) reject(err);
      else resolve(JSON.parse(res.body));
    })
  );
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    console.log('Registering or finding source for', game.Name);
    const gameLink = `https://public.fightthe.pw/ghrb/${game.URL.slice(2)}`;
    const source = await upsertSource({
      short: gameLink,
      name: game.Name,
      link: gameLink
    });
    console.log('Fetching songs');
    const songs = await new Promise((resolve, reject) =>
      request.get(gameLink, { headers: { Accept: 'application/json' } }, (err, res) => {
        if (err) reject(err);
        else resolve(JSON.parse(res.body));
      })
    );
    console.log(songs.length, 'songs found');
    await upsertSongs(songs.map(({ Name, URL, ModTime }) => {
      const [, charter, artist, name] = Name.match(/^\[(.*)\] (.+) - (.+)\.zip$/);
      const link = `${gameLink}${URL.slice(2)}`
      return {
        name,
        artist,
        sourceId: source.id,
        charter: charter || null,
        link,
        lastModified: ModTime
      };
    }));
  }
  console.log('Import from public.fightthe.pw/ghrb done');
  return 0;
};
