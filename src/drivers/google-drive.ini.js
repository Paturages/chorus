const Drive = require('../utils/drive');
const { upsertSource, upsertSongs } = require('../utils/db');

module.exports = async ({ name, link }) => {
  const source = { name, link, driveId: link.slice(
    link.indexOf('/open?id=') > -1 ?
      link.indexOf('/open?id=') + 9 :
      link.lastIndexOf('/') + 1
  ) };
  

  console.log('Registering/finding source');
  source.chorusId = (await upsertSource(source)).id;
};
