import { Component } from "inferno";

import "./style.scss";

const tierPlaceholders = [1, 2, 3, 4, 5];
const diffPlaceholders = [1, 2, 4, 8];
const diffLetters = "EMHX";

export default class TierPillSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: null
    };
  }
  render() {
    const { hovered } = this.state;
    const {
      comparator,
      tier,
      label,
      diffs,
      onSelect,
      onToggleComparator,
      onDiff
    } = this.props;
    return (
      <div className="TierPillSelector">
        <button
          type="button"
          className="TierPillSelector__comparator"
          onClick={onToggleComparator}
        >
          {comparator == 1 ? "≥" : "≤"}
        </button>
        <div className="TierPillSelector__label">{label}</div>
        <div
          className={[
            "TierPillSelector__pills",
            ((tier >= 6 && (!hovered || hovered >= 6)) || hovered >= 6) &&
              "TierPillSelector__pills--hard-as-fuck"
          ]
            .filter(x => x)
            .join(" ")}
          onMouseLeave={() => this.setState({ hovered: null })}
        >
          {tierPlaceholders.map(index => (
            <div
              className={[
                "TierPillSelector__pill",
                index <= hovered && "TierPillSelector__pill--hovered",
                tier < index && "TierPillSelector__pill--empty"
              ]
                .filter(x => x)
                .join(" ")}
              onMouseEnter={() =>
                this.setState({ hovered: tier == index ? null : index })
              }
              onClick={() =>
                this.setState({ hovered: null }, () =>
                  onSelect(tier == index ? null : index)
                )
              }
            />
          ))}
          <div
            className="TierPillSelector__pill--invisible"
            onMouseEnter={() => this.setState({ hovered: 6 })}
            onClick={() =>
              this.setState({ hovered: null }, () =>
                onSelect(tier == 6 ? null : 6)
              )
            }
          />
        </div>
        {typeof diffs != "undefined" && (
          <div className="TierPillSelector__diffs">
            {diffPlaceholders.map((flag, index) => (
              <button
                type="button"
                className={`TierPillSelector__diff ${
                  flag & diffs ? "TierPillSelector__diff--active" : ""
                }`}
                onClick={() => onDiff(flag)}
              >
                {diffLetters[index]}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}
