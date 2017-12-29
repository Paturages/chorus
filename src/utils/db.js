const Pg = require('./pg');

let NB_SONGS;
let LATEST_CHARTS;

module.exports.getNbSongs = async () => {
  if (NB_SONGS != null) return NB_SONGS;
  return await Pg.q`SELECT COUNT(*) AS "nbSongs" FROM "Songs"`
  .then(([{ nbSongs }]) => (NB_SONGS = nbSongs));
};

module.exports.getLatestCharts = async () => {
  if (LATEST_CHARTS != null) return LATEST_CHARTS;
  return await Pg.q`
    select
      s."name",
      s."artist",
      s."charter",
      x."name" as "source",
      x."link" as "sourceLink",
      s."link",
      s."lastModified"
    from "Songs" s
    join "Sources" x on x."id" = s."sourceId"
    order by s."lastModified" desc
    limit 20
  `
  .then(songs => (LATEST_CHARTS = songs));
};

module.exports.upsertSource = ({ short, name, link }) =>
  Pg.q`
    INSERT INTO "Sources"
    ("short", "name", "link")
    VALUES
    (${short}, ${name}, ${link})
    ON CONFLICT ("link") DO UPDATE
    SET "short" = EXCLUDED."short",
    "name" = EXCLUDED."name"
    RETURNING *
  `.then(([source]) => source)
;

module.exports.upsertSongs = async (songs, noUpdateLastModified) => {
  songs = songs.filter(song => song.name);
  for (let i = 0; i < songs.length; i += 1000) {
    console.log('Inserting from', i, 'to', Math.min(i + 1000, songs.length));
    await Pg.q`
      INSERT INTO "Songs"
      ("name", "artist", "sourceId", "charter", "link", "lastModified")
      VALUES
      ${songs.slice(i, i + 1000).map(
        ({ name, artist, sourceId, charter, link, lastModified }) =>
          [name, artist, sourceId, charter, link, lastModified]
      )}
      ON CONFLICT ("link") DO UPDATE
      SET "name" = EXCLUDED."name",
      "artist" = EXCLUDED."artist",
      "charter" = EXCLUDED."charter",
      "sourceId" = EXCLUDED."sourceId"
      ${{ sql: noUpdateLastModified ? '' : `,"lastModified" = EXCLUDED."lastModified"` }}
    `;
  }
};

module.exports.updateWords = async () => Pg.q`
  update "Songs" s set words = array_to_string(tsvector_to_array(
    setweight(to_tsvector('english', coalesce("artist",'')), 'A') ||
    setweight(to_tsvector('english', coalesce("name",'')), 'A') ||
    setweight(to_tsvector('simple', coalesce("charter",'')), 'B') ||
    setweight(to_tsvector('english', (SELECT "name" FROM "Sources" WHERE "id" = s."sourceId")), 'B')
  ), ' ');
`;

module.exports.search = (query, offset, limit) => Pg.query(`
  select
    s."name",
    s."artist",
    s."charter",
    x."name" as "source",
    x."link" as "sourceLink",
    x."short" as "sourceShort",
    s."link",
    s."lastModified"
  from "Songs" s
  join "Sources" x on x."id" = s."sourceId"
  order by similarity(
    s."words",
    array_to_string(tsvector_to_array(to_tsvector('english', $1)), ' ')
  ) desc
  limit ${+limit > 0 ? Math.max(+limit, 100) : 20}
  ${+offset ? `OFFSET ${+offset}` : ''}
`, [query]);

module.exports.getByCharter = (charter, offset, limit) => Pg.query(`
  select
    s."name",
    s."artist",
    s."charter",
    x."name" as "source",
    x."link" as "sourceLink",
    x."short" as "sourceShort",
    s."link",
    s."lastModified"
  from "Songs" s
  join "Sources" x on x."id" = s."sourceId"
  where lower(s."charter") = lower($1)
  order by s."lastModified" desc
  limit ${+limit > 0 ? Math.max(+limit, 100) : 20}
  ${+offset ? `OFFSET ${+offset}` : ''}
`, [charter]);

module.exports.getByArtist = (artist, offset, limit) => Pg.query(`
  select
    s."name",
    s."artist",
    s."charter",
    x."name" as "source",
    x."link" as "sourceLink",
    x."short" as "sourceShort",
    s."link",
    s."lastModified"
  from "Songs" s
  join "Sources" x on x."id" = s."sourceId"
  where lower(s."artist") = lower($1)
  order by s."lastModified" desc
  limit ${+limit > 0 ? Math.max(+limit, 100) : 20}
  ${+offset ? `OFFSET ${+offset}` : ''}
`, [artist]);

module.exports.getBySource = (short, offset, limit) => Pg.query(`
  select
    s."name",
    s."artist",
    s."charter",
    x."name" as "source",
    x."link" as "sourceLink",
    s."link",
    s."lastModified"
  from "Songs" s
  join "Sources" x on x."id" = s."sourceId"
  where lower(x."short") = lower($1)
  order by s."lastModified" desc
  limit ${+limit > 0 ? Math.max(+limit, 100) : 20}
  ${+offset ? `OFFSET ${+offset}` : ''}
`, [short]);
