import Inferno from "inferno";

import "./style.scss";

const tierPlaceholders = [1, 2, 3, 4, 5];
const diffPlaceholders = [1, 2, 4, 8];
const diffs = "EMHX";
const diffFullLabels = {
  e: "Easy",
  m: "Medium",
  h: "Hard",
  x: "Expert"
};

export default ({ tier, diff, label, hashes, counts, hideDiffs }) => (
  <div className="TierPills">
    <div
      className={`TierPills__label ${
        !counts && (tier == null || tier == -1)
          ? "TierPills__label--disabled"
          : ""
      }`}
    >
      {label}
    </div>
    <div
      className={[
        "TierPills__pills",
        (tier == null || tier < 0) && "TierPills__pills--disabled",
        tier >= 6 && "TierPills__pills--hard-as-fuck"
      ]
        .filter(x => x)
        .join(" ")}
    >
      {tierPlaceholders.map(index => (
        <div
          className={[
            "TierPills__pill",
            tier < index && "TierPills__pill--empty"
          ]
            .filter(x => x)
            .join(" ")}
        />
      ))}
    </div>
    <div className="TierPills__diffs">
      {!hideDiffs &&
        diff != null &&
        diffPlaceholders.map((flag, index) => (
          <span
            className={[
              "TierPills__diff",
              !(flag & diff) && "TierPills__diff--disabled"
            ]
              .filter(x => x)
              .join(" ")}
          >
            {diffs[index]}
          </span>
        ))}
    </div>
    {hashes && (
      <div className="TierPills__details">
        {["e", "m", "h", "x"].map(
          diff =>
            hashes[diff] && (
              <div className="TierPills__detail">
                {diffFullLabels[diff]}:&nbsp;{counts[diff]}&nbsp;notes
                <div className="TierPills__detail-hash">
                  Checksum:&nbsp;{hashes[diff]}
                </div>
              </div>
            )
        )}
      </div>
    )}
  </div>
);
