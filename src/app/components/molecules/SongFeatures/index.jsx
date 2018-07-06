import Inferno from "inferno";

import "./style.scss";

const FEATURES = [
  "open notes",
  "forced notes",
  "tap notes",
  "sections",
  "solo sections",
  "star power",
  "stems (multi-track)",
  "video background",
  "lyrics"
];
const WARNINGS = [
  <a
    href="https://i.imgur.com/DsTwJsv.png"
    target="_blank"
    rel="noopener noreferrer"
  >
    how to download a google drive folder
  </a>,
  "needs renaming\n(to notes.chart/song.mp3)",
  "120 bpm alert",
  "no 5-fret lead guitar chart",
  "no audio",
  "possible broken notes\n(e.g. notes hidden behind others, broken chords)",
  "might have notes after end of song"
];

export default ({
  hasForced,
  hasOpen,
  hasTap,
  hasSections,
  hasStarPower,
  hasSoloSections,
  hasStems,
  hasVideo,
  hasLyrics,
  isFolder,
  needsRenaming,
  is120,
  noteCounts,
  hasNoAudio,
  hasBrokenNotes,
  length,
  effectiveLength,
  link
}) => {
  const flags = [
    hasOpen && Object.keys(hasOpen).length > 0,
    hasForced,
    hasTap,
    hasSections,
    hasSoloSections,
    hasStarPower,
    hasStems,
    hasVideo,
    hasLyrics
  ];
  const warningFlags = [
    isFolder && link,
    needsRenaming,
    is120,
    !noteCounts || !noteCounts.guitar,
    hasNoAudio,
    hasBrokenNotes,
    length && effectiveLength && effectiveLength > length
  ];
  return (
    <div className="SongFeatures">
      {flags.map(
        (flag, index) =>
          !!flag && (
            <div>
              {FEATURES[index]}
              {index ? "" : ` (${Object.keys(hasOpen).join(", ")})`}
            </div>
          )
      )}
      {warningFlags.map(
        (flag, index) =>
          !!flag && (
            <div className="SongFeatures__warning">{WARNINGS[index]}</div>
          )
      )}
    </div>
  );
};
