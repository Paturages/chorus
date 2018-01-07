const Pg = require('./pg');

module.exports.getNbSongs = async () => {
  return await Pg.q`SELECT COUNT(*) AS "nbSongs" FROM "Songs"`
  .then(([{ nbSongs }]) => (NB_SONGS = nbSongs));
};

module.exports.getLatestCharts = async () => {
  return await Pg.q`
    SELECT
      s.*,
      array_agg(distinct jsonb_build_object(
        'id', x."id",
        'name', x."name",
        'link', x."link",
        'parent', ss."parent"
      )) as "sources",
      array_agg(distinct jsonb_build_object(
        'hash', sh."hash",
        'part', sh."part",
        'difficulty', sh."difficulty"
      )) as "hashes"
    from "Songs_Words" sw
    join "Songs" s on s."id" = sw."songId"
    join "Songs_Sources" ss on ss."songId" = s."id"
    join "Sources" x on ss."sourceId" = x."id"
    join "Songs_Hashes" sh on sh."songId" = s."id"
    group by s."id"
    order by s."lastModified" desc
    limit 20
  `
  .then(songs => songs.map(song => Object.assign(song, {
    hashes: song.hashes.reduce((hashes, { hash, part, difficulty }) => {
      if (part == 'file') return Object.assign(hashes, { file: hash });
      if (!hashes[part]) hashes[part] = {};
      hashes[part][difficulty] = hash;
      return hashes;
    }, {})
  })))
  .then(songs => (LATEST_CHARTS = songs))
}

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
        "hasSoloSections", "hasStems", "noteCounts", "link", "lastModified"
      )
      VALUES
      ${songs.slice(i, i + 50).map(
        ({ meta: {
            name = '', artist = '', album = '', genre = '', year = '', charter = '',
            diff_band = '', diff_guitar = '', diff_bass = '', diff_rhythm = '',
            diff_drums = '', diff_vocals = '', diff_keys = '', diff_guitarghl = '',
            diff_bassghl = '', hasForced, hasOpen, hasTap, hasSections,
            hasStarPower, hasSoloSections, hasStems, noteCounts, lastModified,
            hashes, link, chartMeta = {}, frets = ''
          } }) => {
          const diffs = getDiffsFromNoteCounts(noteCounts);
          return [
            name || chartMeta.Name || null,
            artist || chartMeta.Artist || null,
            album || chartMeta.Album || null,
            genre || chartMeta.Genre || null,
            year || chartMeta.Year || null,
            charter || frets || chartMeta.Charter || null,
            diff_band || null,
            diff_guitar || null,
            diff_bass || null,
            diff_rhythm || null,
            diff_drums || null,
            diff_vocals || null,
            diff_keys || null,
            diff_guitarghl || null,
            diff_bassghl || null,
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
            noteCounts ? JSON.stringify(noteCounts) : null,
            link,
            lastModified,
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
        "noteCounts" = EXCLUDED."noteCounts"
      ${{ sql: noUpdateLastModified ? '' : `,"lastModified" = EXCLUDED."lastModified"` }}
      RETURNING "id"
    `;
    await Promise.all([
      Pg.q`
        INSERT INTO "Songs_Sources${{ sql: process.argv[2] ? '' : '_new' }}"
        ("parent", "sourceId", "songId")
        VALUES
        ${songIds.map(({ id }) => [
          songs[0].parent ? JSON.stringify(songs[0].parent) : null,
          songs[0].meta.source.chorusId,
          id
        ])}
        ON CONFLICT DO NOTHING
      `,
      Pg.q`
        INSERT INTO "Songs_Hashes${{ sql: process.argv[2] ? '' : '_new' }}"
        ("hash", "part", "difficulty", "songId")
        VALUES
        ${songIds.reduce((arr, { id }, index) => {
          for (part in songs[i + index].meta.hashes) {
            if (part == 'file') arr.push([
              songs[i + index].meta.hashes.file,
              'file',
              null,
              id
            ]);
            else for (diff in songs[i + index].meta.hashes[part]) {
              arr.push([
                songs[i + index].meta.hashes[part][diff],
                part.trim(),
                diff.trim(),
                id
              ]);
            }
          }
          return arr;
        }, [])}
        ON CONFLICT DO NOTHING
      `,
      (() => {
        let queryIndex = 1;
        let queryParams = [];
        return Pg.query(`
          INSERT INTO "Songs_Words${process.argv[2] ? '' : '_new'}"
          ("songId", "word")
          VALUES
          ${songIds.reduce((arr, { id }, index) => {
            const parent = songs[i + index].parent || {};
            const { source, name, artist, genre, album, charter } = songs[i + index].meta;
            [parent.name || '', source.name, name, artist, genre, album, charter].join(' ').split(' ').forEach(word => {
              arr.push(`($${queryIndex++}, coalesce((
                select array_to_string(array_agg(t), ' ') from unnest(tsvector_to_array(to_tsvector('english', $${queryIndex++}))) t
              ), ''))`);
              queryParams.push(id, word);
            });
            return arr;
          }, [])}
          ON CONFLICT DO NOTHING
        `, queryParams)
      })(),
    ]);
  }
};

module.exports.search = (query, offset, limit) => Pg.query(`
  select
    round(100 * avg(
      word_similarity(sw."word", array_to_string(
        tsvector_to_array(
          to_tsvector('english', 'something')
        ), ' ')
      )
    )::numeric,2) as "searchScore",
    s.*,
    array_agg(distinct jsonb_build_object(
      'id', x."id",
      'name', x."name",
      'link', x."link",
      'parent', ss."parent"
    )) as "sources",
    array_agg(distinct jsonb_build_object(
      'hash', sh."hash",
      'part', sh."part",
      'difficulty', sh."difficulty"
    )) as "hashes"
  from "Songs_Words" sw
  join "Songs" s on s."id" = sw."songId"
  join "Songs_Sources" ss on ss."songId" = s."id"
  join "Sources" x on ss."sourceId" = x."id"
  join "Songs_Hashes" sh on sh."songId" = s."id"
  group by s."id"
  order by "searchScore" desc
  limit ${+limit > 0 ? Math.max(+limit, 100) : 20}
  ${+offset ? `OFFSET ${+offset}` : ''}
`, [query])
.then(songs => songs.map(song => Object.assign(song, {
  hashes: song.hashes.reduce((hashes, { hash, part, difficulty }) => {
    if (part == 'file') return Object.assign(hashes, { file: hash });
    if (!hashes[part]) hashes[part] = {};
    hashes[part][difficulty] = hash;
    return hashes;
  }, {})
})));

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
    diff_band: '' + (song.meta.tier_band || ''),
    diff_guitar: '' + (song.meta.tier_guitar || ''),
    diff_bass: '' + (song.meta.tier_bass || ''),
    diff_rhythm: '' + (song.meta.tier_rhythm || ''),
    diff_drums: '' + (song.meta.tier_drums || ''),
    diff_vocals: '' + (song.meta.tier_vocals || ''),
    diff_keys: '' + (song.meta.tier_keys || ''),
    diff_guitarghl: '' + (song.meta.tier_guitarghl || ''),
    diff_bassghl: '' + (song.meta.tier_bassghl || ''),
    hasForced: song.meta.hasForced,
    hasOpen: song.meta.hasOpen,
    hasTap: song.meta.hasTap,
    hasSections: song.meta.hasSections,
    hasStarPower: song.meta.hasStarPower,
    hasSoloSections: song.meta.hasSoloSections,
    hasStems: song.meta.hasStems,
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
.catch(err => console.error(err.stack));
