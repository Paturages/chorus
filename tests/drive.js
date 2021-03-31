const Drive = require('../src/utils/drive');
const fs = require('fs').promises;

const ids = `https://drive.google.com/open?id=1qP7k203x0s0FaaCpOVpZakniaS4dTBiW`.split('\n').map(link => link.split('id=')[1]);

Drive.init()
.then(async () => {
  for (const id of ids) {
    const buffer = await Drive.get(id);
    await fs.writeFile(`${__dirname}/archives/test.7z`, Buffer.from(buffer));
    // console.log(`E:\\CSCCS\\!open\\ss\\${id}.png`);
  }
})
.then(x => console.log(x))
.catch(err => err.response ? console.error(Buffer.from(err.response.data).toString('utf-8')) : console.error(err.stack));
