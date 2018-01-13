const Iconv = require('iconv-lite');
const crypto = require('crypto');
if (!process.env.HASH_SECRET) console.log('WARNING: HASH_SECRET not defined for sha256');
const getSha = txt => {
  const hash = crypto.createHmac(
    'sha256',
    process.env.HASH_SECRET ||
    'this should really be defined for production runs'
  );
  hash.update(txt);
  return hash.digest('hex');
};

// To avoid people overwriting useful metadata
const fieldBlacklist = {
  link: true,
  source: true,
  lastModified: true
};

const diffMap = {
  '[ExpertSingle]': 'guitar.x',
  '[HardSingle]': 'guitar.h',
  '[MediumSingle]': 'guitar.m',
  '[EasySingle]': 'guitar.e',

  '[ExpertDoubleBass]': 'bass.x',
  '[HardDoubleBass]': 'bass.h',
  '[MediumDoubleBass]': 'bass.m',
  '[EasyDoubleBass]': 'bass.e',

  '[ExpertDoubleRhythm]': 'rhythm.x',
  '[HardDoubleRhythm]': 'rhythm.h',
  '[MediumDoubleRhythm]': 'rhythm.m',
  '[EasyDoubleRhythm]': 'rhythm.e',

  '[ExpertKeyboard]': 'keys.x',
  '[HardKeyboard]': 'keys.h',
  '[MediumKeyboard]': 'keys.m',
  '[EasyKeyboard]': 'keys.e',

  '[ExpertDrums]': 'drums.x',
  '[HardDrums]': 'drums.h',
  '[MediumDrums]': 'drums.m',
  '[EasyDrums]': 'drums.e',

  '[ExpertGHLGuitar]': 'guitarghl.x',
  '[HardGHLGuitar]': 'guitarghl.h',
  '[MediumGHLGuitar]': 'guitarghl.m',
  '[EasyGHLGuitar]': 'guitarghl.e',

  '[ExpertGHLBass]': 'bassghl.x',
  '[HardGHLBass]': 'bassghl.h',
  '[MediumGHLBass]': 'bassghl.m',
  '[EasyGHLBass]': 'bassghl.e',
};

// For normalizing the note numbers for the hashes,
// goes from 1 to 5 for regular frets,
// 6 for the 6th fret of GHL
// and 7 for open notes
const notesMap = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 8: 6, 7: 7 };

module.exports = chart => {
  try {
    const utf8 = Iconv.decode(chart, 'utf8');
    chart = utf8.indexOf('�') >= 0 ? Iconv.decode(chart, 'latin1') : utf8;
    // Trim each line because of Windows \r\n shenanigans
    const lines = chart.split('\n').map(line => line.trim());
    // Get song metadata from the [Song] section as a backup to the song.ini
    const songIndex = lines.indexOf('[Song]');
    // Catch invalid files
    if (songIndex < 0) return {};
    const chartMeta = {};
    for (let i = 1; lines[i] != null && lines[i] != '}'; i++) {
      let [param, value] = lines[i].split(' = ');
      if (!value || !value.trim() || fieldBlacklist[param.trim()]) continue;
      param = param.trim();
      value = value.trim();
      if (value[0] == '"') value = value.slice(1, -1);
      // For some reason, there's an extra ", " in front of the year
      if (param == 'Year') value = value.replace(', ', '');
      chartMeta[param] = value;
    }
    /*
      Detect sections:
      A song with no sections matches the following:
      [Events]
      {
      }
    */
    const eventsIndex = lines.indexOf('[Events]');
    // Catch invalid files
    if (eventsIndex < 0) return { chartMeta };
    const hasSections = lines[eventsIndex + 2] != '}';
    // Detect features
    let currentStatus;
    let hasStarPower = false, hasForced = false,
      hasTap = false, hasOpen = {},
      hasSoloSections = false;
    const notes = {};
    for (let i = eventsIndex; i < lines.length; i++) {
      const line = lines[i];
      const last5 = line.slice(-5);
      if (last5 == 'N 5 0') hasForced = true;
      else if (last5 == 'N 6 0') hasTap = true;
      // Just flag open notes for the whole instrument
      else if (last5 == 'N 7 0') hasOpen[currentStatus.slice(0, currentStatus.indexOf('.'))] = true;
      else if (last5 == ' solo') hasSoloSections = true;
      else if (line.match(/S 2/)) hasStarPower = true;

      // Detect new difficulty
      if (diffMap[line]) {
        currentStatus = diffMap[line];
        notes[currentStatus] = {};
      }
      // Detect new notes
      const [, index, note] = line.match(/(\d+) = N ([0-4]|7|8) /) || [];
      if (note && currentStatus) {
        notes[currentStatus][index] = `${(notes[currentStatus][index] || '')}${notesMap[note]}`;
      }
    }
    // Compute the hash of the .chart itself first
    const hashes = { file: getSha(chart) };
    const noteCounts = {};
    let earliestNote = +Infinity, latestNote = 0;
    for (let part in notes) {
      const [instrument, difficulty] = part.split('.');
      // We have to reorder the values by ascending index (Object.values gets by "alphabetical" order of index)
      const notesArray = Object.keys(notes[part]).sort((a, b) => +a < +b ? -1 : 1).map(index => {
        index = +index;
        if (index < earliestNote) earliestNote = index;
        if (index > latestNote) latestNote = index;
        return notes[part][index];
      });
      // Ignore tracks with less than 10 notes
      if (notesArray.length < 10) continue;
      if (!hashes[instrument]) {
        hashes[instrument] = {};
        noteCounts[instrument] = {};
      }
      // Compute the hashes and note counts of individual difficulties/instruments
      noteCounts[instrument][difficulty] = notesArray.length;
      hashes[instrument][difficulty] = getSha(notesArray.join(' '));
    }
    return { hasSections, hasStarPower, hasForced, hasTap, hasOpen, hasSoloSections, noteCounts, hashes, chartMeta };
  } catch (err) {
    console.error(err.stack);
    return {};
  }
};
