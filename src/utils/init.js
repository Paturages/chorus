const Drive = require('./drive');
const Pg = require('./pg');
const readline = require('readline');

const VERSION = "0.0.1";

module.exports = async () => {
  await Drive.init();
  try {
    const [{ version }] = await Pg.q`SELECT "version" FROM "Version"`;
    if (version !== VERSION) {
      await Pg.q`DROP TABLE IF EXISTS "Sources" CASCADE`;
      await Pg.q`DROP TABLE IF EXISTS "Songs" CASCADE`;
      throw new Error('New version');
    }
  } catch (err) {
    // If the tables do not seem to exist, trigger the table creation script
    if (err.message === 'New version' || err.message.indexOf('relation "Version" does not exist') > -1) {
      console.log("Creating necessary tables and indexes");
      try {
        await Pg.q`CREATE EXTENSION pg_trgm`;
      } catch (e) { }
      if (err.message === 'New version') {
        await Pg.q`UPDATE "Version" SET "version" = ${VERSION}`;
      } else {
        await Pg.q`CREATE TABLE "Version" ("version" text)`;
        await Pg.q`INSERT INTO "Version" VALUES (${VERSION})`;
      }
      await Pg.q`CREATE TABLE "Sources" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "short" text,
        "name" text,
        "link" text
      )`;
      await Pg.q`CREATE UNIQUE INDEX "Sources_link"
      ON public."Sources" USING btree(link)`;
      await Pg.q`CREATE INDEX "Sources_trgm_name"
      ON public."Sources" USING gin(name gin_trgm_ops)`;
      await Pg.q`CREATE TABLE "Songs" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" text,
        "artist" text,
        "album" text,
        "charter" text,
        "sourceId" integer,
        "link" text,
        "lastModified" timestamp with time zone,
        "words" text,
        CONSTRAINT "Songs_source_fkey" FOREIGN KEY ("sourceId")
        REFERENCES public."Sources" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
      )`;
      await Pg.q`CREATE UNIQUE INDEX "Songs_link"
      ON public."Songs" USING btree(link)`;
      await Pg.q`CREATE INDEX "Songs_trgm_artist"
      ON public."Songs" USING gin(artist gin_trgm_ops)`;
      await Pg.q`CREATE INDEX "Songs_trgm_charter"
      ON public."Songs" USING gin(charter gin_trgm_ops)`;
      await Pg.q`CREATE INDEX "Songs_trgm_name"
      ON public."Songs" USING gin(name gin_trgm_ops)`;
      await Pg.q`CREATE INDEX "Songs_trgm_words"
      ON public."Songs" USING gin(words gin_trgm_ops)`;
    } else {
      console.error(err.stack);
      process.exit(1);
    }
  }
};

