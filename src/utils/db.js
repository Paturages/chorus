const Pg = require('./pg');

module.exports.getNbSongs = () => Pg.q`SELECT COUNT(*) AS "nbSongs" FROM "Songs"`.then(([{ nbSongs }]) => nbSongs);

module.exports.getLatestCharts = () =>
  Pg.q`SELECT * FROM "Songs" ORDER BY "lastModified" DESC LIMIT 20`
  .then(songs =>
    Promise.all([
      Pg.q`
        SELECT ss."songId", s."id", s."name", s."link", ss."parent"
        FROM "Songs_Sources" ss
        JOIN "Sources" s ON ss."sourceId" = s."id"
        WHERE "songId" IN (${songs.map(({ id }) => id)})
      `,
      Pg.q`
        SELECT * FROM "Songs_Hashes"
        WHERE "songId" IN (${songs.map(({ id }) => id)})
      `
    ])
    .then(([sources, hashes]) => {
      const songMap = Object.assign({}, ...songs.map(song => ({ [song.id]: song })));
      sources.forEach(({ songId, id, name, link, parent }) => {
        if (!songMap[songId].sources) songMap[songId].sources = [];
        if (parent) delete parent.parent; // We don't need the grand-parent. (yes this is ageist)
        songMap[songId].sources.push({ id, name, link, parent });
      });
      hashes.forEach(({ songId, hash, part, difficulty }) => {
        if (!songMap[songId].hashes) songMap[songId].hashes = {};
        if (part == 'file') songMap[songId].hashes.file = hash;
        else {
          if (!songMap[songId].hashes[part]) songMap[songId].hashes[part] = {};
          songMap[songId].hashes[part][difficulty] = hash;
        }
      });
      return songs.map(({ id }) => songMap[id]); // songs is still sorted by "lastModified" desc
    })
  )
;

module.exports.upsertSource = ({ name, link }) =>
  Pg.q`
    INSERT INTO "Sources${{ sql: process.argv[2] ? '' : '_new' }}"
    ("name", "link")
    VALUES
    (${name}, ${link})
    ON CONFLICT ("link") DO UPDATE
    SET "name" = EXCLUDED."name"
    RETURNING *
  `.then(([source]) => source)
;

module.exports.upsertLinksToIgnore = (toIgnore) => Promise.all([
  Pg.q`
    INSERT INTO "LinksToIgnore${{ sql: process.argv[2] ? '' : '_new' }}"
    ("link", "sourceId")
    VALUES
    ${toIgnore.map(({ link, sourceId }) => [link, sourceId])}
    ON CONFLICT DO NOTHING
  `,
  !process.argv[2] && Pg.q`
    INSERT INTO "LinksToIgnore_new"
    ("link", "sourceId")
    SELECT "link", "sourceId" FROM "LinksToIgnore"
    WHERE "sourceId" = ${toIgnore[0].sourceId}
    ON CONFLICT DO NOTHING
  `
])
;

// The diff_* fields are basically binary maps.
// For example, 0b0001 (1) is easy only, 0b1000 (8) is expert only,
// 0b1100 (12) is expert + hard.
// At the same time, remove noteCounts which are less than 10
// to possibly fix old charts with only one note at the start
// (people shouldn't publish 10-note charts anyway)
const getDiffsFromNoteCounts = noteCounts => {
  if (!noteCounts) return {};
  const diffs = {};
  for (part in noteCounts) {
    let flag = 0;
    for (diff in noteCounts[part]) {
      switch (diff) {
        case 'e': if (noteCounts[part][diff] > 10) flag += 1;
        else delete noteCounts[part][diff];
        break;
        case 'm': if (noteCounts[part][diff] > 10) flag += 2;
        else delete noteCounts[part][diff];
        break;
        case 'h': if (noteCounts[part][diff] > 10) flag += 4;
        else delete noteCounts[part][diff];
        break;
        case 'x': if (noteCounts[part][diff] > 10) flag += 8;
        else delete noteCounts[part][diff];
        break;
      }
    }
    if (flag) diffs[part] = flag;
  }
  return diffs;
};
module.exports.upsertSongs = async (songs, noUpdateLastModified) => {
  // Checking that a link doesn't appear twice
  songs = Object.values(songs.reduce((obj, song) => Object.assign(obj, { [song.link]: song }), {}));
  for (let i = 0; i < songs.length; i += 50) {
    console.log('Inserting from', i, 'to', Math.min(i + 50, songs.length));
    const songIds = await Pg.q`
      INSERT INTO "Songs${{ sql: process.argv[2] ? '' : '_new' }}"
      (
        "name", "artist", "album", "genre", "year", "charter",
        "tier_band", "tier_guitar", "tier_bass", "tier_rhythm",
        "tier_drums", "tier_vocals", "tier_keys", "tier_guitarghl",
        "tier_bassghl", "diff_guitar", "diff_bass", "diff_rhythm",
        "diff_drums", "diff_keys", "diff_guitarghl", "diff_bassghl",
        "hasForced", "hasOpen", "hasTap", "hasSections", "hasStarPower",
        "hasSoloSections", "hasStems", "hasVideo", "noteCounts", "link",
        "lastModified", "words"
      )
      VALUES
      ${songs.slice(i, i + 50).map(
        ({
          name = '', artist = '', album = '', genre = '', year = '', charter = '',
          diff_band = -1, diff_guitar = -1, diff_bass = -1, diff_rhythm = -1,
          diff_drums = -1, diff_vocals = -1, diff_keys = -1, diff_guitarghl = -1,
          diff_bassghl = -1, hasForced, hasOpen, hasTap, hasSections,
          hasStarPower, hasSoloSections, hasStems, hasVideo, noteCounts, lastModified,
          hashes, link, chartMeta = {}, source, parent = {}, frets = ''
        }) => {
          const diffs = getDiffsFromNoteCounts(noteCounts);
          return [
            name || chartMeta.Name || null,
            artist || chartMeta.Artist || null,
            album || chartMeta.Album || null,
            genre || chartMeta.Genre || null,
            year || chartMeta.Year || null,
            charter || frets || chartMeta.Charter || null,
            +diff_band >= 0 ? +diff_band >> 0 : null,
            +diff_guitar >= 0 ? +diff_guitar >> 0 : null,
            +diff_bass >= 0 ? +diff_bass >> 0 : null,
            +diff_rhythm >= 0 ? +diff_rhythm >> 0 : null,
            +diff_drums >= 0 ? +diff_drums >> 0 : null,
            +diff_vocals >= 0 ? +diff_vocals >> 0 : null,
            +diff_keys >= 0 ? +diff_keys >> 0 : null,
            +diff_guitarghl >= 0 ? +diff_guitarghl >> 0 : null,
            +diff_bassghl >= 0 ? +diff_bassghl >> 0 : null,
            diffs.guitar,
            diffs.bass,
            diffs.rhythm,
            diffs.drums,
            diffs.keys,
            diffs.guitarghl,
            diffs.bassghl,
            hasForced,
            hasOpen,
            hasTap,
            hasSections,
            hasStarPower,
            hasSoloSections,
            hasStems,
            hasVideo,
            noteCounts ? JSON.stringify(noteCounts) : null,
            link,
            lastModified,
            [
              name, artist, album, genre, year, charter, name,
              source.name, parent && parent.name,
              (() => {
                // Initials
                const words = name.split(' ').filter(word => word[0].match(/[A-z]/));
                if (words.length < 3) return;
                return words.map(word => word[0]).join('');
              })
            ].filter(x => x).join(' ').toLowerCase()
          ];
        }
      )}
      ON CONFLICT ("link") DO UPDATE
      SET "name" = EXCLUDED."name",
        "artist" = EXCLUDED."artist",
        "album" = EXCLUDED."album",
        "genre" = EXCLUDED."genre",
        "year" = EXCLUDED."year",
        "charter" = EXCLUDED."charter",
        "tier_band" = EXCLUDED."tier_band",
        "tier_guitar" = EXCLUDED."tier_guitar",
        "tier_bass" = EXCLUDED."tier_bass",
        "tier_rhythm" = EXCLUDED."tier_rhythm",
        "tier_drums" = EXCLUDED."tier_drums",
        "tier_vocals" = EXCLUDED."tier_vocals",
        "tier_keys" = EXCLUDED."tier_keys",
        "tier_guitarghl" = EXCLUDED."tier_guitarghl",
        "tier_bassghl" = EXCLUDED."tier_bassghl",
        "diff_guitar" = EXCLUDED."diff_guitar",
        "diff_bass" = EXCLUDED."diff_bass",
        "diff_rhythm" = EXCLUDED."diff_rhythm",
        "diff_drums" = EXCLUDED."diff_drums",
        "diff_keys" = EXCLUDED."diff_keys",
        "diff_guitarghl" = EXCLUDED."diff_guitarghl",
        "diff_bassghl" = EXCLUDED."diff_bassghl",
        "hasForced" = EXCLUDED."hasForced",
        "hasOpen" = EXCLUDED."hasOpen",
        "hasTap" = EXCLUDED."hasTap",
        "hasSections" = EXCLUDED."hasSections",
        "hasStarPower" = EXCLUDED."hasStarPower",
        "hasSoloSections" = EXCLUDED."hasSoloSections",
        "hasStems" = EXCLUDED."hasStems",
        "noteCounts" = EXCLUDED."noteCounts",
        "words" = EXCLUDED."words"
      ${{ sql: noUpdateLastModified ? '' : `,"lastModified" = EXCLUDED."lastModified"` }}
      RETURNING "id"
    `;
    await Promise.all([
      Pg.q`
        INSERT INTO "Songs_Sources${{ sql: process.argv[2] ? '' : '_new' }}"
        ("parent", "sourceId", "songId")
        VALUES
        ${songIds.map(({ id }, index) => [
          songs[index].parent ? JSON.stringify(songs[index].parent) : null,
          songs[index].source.chorusId,
          id
        ])}
        ON CONFLICT DO NOTHING
      `,
      Pg.q`
        INSERT INTO "Songs_Hashes${{ sql: process.argv[2] ? '' : '_new' }}"
        ("hash", "part", "difficulty", "songId")
        VALUES
        ${songIds.reduce((arr, { id }, index) => {
          for (part in songs[i + index].hashes) {
            if (part == 'file') arr.push([
              songs[i + index].hashes.file,
              'file',
              null,
              id
            ]);
            else for (diff in songs[i + index].hashes[part]) {
              arr.push([
                songs[i + index].hashes[part][diff],
                part.trim(),
                diff.trim(),
                id
              ]);
            }
          }
          return arr;
        }, [])}
        ON CONFLICT DO NOTHING
      `
    ]);
  }
};

module.exports.search = (query, offset, limit) => Pg.query(`
  select round(100 * similarity(s."words", $1)::numeric, 2) as "searchScore", *
  from "Songs" s
  order by "searchScore" desc
  limit ${+limit > 0 ? Math.max(+limit, 100) : 20}
  ${+offset ? `OFFSET ${+offset}` : ''}
`, [query])
.then(songs =>
  Promise.all([
    Pg.q`
      SELECT ss."songId", s."id", s."name", s."link", ss."parent"
      FROM "Songs_Sources" ss
      JOIN "Sources" s ON ss."sourceId" = s."id"
      WHERE "songId" IN (${songs.map(({ id }) => id)})
    `,
    Pg.q`
      SELECT * FROM "Songs_Hashes"
      WHERE "songId" IN (${songs.map(({ id }) => id)})
    `
  ])
  .then(([sources, hashes]) => {
    const songMap = Object.assign({}, ...songs.map(song => ({ [song.id]: song })));
    sources.forEach(({ songId, id, name, link, parent }) => {
      if (!songMap[songId].sources) songMap[songId].sources = [];
      if (parent) delete parent.parent; // We don't need the grand-parent. (yes this is ageist)
      songMap[songId].sources.push({ id, name, link, parent });
    });
    hashes.forEach(({ songId, hash, part, difficulty }) => {
      if (!songMap[songId].hashes) songMap[songId].hashes = {};
      if (part == 'file') songMap[songId].hashes.file = hash;
      else {
        if (!songMap[songId].hashes[part]) songMap[songId].hashes[part] = {};
        songMap[songId].hashes[part][difficulty] = hash;
      }
    });
    return songs.map(({ id }) => songMap[id]); // songs is still sorted by "lastModified" desc
  })
);

module.exports.getLinksMapBySource = ({ link }) => Promise.all([
  Pg.q`
    select s.link, row_to_json(s) as "meta", sh."hashes"
    from "Songs_Sources" ss
    join "Songs" s on ss."songId" = s."id"
    join (
      select "songId", array_agg(row_to_json(sh)) as "hashes"
      from "Songs_Hashes" sh
      group by "songId"
    ) sh on sh."songId" = s."id"
    where ss."sourceId" = (
      select "id" from "Sources"
      where "link" = ${link}
    )
  `,
  Pg.q`
    select "link"
    from "LinksToIgnore"
    where "sourceId" = (
      select "id" from "Sources"
      where "link" = ${link}
    )
  `
]).then(
  ([songs, toIgnore]) => Object.assign({}, ...songs.concat(toIgnore).map(song => ({ [song.link]: song.meta ? {
    name: song.meta.name,
    artist: song.meta.artist,
    album: song.meta.album,
    genre: song.meta.genre,
    year: song.meta.year,
    charter: song.meta.charter,
    diff_band: '' + (song.meta.tier_band == null ? -1 : song.meta.tier_band),
    diff_guitar: '' + (song.meta.tier_guitar == null ? -1 : song.meta.tier_guitar),
    diff_bass: '' + (song.meta.tier_bass == null ? -1 : song.meta.tier_bass),
    diff_rhythm: '' + (song.meta.tier_rhythm == null ? -1 : song.meta.tier_rhythm),
    diff_drums: '' + (song.meta.tier_drums == null ? -1 : song.meta.tier_drums),
    diff_vocals: '' + (song.meta.tier_vocals == null ? -1 : song.meta.tier_vocals),
    diff_keys: '' + (song.meta.tier_keys == null ? -1 : song.meta.tier_keys),
    diff_guitarghl: '' + (song.meta.tier_guitarghl == null ? -1 : song.meta.tier_guitarghl),
    diff_bassghl: '' + (song.meta.tier_bassghl == null ? -1 : song.meta.tier_bassghl),
    hasForced: song.meta.hasForced,
    hasOpen: song.meta.hasOpen,
    hasTap: song.meta.hasTap,
    hasSections: song.meta.hasSections,
    hasStarPower: song.meta.hasStarPower,
    hasSoloSections: song.meta.hasSoloSections,
    hasStems: song.meta.hasStems,
    hasVideo: song.meta.hasVideo,
    noteCounts: song.meta.noteCounts,
    link: song.meta.link,
    lastModified: song.meta.lastModified,
    hashes: (() => {
      const parts = {};
      song.hashes.forEach(({ hash, part, difficulty }) => {
        if (!parts[part]) parts[part] = {};
        if (part == 'file') parts.file = hash;
        else parts[part][difficulty] = hash;
      });
      return parts;
    })(),
  } : { ignore: true } })))
)
.catch(err => console.error(err.stack) || {});
