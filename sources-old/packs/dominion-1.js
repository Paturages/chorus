const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1DDqw9n2IV1FchgyKkTORVLh_qTQlxN47';
const ARTIST = null;
const SOURCE_NAME = 'Dominion 1';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` }));
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `${SOURCE_NAME} - ${folder.name}`,
      driveShort: folder.id,
      nameParser: name => {
        if (['.png', '.ini', '.mid', '.ogg'].indexOf(name.slice(-4)) > -1) return {};
        let [artist, ...songParts] = name.split(' - ');
        artist = artist.replace(/^.+ *\. /, '')
        if (!songParts || !songParts.length) return { artist: ARTIST || 'N/A', song: name };
        let song = songParts.join(' - ');
        return { artist, song };
      }
    });
  }
  return 0;
};
