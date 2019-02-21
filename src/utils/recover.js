const Pg = require('./pg');

const recover = async () => {
  await Pg.q`DROP TABLE IF EXISTS "LinksToIgnore_broken"`;
  await Pg.q`DROP TABLE IF EXISTS "Songs_Sources_broken"`;
  await Pg.q`DROP TABLE IF EXISTS "Songs_Hashes_broken"`;
  await Pg.q`DROP TABLE IF EXISTS "Songs_broken"`;
  await Pg.q`DROP TABLE IF EXISTS "Sources_broken"`;
  try {
    await Pg.q`ALTER TABLE "Sources" RENAME TO "Sources_broken"`;
    console.log(`ALTER TABLE "Sources" RENAME TO "Sources_broken"`);
    await Pg.q`ALTER TABLE "Songs" RENAME TO "Songs_broken"`;
    console.log(`ALTER TABLE "Songs" RENAME TO "Songs_broken"`);
    await Pg.q`ALTER TABLE "LinksToIgnore" RENAME TO "LinksToIgnore_broken"`;
    console.log(`ALTER TABLE "LinksToIgnore" RENAME TO "LinksToIgnore_broken"`);
    await Pg.q`ALTER TABLE "Songs_Hashes" RENAME TO "Songs_Hashes_broken"`;
    console.log(`ALTER TABLE "Songs_Hashes" RENAME TO "Songs_Hashes_broken"`);
    await Pg.q`ALTER TABLE "Songs_Sources" RENAME TO "Songs_Sources_broken"`;
    console.log(`ALTER TABLE "Songs_Sources" RENAME TO "Songs_Sources_broken"`);
  } catch (e) {}

  await Pg.q`ALTER TABLE "Sources_backup" RENAME TO "Sources"`;
  console.log(`ALTER TABLE "Sources_backup" RENAME TO "Sources"`);
  await Pg.q`ALTER TABLE "Songs_backup" RENAME TO "Songs"`;
  console.log(`ALTER TABLE "Songs_backup" RENAME TO "Songs"`);
  await Pg.q`ALTER TABLE "LinksToIgnore_backup" RENAME TO "LinksToIgnore"`;
  console.log(`ALTER TABLE "LinksToIgnore_backup" RENAME TO "LinksToIgnore"`);
  await Pg.q`ALTER TABLE "Songs_Hashes_backup" RENAME TO "Songs_Hashes"`;
  console.log(`ALTER TABLE "Songs_Hashes_backup" RENAME TO "Songs_Hashes"`);
  await Pg.q`ALTER TABLE "Songs_Sources_backup" RENAME TO "Songs_Sources"`;
  console.log(`ALTER TABLE "Songs_Sources_backup" RENAME TO "Songs_Sources"`);
  process.exit(0);
};

setTimeout(() => recover(), 3000);
