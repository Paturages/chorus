const ls = require('ls');
const path = require('path');
const drive = require('./src/drivers/google-drive');
const init = require('./src/utils/init');
const { updateWords } = require('./src/utils/db');

(async () => {
  await init();
  try {
    const sources = ls(`${path.resolve(__dirname, 'sources')}/**/${process.argv[2] ? `${process.argv[2]}*` : '*.js'}`)
      .map(({ full }) => full);
    const failed = [];
    for (let i = 0; i < sources.length; i++) {
      const driveShort = sources[i].slice(sources[i].lastIndexOf('/') + 1, -3);
      // Skip imports
      // if ([
      //   'c3', 'c3-releases'
      // ].find(x => x == driveShort)) continue;
      const source = require(sources[i]);
      console.log('Importing', driveShort);
      try {
        await (typeof source == 'function' ? source() : drive(Object.assign(source, { driveShort })));
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
    process.exit(0);
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();
