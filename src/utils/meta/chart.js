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
  let hasStarPower = false;
  let hasForced = false;
  let hasTap = false;
  let hasOpen = {};
  let hasSoloSections = false;
  let hasLyrics = false;
  let hasSections = false;
  let brokenNotes = [];
  const sections = [];
  try {
    const utf8 = Iconv.decode(chart, 'utf8');
    if (utf8.indexOf('\u0000') >= 0) chart = Iconv.decode(chart, 'utf16');
    else if (utf8.indexOf('�') >= 0) chart = Iconv.decode(chart, 'latin1');
    else chart = utf8;
    // Trim each line because of Windows \r\n shenanigans
    const lines = chart.split('\n').map(line => line.trim());
    // Get song metadata from the [Song] section as a backup to the song.ini
    const songIndex = lines.find(line => line.match(/\[Song\]/));
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
    // Detect sections and lyrics
    const eventsIndex = lines.indexOf('[Events]');
    for (let i = eventsIndex; lines[i] != null && lines[i] != '}'; i++) {
      let [index, value] = lines[i].split(' = ');
      if (!value) continue;
      if (value.match(/"lyric /)) hasLyrics = true;
      else if (value.match(/"section /)) {
        hasSections = true;
        sections.push({
          index: +index.trim(),
          section: value
        });
      }
    }
    // Detect features
    const notesIndex = lines.findIndex(line => diffMap[line.trim()]);
    if (!notesIndex || notesIndex < 0) return chartMeta;
    let firstNoteIndex = 0;
    let lastNoteIndex = 0;
    let previous;
    let currentStatus;
    const notes = {};
    for (let i = notesIndex; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/N 5 /)) hasForced = true;
      else if (line.match(/N 6 /)) hasTap = true;
      // Just flag open notes for the whole instrument
      else if (line.match(/N 7 /) && currentStatus) hasOpen[currentStatus.slice(0, currentStatus.indexOf('.'))] = true;
      else if (line.match(/ solo/)) hasSoloSections = true;
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
      // Detect broken notes (i.e. very small distance between notes)
      // Abysmal @ 64000 and 64768 (1:10'ish) has broken GR chords (distance = 4)
      // Down Here @ 116638 (1:24) has a double orange (distance = 2)
      // I'm in the Band very first note is a doubled yellow (distance = 1)
      // There's likely gonna be some false positives, but this is likely to help setlist makers
      // for proofchecking stuff.
      if (previous) {
        const distance = index - previous.index;
        if (distance > 0 && distance < 5) brokenNotes.push({
          index: +previous.index,
          section: sections[sections.findIndex(section => +section.index > +previous.index) - 1],
          time: 0
        });
      }
      if (+index && (!previous || previous.index != index)) previous = { index, note };
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
    let timeToLastNote = 0;
    let isFirstNoteFound;
    let isLastNoteFound;
    let currentIndex;
    let currentBpm;
    chartMeta.Resolution = +chartMeta.Resolution;
    tempoMap.forEach(([index, bpm]) => {
      if (currentIndex != null) {
        // does it look like I pulled this formula from my ass? because I kinda did tbh
        // (the "Resolution" parameter defines how many "units" there are in a beat)
        time += (((index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        // Calculate the timestamp of the first note
        if (index <= firstNoteIndex) {
          timeToFirstNote += (((index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        } else if (!isFirstNoteFound) {
          isFirstNoteFound = true;
          timeToFirstNote += (((firstNoteIndex - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        }
        // Calculate the timestamp of the last note
        if (index <= lastNoteIndex) {
          timeToLastNote += (((index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        } else if (!isLastNoteFound) {
          isLastNoteFound = true;
          timeToLastNote += (((lastNoteIndex - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
        }
        // Compute timestamp of broken notes
        brokenNotes.forEach(note => {
          if (index <= note.index) {
            note.time += (((index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
          } else if (!note.found) {
            note.found = true;
            note.time += (((note.index - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
          }
        });
      }
      currentIndex = index;
      currentBpm = bpm;
    });
    // If the current index is 0 (beginning of chart) and the BPM is 120 ("B 120000"),
    // it's most likely cancer (not beat mapped) and has to be checked by physicians
    const is120 = currentIndex == 0 && currentBpm == 120
    // do it one last time against the last note if the last note is after
    // the last BPM change
    if (currentIndex < lastNoteIndex) {
      time += (((lastNoteIndex - currentIndex) * 60) / (currentBpm * chartMeta.Resolution));
    }

    brokenNotes.forEach(note => {
      delete note.found;
    });

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
    chartMeta.length = time >> 0;
    // "Effective song length" = time between first and last note
    chartMeta.effectiveLength = (timeToLastNote - timeToFirstNote) >> 0;
    return {
      hasSections, hasStarPower, hasForced,
      hasTap, hasOpen, hasSoloSections, hasLyrics,
      noteCounts, hashes, chartMeta, is120,
      hasBrokenNotes: !!brokenNotes.length,
      brokenNotes
    };
  } catch (err) {
    console.error(err.stack);
    return {};
  }
};
