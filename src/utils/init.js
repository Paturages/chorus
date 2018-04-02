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
    await Pg.q`DROP TABLE IF EXISTS "LinksToIgnore_new" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_Hashes_new" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_Sources_new" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Sources_backup" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_backup" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "LinksToIgnore_backup" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_Hashes_backup" CASCADE`;
    await Pg.q`DROP TABLE IF EXISTS "Songs_Sources_backup" CASCADE`;
    await Pg.q`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
    await Pg.q`CREATE TABLE "Sources_new" (
      "id" SERIAL NOT NULL PRIMARY KEY,
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
      "genre" text,
      "year" text,
      "charter" text,
      "length" integer,
      "effectiveLength" integer,
      "tier_band" smallint,
      "tier_guitar" smallint,
      "tier_bass" smallint,
      "tier_rhythm" smallint,
      "tier_drums" smallint,
      "tier_vocals" smallint,
      "tier_keys" smallint,
      "tier_guitarghl" smallint,
      "tier_bassghl" smallint,
      "diff_guitar" smallint,
      "diff_bass" smallint,
      "diff_rhythm" smallint,
      "diff_drums" smallint,
      "diff_keys" smallint,
      "diff_guitarghl" smallint,
      "diff_bassghl" smallint,
      "isPack" boolean,
      "hasForced" boolean,
      "hasOpen" jsonb,
      "hasTap" boolean,
      "hasSections" boolean,
      "hasStarPower" boolean,
      "hasSoloSections" boolean,
      "hasStems" boolean,
      "hasVideo" boolean,
      "noteCounts" jsonb,
      "lastModified" timestamp,
      "indexedTime" timestamp,
      "uploadedAt" timestamp,
      "link" text,
      "directLinks" jsonb,
      "words" text
    )`;
    await Pg.q`CREATE UNIQUE INDEX ON public."Songs_new" USING btree(link)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_band)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_guitar)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_bass)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_rhythm)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_drums)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_vocals)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_keys)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_guitarghl)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(tier_bassghl)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_guitar)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_bass)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_rhythm)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_drums)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_keys)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_guitarghl)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree(diff_bassghl)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING btree("lastModified")`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(name gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(artist gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(album gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(genre gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(charter gin_trgm_ops)`;
    await Pg.q`CREATE INDEX ON public."Songs_new" USING gin(words gin_trgm_ops)`;
    await Pg.q`CREATE TABLE "Songs_Sources_new" (
      "parent" jsonb,
      "sourceId" integer,
      "songId" integer,
      PRIMARY KEY ("sourceId", "songId"),
      FOREIGN KEY ("sourceId")
      REFERENCES public."Sources_new" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE,
      FOREIGN KEY ("songId")
      REFERENCES public."Songs_new" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
    )`;
    await Pg.q`CREATE TABLE "Songs_Hashes_new" (
      "hash" char(32),
      "part" text,
      "difficulty" char(1),
      "songId" integer,
      FOREIGN KEY ("songId")
      REFERENCES public."Songs_new" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
    )`;
    await Pg.q`CREATE UNIQUE INDEX ON "Songs_Hashes_new" USING btree("hash", "songId", "part", "difficulty")`;
    await Pg.q`CREATE INDEX ON "Songs_Hashes_new" USING hash("hash")`;
    await Pg.q`CREATE TABLE "LinksToIgnore_new" (
      "link" text,
      "sourceId" integer,
      PRIMARY KEY ("sourceId", "link"),
      FOREIGN KEY ("sourceId")
      REFERENCES public."Sources_new" (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
    )`;
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
};

