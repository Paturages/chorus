import Inferno from "inferno";

import "./style.scss";

const icons = {
  guitar: require("assets/images/instruments/guitar.png"),
  bass: require("assets/images/instruments/bass.png"),
  keys: require("assets/images/instruments/keys.png"),
  guitarghl: require("assets/images/instruments/guitarghl.png"),
  bassghl: require("assets/images/instruments/bassghl.png"),
  drums: require("assets/images/instruments/drums.svg")
};
icons.rhythm = icons.guitar;
const diffPlaceholders = [1, 2, 4, 8];
const diffs = "EMHX";
const diffFullLabels = {
  e: "Easy",
  m: "Medium",
  h: "Hard",
  x: "Expert"
};

// SVG pie chart utility
const percentToXY = percent => ({
  x: Math.cos(2 * Math.PI * percent),
  y: Math.sin(2 * Math.PI * percent)
});

export default ({ tier, diff, label, hashes, counts, hideDiffs }) => {
  // Do not display empty parts
  if (!counts) return;
  // Do not display unsupported instruments
  const icon = icons[label.toLowerCase()];
  if (!icon) return;

  // If difficulty is negative, it's the same as non existent
  if (tier == null || tier < 0) tier = "?";
  // Cap difficulty to 6
  else if (tier > 6) tier = 6;

  // This is where the <path> arc should stop
  const { x, y } = percentToXY(tier == "?" ? 0 : tier / 6);

  return (
    <div className="DifficultyMeter">
      <div className="DifficultyMeter__pie">
        <svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg)">
          <path
            d={[
              `M 1 0`, // from 0
              `A 1 1 0 ${tier > 3 ? 1 : 0} 1 ${x} ${y}`, // Arc
              `L 0 0` // Line
            ].join(" ")}
          />
        </svg>
        <div className="DifficultyMeter__pie-label">{tier}</div>
      </div>
      <img
        className={`DifficultyMeter__part DifficultyMeter__part--${label}`}
        src={icon}
        alt={label}
      />
      <div className="DifficultyMeter__diffs">
        {diffPlaceholders.map((flag, index) => {
          if (!(flag & diff)) return;
          return diffs[index];
        })}
      </div>
      {hashes && (
        <div className="DifficultyMeter__details">
          {["e", "m", "h", "x"].map(
            diff =>
              hashes[diff] && (
                <div className="DifficultyMeter__detail">
                  {diffFullLabels[diff]}:&nbsp;{counts[diff]}&nbsp;notes
                  <div className="DifficultyMeter__detail-hash">
                    Checksum:&nbsp;{hashes[diff]}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
