// 3/4ths of this is inspired by MoonScraper's MidReader
// https://github.com/FireFox2000000/Moonscraper-Chart-Editor/blob/master/Moonscraper%20Chart%20Editor/Assets/Scripts/Charts/IO/Midi/MidReader.cs

// The rest is pure, unadulterated reverse engineering (I mean who has time to check the specs anyway Kappa)

const crypto = require('crypto');
const MIDIFile = require('midifile');
const fs = require('fs');
const getSha = txt => {
  const hash = crypto.createHmac('sha256', process.env.HASH_SECRET || 'this should really be defined for production runs');
  hash.update(txt);
  return hash.digest('hex');
};

const partMap = {
  'PART GUITAR': 'guitar',
  'PART BASS': 'bass',
  'PART RHYTHM': 'rhythm',
  'PART KEYS': 'keys',
  'PART DRUMS': 'drums',
  'PART GUITAR GHL': 'guitarghl',
  'PART BASS GHL': 'bassghl',
};
const diffOffsets = { e: 59, m: 71, h: 83, x: 95 };
const tracks = {};

module.exports = midiFile => {
  const midi = new MIDIFile(midiFile.buffer);
  let hasSections = false, hasStarPower = false, hasForced = false, hasTaps = false, hasOpen = false;
  let isOpen = false;
  const notes = {};
  midi.getEvents().forEach(event => {
    // data is a string attached to the MIDI event.
    // It generally denotes chart events (sections, lighting...)
    const data = event.data ? event.data.map(d => String.fromCharCode(d)).join('') : null;
    if (data && data.slice(1, 8) == 'section') hasSections = true;
    else if (data && partMap[data]) tracks[event.track] = partMap[data];
    // If that ain't black magic, I don't know what it is. But it works.
    else if (data == "PS\u0000\u0000ÿ\u0004\u0001÷") hasTaps = true;
    else if (data == "PS\u0000\u0000\u0003\u0001\u0001÷") {
      hasOpen = true;
      isOpen = true;
    } else if (data == "PS\u0000\u0000\u0003\u0001\u0000÷") isOpen = false;

    // param1 is the note being played.
    // The interesting things happen here...
    if (event.param1) {
      if (event.param1 == 116) hasStarPower = true;
      else if ([65, 66, 77, 78, 89, 90, 101, 102].indexOf(event.param1) > -1) hasForced = true;
      else if (tracks[event.track] != 'guitarghl' && tracks[event.track] != 'bassghl') {
        // Detect which difficulty the note is on
        let diff;
        if (event.param1 >= 60 && event.param1 <= 64) diff = 'e';
        else if (event.param1 >= 72 && event.param1 <= 76) diff = 'm'
        else if (event.param1 >= 84 && event.param1 <= 88) diff = 'h';
        else if (event.param1 >= 96 && event.param1 <= 100) diff = 'x';
        // event.subtype == 9 is the note being on,
        // event.subtype == 8 is the note being off... I think?
        if (diff && event.subtype == 9) {
          if (!notes[`${tracks[event.track]}.${diff}`]) notes[`${tracks[event.track]}.${diff}`] = {};
          notes[`${tracks[event.track]}.${diff}`][event.playTime] = `${notes[`${tracks[event.track]}.${diff}`][event.playTime] || ''}${isOpen ? 7 : event.param1 - diffOffsets[diff]}`;
        }
      } else {
        // Detect which difficulty the note is on
        let diff;
        if (event.param1 >= 94) diff = 'x';
        else if (event.param1 >= 82) diff = 'h';
        else if (event.param1 >= 70) diff = 'm';
        else if (event.param1) diff = 'e';
        if (diff && event.subtype == 9) {
          if (!notes[`${tracks[event.track]}.${diff}`]) notes[`${tracks[event.track]}.${diff}`] = {};
          // GHL notes are offset by 2. If the ensuing result equals 0, it's an open note.
          notes[`${tracks[event.track]}.${diff}`][event.playTime] = `${notes[`${tracks[event.track]}.${diff}`][event.playTime] || ''}${+(event.param1 - diffOffsets[diff] + 1) || 7}`;
        }
      }
    }
  });

  // Compute the hash of the .chart itself first
  const hashes = { file: getSha(midiFile) };
  const noteCounts = {};
  let earliestNote = +Infinity, latestNote = 0;
  for (let part in notes) {
    const [instrument, difficulty] = part.split('.');
    if (!hashes[instrument]) {
      hashes[instrument] = {};
      noteCounts[instrument] = {};
    }
    // We have to reorder the values by ascending index (Object.values gets by "alphabetical" order of index)
    const notesArray = Object.keys(notes[part]).sort((a, b) => +a < +b ? -1 : 1).map(index => {
      index = +index;
      if (index < earliestNote) earliestNote = index;
      if (index > latestNote) latestNote = index;
      return notes[part][index];
    });
    // Compute the hashes and note counts of individual difficulties/instruments
    noteCounts[instrument][difficulty] = notesArray.length;
    hashes[instrument][difficulty] = getSha(notesArray.join(' '));
  }

  return { hasSections, hasStarPower, hasForced, hasTaps, hasOpen, noteCounts, hashes };
};
