import Inferno from "inferno";

import "./style.scss";

const ratings = [
  "Are there even any notes?", // 0
  "First steps", // 1
  "Warmup", // 2
  "Apprentice", // 3
  "Solid", // 4
  "Moderate", // 5
  "Challenging", // 6
  "Nightmare", // 7
  "Pretty hard", // 8
  "Pretty damn hard", // 9
  "It's starting to hurt", // 10
  "Carpal tunnel", // 11
  "Basically Soulless 4", // 12
  "ouch", // 13
  "God help me", // 14
  "...I'm out" // 15
];

// Referential max difficulty note density
// "Soulless 4" is 12.27 NPS, "A Very Quick 1617 Notes" is 17.76 NPS
const NPS_CAP = 15;

export default ({ length, noteCounts = {} }) => {
  // Preferred referential for note density is "Expert Guitar"
  const part = noteCounts.guitar ? "guitar" : Object.keys(noteCounts)[0];
  if (!part || !noteCounts[part]) return;
  const difficulty = ["x", "h", "m", "e"].find(diff => noteCounts[part][diff]);
  const density = (noteCounts[part][difficulty] / length).toFixed(2);
  let height = ((100 * density) / NPS_CAP).toFixed(2);
  if (height > 100) height = 100;
  const rating = ratings[density >> 0] || ratings[NPS_CAP];
  return (
    <div className="NoteDensity">
      <div className="NoteDensity__bar">
        <div
          className={`NoteDensity__bar-filler ${
            height == 100 ? "NoteDensity__bar-filler--maxxed" : ""
          }`}
          style={{ height: `${height}%` }}
        />
      </div>
      <div className="NoteDensity__text">
        <div className="NoteDensity__rating">{rating}</div>
        <div className="NoteDensity__label">{density} average NPS</div>
      </div>
    </div>
  );
};
