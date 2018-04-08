const Iconv = require('iconv-lite');
const crypto = require('crypto');
const getMD5 = txt => {
  const hash = crypto.createHash('md5');
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
    // Detect sections
    const eventsIndex = lines.indexOf('[Events]');
    const hasSections = eventsIndex > -1 && lines[eventsIndex + 2] != '}';
    // Detect features
    const notesIndex = lines.findIndex(line => diffMap[line.trim()]);
    if (!notesIndex || notesIndex < 0) return chartMeta;
    let firstNoteIndex = 0;
    let lastNoteIndex = 0;
    let currentStatus;
    let hasStarPower = false, hasForced = false,
      hasTap = false, hasOpen = {},
      hasSoloSections = false;
    const notes = {};
    for (let i = notesIndex; i < lines.length; i++) {
      const line = lines[i];
      const last5 = line.slice(-5);
      if (last5 == 'N 5 0') hasForced = true;
      else if (last5 == 'N 6 0') hasTap = true;
      // Just flag open notes for the whole instrument
      else if (last5 == 'N 7 0' && currentStatus) hasOpen[currentStatus.slice(0, currentStatus.indexOf('.'))] = true;
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
        if (!firstNoteIndex) firstNoteIndex = +index;
        if (+index > lastNoteIndex) lastNoteIndex = +index;
        notes[currentStatus][index] = `${(notes[currentStatus][index] || '')}${notesMap[note]}`;
      }
    }

    // Get Tempo map [SyncTrack] to get effective song length
    const syncTrackIndexStart = lines.indexOf('[SyncTrack]');
    const syncTrackIndexEnd = lines.indexOf('}', syncTrackIndexStart);
    const tempoMap = lines.slice(syncTrackIndexStart, syncTrackIndexEnd)
      .reduce((arr, line) => {
        const [, index, bpm] = line.match(/\s*(\d+) = B (\d+)/) || [];
        if (index) arr.push([+index, +bpm / 1000]);
        return arr;
      }, []);
    let time = 0;
    let timeToFirstNote = 0;
    let isFirstNoteFound;
    let currentIndex;
    let currentBpm;
    chartMeta.Resolution = +chartMeta.Resolution;
    tempoMap.forEach(([index, bpm]) => {
      if (currentIndex != null) {
        // does it look like I pulled this formula from my ass? because I kinda did tbh
        // (the "Resolution" parameter defines how many "units" there are in a beat)
        time += (((index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        // Calculate the timestamp of the first note
        if (index <= firstNoteIndex) timeToFirstNote += (((index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        else if (!isFirstNoteFound) {
          isFirstNoteFound = true;
          timeToFirstNote += (((firstNoteIndex - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        }
      }
      currentIndex = index;
      currentBpm = bpm;
    });
    // do it one last time against the last note
    time += (((lastNoteIndex - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));

    // Compute the hash of the .chart itself first
    const hashes = { file: getMD5(chart) };
    const noteCounts = {};
    for (let part in notes) {
      const [instrument, difficulty] = part.split('.');
      // We have to reorder the values by ascending index (Object.values gets by "alphabetical" order of index)
      const notesArray = Object.keys(notes[part]).sort((a, b) => +a < +b ? -1 : 1).map(index => {
        index = +index;
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
      hashes[instrument][difficulty] = getMD5(notesArray.join(' '));
    }
    return {
      hasSections, hasStarPower, hasForced,
      hasTap, hasOpen, hasSoloSections,
      noteCounts, hashes, chartMeta,
      // "Effective song length" = time between first and last note
      length: time >> 0, effectiveLength: (time - timeToFirstNote) >> 0
    };
  } catch (err) {
    console.error(err.stack);
    return {};
  }
};
