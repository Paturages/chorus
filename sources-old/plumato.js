const Drive = require('../src/utils/drive');
const importDrive = require('../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/0B3cd4Ad4P4NiNUx3dEJtWnIxREU';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` }));
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `Plumato's drive - ${folder.name}`,
      driveShort: folder.id
    });
  }
  return 0;
};
