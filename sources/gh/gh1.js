const Drive = require('../../src/utils/drive');
const importDrive = require('../../src/drivers/google-drive');
const ROOT_FOLDER = 'https://drive.google.com/drive/folders/1G9w2zgnMgWkvrzvGPB02hIn5NR8pm_Ni';

module.exports = async () => {
  const rootId = ROOT_FOLDER.slice(ROOT_FOLDER.lastIndexOf('/') + 1);
  const tiers = (await Drive.get({ q: `'${rootId}' in parents` }));
  for (let j = 0; j < tiers.length; j++) {
    const tier = tiers[j];
    await importDrive({
      charterName: 'Harmonix',
      driveUrl: `https://drive.google.com/drive/folders/${tier.id}`,
      driveName: `Guitar Hero I - ${tier.name}`,
      driveShort: tier.id,
      nameParser: name => {
        name = name.slice(name.indexOf('.') + 2);
        let [artist, ...songParts] = name.split(' - ');
        if (!songParts || !songParts.length) return { artist: 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
        const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
        return { artist, song };
      }
    });
  }
  return 0;
};
