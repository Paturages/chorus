const Pg = require('./pg');
const Fs = require('fs');
const Path = require('path');
const { promisify } = require('util');

module.exports = async () => {
  if (!process.argv[2]) {
    await Pg.q`ALTER TABLE IF EXISTS "Sources" RENAME TO "Sources_backup"`;
    await Pg.q`ALTER TABLE IF EXISTS "Songs" RENAME TO "Songs_backup"`;
    await Pg.q`ALTER TABLE IF EXISTS "LinksToIgnore" RENAME TO "LinksToIgnore_backup"`;
    await Pg.q`ALTER TABLE IF EXISTS "Songs_Hashes" RENAME TO "Songs_Hashes_backup"`;
    await Pg.q`ALTER TABLE IF EXISTS "Songs_Sources" RENAME TO "Songs_Sources_backup"`;
    await Pg.q`ALTER TABLE "Sources_new" RENAME TO "Sources"`;
    await Pg.q`ALTER TABLE "Songs_new" RENAME TO "Songs"`;
    await Pg.q`ALTER TABLE "LinksToIgnore_new" RENAME TO "LinksToIgnore"`;
    await Pg.q`ALTER TABLE "Songs_Hashes_new" RENAME TO "Songs_Hashes"`;
    await Pg.q`ALTER TABLE "Songs_Sources_new" RENAME TO "Songs_Sources"`;
  }
  await promisify(Fs.writeFile)(Path.resolve(__dirname, '..', '..', 'build', 'lastupdate.json'), JSON.stringify({
    lastUpdate: new Date().toISOString()
  }), 'utf8');
  process.exit(0);
};
