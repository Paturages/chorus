const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1Cr0Ev7Kx4j_BjnNNVWpgqLgQQEqIw2vA';
const ARTIST = null;
const SOURCE_NAME = 'Movies & TV';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder'` }));
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `${SOURCE_NAME} - ${folder.name}`,
      driveShort: folder.id,
      nameParser: name => {
        let [artist, ...songParts] = name.split(' - ');
        if (!songParts || !songParts.length) return { artist: ARTIST || 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
        const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
        return { artist, song };
      }
    });
  }
  await importDrive({
    driveUrl: ROOT_FOLDER,
    driveName: `${SOURCE_NAME}`,
    driveShort: 'movies-and-tv',
    nameParser: name => {
      let [artist, ...songParts] = name.split(' - ');
      if (!songParts || !songParts.length) {
        if (name.slice(0, 5) == 'New (') return {};
        return { artist: ARTIST || 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
      }
      const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
      return { artist, song };
    }
  });
  return 0;
};
