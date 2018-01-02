const ls = require('ls');
const path = require('path');
const drive = require('./src/drivers/google-drive');
const txt = require('./src/drivers/txt');
const excel = require('./src/drivers/excel');
const init = require('./src/utils/init');
const exit = require('./src/utils/exit');
const { updateWords } = require('./src/utils/db');

(async () => {
  await init();
  try {
    const sources = ls(`${path.resolve(__dirname, 'sources')}/**/${process.argv[2] ? `${process.argv[2]}.*` : '*.js'}`)
      .map(({ full }) => full);
    const failed = [];
    for (let i = 0; i < sources.length; i++) {
      const driveShort = sources[i].slice(
        sources[i].lastIndexOf('/') + 1,
        sources[i].lastIndexOf('.')
      );
      try {
        if (sources[i].slice(-3) == 'txt') await txt(sources[i]);
        else if (sources[i].slice(-2) != 'js') await excel(sources[i]);
        else {
          // Skip imports
          // if (![
          //   'paturages', 'siavash', 'chezy'
          // ].find(x => x == driveShort)) continue;
          const source = require(sources[i]);
          console.log('Importing', driveShort);
          await (typeof source == 'function' ? source() : drive(Object.assign(source, { driveShort })));
        }
      } catch (err) {
        console.error(err.stack);
        console.log(driveShort, 'failed!');
        failed.push(driveShort);
      }
    }
    console.log('Updating song indexation words');
    await updateWords();
    console.log('Done!');
    if (failed.length) console.log('The following imports failed:', failed.join(', '));
    await exit();
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();
