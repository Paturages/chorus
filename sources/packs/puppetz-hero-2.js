const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1bxETC1BIaAiujmDDEYhljrxBFW7pbH84';
const ARTIST = null;
const SOURCE_NAME = 'Puppetz Hero II';

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
        if (['label.png', 'Thumbs.db', '.fofix-cache'].indexOf(name) > -1) return {};
        let [artist, ...songParts] = name.split(' - ');
        artist = artist.replace(/^\d+ *\. /, '')
        if (!songParts || !songParts.length) return { artist: ARTIST || 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
        let song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
        song = song.replace(/ \[ENCORE\]/, '');
        return { artist, song };
      }
    });
  }
  return 0;
};
