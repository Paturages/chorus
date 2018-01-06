const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1-sdXHaJYmseTmK_inPKt2q3raYwHdbzI';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` }));
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `Pink Floyd - ${folder.name}`,
      driveShort: folder.id,
      nameParser: name => {
        let [artist, ...songParts] = name.split(' - ');
        if (!songParts || !songParts.length) return { artist: 'Pink Floyd', song: name.replace(/\.(zip|rar)$/, '') };
        const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
        return { artist, song };
      }
    });
  }
  return 0;
};
