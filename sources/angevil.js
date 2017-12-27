const Drive = require('../src/utils/drive');
const importDrive = require('../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1olQexhSVSD6MRQraOsyYmRdeLdMKneC8';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const folders = (await Drive.get({ q: `'${rootId}' in parents` })).filter(x => x.name != 'Icons');
  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    await importDrive({
      driveUrl: `https://drive.google.com/drive/folders/${folder.id}`,
      driveName: `Angevil - ${folder.name}`,
      driveShort: folder.id,
      charterName: 'Angevil',
      nameParser: name => {
        let [artist, ...songParts] = name.split(' - ');
        if (!songParts) return { artist: 'N/A', song: name };
        const song = songParts.join(' - ').replace(/(\.\(chart\))?\.(zip|rar)$/, '');
        return { artist, song };
      }
    });
  }
  return 0;
};
