const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/0B-93AYpB5GxgUGlyaVRIek1mbnc';
const SOURCE_NAME = `BurpLeTurtle's charts`;

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` }));
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const ARTIST = folder.name;
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `${SOURCE_NAME} - ${folder.name}`,
      driveShort: folder.id,
      charterName: `BurpLeTurtle`,
      nameParser: name => {
        let [artist, ...songParts] = name.split(' - ');
        if (!songParts || !songParts.length) return { artist: ARTIST || 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
        const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
        return { artist, song };
      }
    });
  }
  await importDrive({
    driveUrl: `https://drive.google.com/drive/folders/${rootId}`,
    driveName: `${SOURCE_NAME}`,
    driveShort: 'burpleturtle',
    charterName: `BurpLeTurtle`,
    nameParser: name => {
      let [artist, ...songParts] = name.split(' - ');
      if (!songParts || !songParts.length) return { artist: ARTIST || 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
      const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
      return { artist, song };
    }
  });
  return 0;
};
