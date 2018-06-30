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

export default ({
  hasForced,
  hasOpen,
  hasTap,
  hasSections,
  hasStarPower,
  hasSoloSections,
  hasStems,
  hasVideo,
  hasLyrics
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
    </div>
  );
};
