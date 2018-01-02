const Pg = require('./pg');

module.exports = async () => {
  if (!process.argv[2]) {
    await Pg.q`ALTER TABLE "Sources" RENAME TO "Sources_backup"`;
    await Pg.q`ALTER TABLE "Songs" RENAME TO "Songs_backup"`;
    await Pg.q`ALTER TABLE "Sources_new" RENAME TO "Sources"`;
    await Pg.q`ALTER TABLE "Songs_new" RENAME TO "Songs"`;
  }
  process.exit(0);
};
