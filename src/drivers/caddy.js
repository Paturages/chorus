const Request = require('request');

const getMetaFromArchive = require('../utils/extract/archive');

const download = url => new Promise((resolve, reject) =>
  Request.get(url, { encoding: null }, (err, res) => {
    if (err) reject(err);
    else resolve(res.body);
  })
);

const defaultNameParser = txt => {
  let [, charter, artist, name] = txt.match(/\[(.*)\] (.+) - (.+)/);
  return { artist: artist.trim(), name: name.trim().replace('.zip', ''), charter: charter.trim() || null };
};

const {
  upsertSource,
  upsertSongs,
  upsertLinksToIgnore,
  getLinksMapBySource,
} = require('../utils/db');

module.exports = async ({ name, link }) => {
  console.log('Adding', name);
  // 1. Registering the source, or finding its ID if it already exists
  console.log('Registering/finding source');
  const source = await upsertSource({ name, link });
  source.chorusId = source.id;
  // 2. Get the map of already indexed links so that they don't get parsed again
  const linksMap = await getLinksMapBySource(source);
  // 3. Get the list of folders (games)
  console.log('Fetching folders');
  const folders = await new Promise((resolve, reject) =>
    Request.get(link, { headers: { Accept: 'application/json' } }, (err, res) => {
      if (err) reject(err);
      else resolve(JSON.parse(res.body));
    })
  );
  // 4. Get the songs: they're either all in the source folder (/clonehero/),
  // or they're in "game folders" (/ghrb/). Oh, and they're all .zips.
  // (I'm probably gonna be the only one using it, so whatever)
  const songList = [];
  console.log('Fetching list of songs');
  // Difference between my charter drive (/clonehero) and games drive (/ghrb)
  if (folders[0].Name.slice(-4) == '.zip') songList.push(...folders);
  else for (let i = 0; i < folders.length; i++) {
    const { Name, URL } = folders[i];
    const content = await new Promise((resolve, reject) =>
      Request.get(`${link}${URL.slice(2)}`, { headers: { Accept: 'application/json' } }, (err, res) => {
        if (err) reject(err);
        else resolve(JSON.parse(res.body));
      })
    );
    songList.push(...content.map(item => Object.assign(item, { parent: { name: Name, link: `${link}${URL.slice(2)}` } })));
  }
  const songs = [];
  const toIgnore = [];
  console.log(songList.length, 'songs found');
  for (let i = 0; i < songList.length; i++) {
    const { Name, URL, ModTime, parent } = songList[i];
    const url = `${(parent || {}).link || link}${URL.slice(2)}`;
    if (linksMap[url] && ModTime.slice(0, 19) == (linksMap[url].lastModified || '').slice(0, 19)) {
      songs.push(Object.assign(linksMap[url], { source, parent }));
      continue;
    }
    console.log('Extracting', Name);
    const metaList = await getMetaFromArchive(await download(url), 'zip');
    if (!metaList || !metaList.length) toIgnore.push({ sourceId: source.chorusId, link: url });
    else {
      const meta = metaList[0];
      // Computing default artist and song names in case there's no song.ini file,
      // and also inputing already available metadata
      const { artist: defaultArtist, name: defaultName, charter: defaultCharter } = defaultNameParser(Name);
      const song = {
        defaultArtist, defaultName, lastModified: ModTime, source, link: url, parent: parent ? {
          name: parent.name,
          link: parent.link
        } : null
      };
      console.log(`> Found "${
        meta.name || (meta.chartMeta || {}).Name || defaultName
      }" by "${
        meta.artist || (meta.chartMeta || {}).Artist || defaultArtist || '???'
      }"`);
      songs.push(Object.assign(song, meta, meta.charter ? {} : { charter: defaultCharter }));
    }
  }
  // 5. Update the list of links to ignore (e.g. invalid archives, stray files...)
  if (toIgnore.length) await upsertLinksToIgnore(toIgnore);
  // 6. Insert the songs with their metadata into the database
  if (songs.length) await upsertSongs(songs);
};
