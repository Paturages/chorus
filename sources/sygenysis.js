const Drive = require('../src/utils/drive');
const importDrive = require('../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/0B8ZIiYD-xI8RN1VaUXUzYXMyVkU';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` }))
    .filter(
      x => !x.name.match(/\.(txt|rar)/) &&
        !x.name.match(/Drums/) // TODO: Remove this check when drums come to Clone Hero
    );
  const shocktoberFolders = await Drive.get({ q: `'${folders.find(x => x.name.match(/Shocktober/)).id}' in parents` });
  folders.push(...shocktoberFolders);
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: folder.name,
      // "driveShort" is supposed to be a lowercase codename for the drive,
      // so it can be accessed easily via an URL from Chorus.
      // Here, we just use the Google Drive folder ID because I'm a bit too lazy
      // but you can do whatever else you want.
      driveShort: folder.id,
      charterName: 'Sygenysis'
    });
  }
  return 0;
};
