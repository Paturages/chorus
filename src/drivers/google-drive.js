const Drive = require('../utils/drive');
const { upsertSource, upsertSongs } = require('../utils/db');

module.exports = async ({
  driveShort,
  driveName,
  driveUrl,
  charterName,
  nameParser = name => {
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts || !songParts.length) return { artist: 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
    const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
    return { artist, song };
  }
}) => {
  console.log('Registering or finding source');
  const source = await upsertSource({
    short: driveShort,
    name: driveName,
    link: driveUrl
  });
  const driveId = driveUrl.slice(driveUrl.lastIndexOf('/') + 1);
  console.log('Browsing releases...');
  const songs = await Drive.get({
    q: `'${driveId}' in parents`,
    fields: 'nextPageToken, files(id, name, modifiedTime, webViewLink)'
  });
  console.log(songs.length, 'songs found');
  await upsertSongs(songs.map(({ id, name, modifiedTime, webViewLink }) => {
    const { artist, song } = nameParser(name);
    return {
      name: song,
      artist,
      sourceId: source.id,
      charter: charterName,
      link: webViewLink,
      lastModified: modifiedTime
    };
  }));
  console.log(driveName, 'imported!');
  return 0;
};
