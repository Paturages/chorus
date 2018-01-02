const Drive = require('./drive');
const Pg = require('./pg');
const readline = require('readline');

module.exports = async () => {
  await Drive.init();
  if (process.argv[2]) return;
  try {
    console.log("Creating necessary tables and indexes");
    await Pg.q`DROP TABLE IF EXISTS "Sources_new" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_new" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Sources_backup" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_backup" CASCADE`;
    try {
      await Pg.q`CREATE EXTENSION pg_trgm`;
    } catch (e) {}
    await Pg.q`CREATE TABLE "Sources_new" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "short" text,
      "name" text,
      "link" text
    )`;
    await Pg.q`CREATE UNIQUE INDEX ON public."Sources_new" USING btree(link)`;
    await Pg.q`CREATE INDEX ON public."Sources_new" USING gin(name gin_trgm_ops)`;
    await Pg.q`CREATE TABLE "Songs_new" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "name" text,
      "artist" text,
      "album" text,
      "charter" text,
      "sourceId" integer,
      "link" text,
      "lastModified" timestamp with time zone,
      "words" text,
      CONSTRAINT "Songs_new_source_fkey" FOREIGN KEY ("sourceId")
      REFERENCES public."Sources_new" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
    )`;
    await Pg.q`CREATE UNIQUE INDEX ON public."Songs_new" USING btree(link)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(artist gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(charter gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(name gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(words gin_trgm_ops)`;
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
};

