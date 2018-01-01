const Drive = require('../src/utils/drive');
const importDrive = require('../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1kazNw6LPjnbahS5s1iKAGhNkNeLDpxDW';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` })).filter(x => x.name.slice(-4) != '.rar');
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `capta1n_guitarhero - ${folder.name}`,
      driveShort: folder.id,
      charterName: 'capta1n_guitarhero'
    });
  }
  await importDrive({
    driveUrl: ROOT_FOLDER,
    driveName: `capta1n_guitarhero`,
    driveShort: rootId,
    charterName: 'capta1n_guitarhero'
  });
  return 0;
};
