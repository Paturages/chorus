const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1a0t_iQS9J9ccz_XGq3SuVzmc8mv48Ts8';
const ARTIST = null;
const SOURCE_NAME = 'Video games';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` }));
  const subfolders = [];
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const subfolderPayload = await Drive.get({ q: `'${folder.id}' in parents and mimeType = 'application/vnd.google-apps.folder'` });
    for (let j = 0; j < subfolderPayload.length; j++) {
      const subfolder = subfolderPayload[j];
      console.log('Checking if', subfolder.name, 'is not a chart folder');
      const subfolderContent = await Drive.get({ q: `'${subfolder.id}' in parents` });
      if (!subfolderContent.find(({ name }) => name == 'notes.chart' || name == 'notes.mid')) {
        subfolder.name = `${folder.name} - ${subfolder.name}`;
        subfolders.push(subfolder);
      }
    }
  }
  folders.push(...subfolders);
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
  return 0;
};
