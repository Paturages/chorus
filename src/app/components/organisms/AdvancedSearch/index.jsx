import { Component } from "inferno";

import FeatureSelector from "components/atoms/FeatureSelector";
import TextInput from "components/atoms/TextInput";
import TierPillSelector from "components/molecules/TierPillSelector";

import "./style.scss";

const updateField = (self, field, $event) =>
  self.setState({
    [field]: $event.target.value
  });

export default class AdvancedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      artist: "",
      album: "",
      genre: "",
      charter: "",
      tiers: {
        band: null,
        guitar: null,
        bass: null,
        rhythm: null,
        drums: null,
        vocals: null,
        keys: null,
        guitarghl: null,
        bassghl: null
      },
      comparators: {
        band: 1,
        guitar: 1,
        bass: 1,
        rhythm: 1,
        drums: 1,
        vocals: 1,
        keys: 1,
        guitarghl: 1,
        bassghl: 1
      },
      diffs: {
        guitar: null,
        bass: null,
        rhythm: null,
        drums: null,
        keys: null,
        guitarghl: null,
        bassghl: null
      },
      hasForced: null,
      hasOpen: null,
      hasTap: null,
      hasSections: null,
      hasStarPower: null,
      hasSoloSections: null,
      hasStems: null,
      hasVideo: null
    };
    this.updateField = (field, $event) => updateField(this, field, $event);
  }
  render() {
    const {
      name,
      artist,
      album,
      genre,
      charter,
      tiers,
      comparators,
      diffs,
      hasForced,
      hasOpen,
      hasTap,
      hasSections,
      hasStarPower,
      hasSoloSections,
      hasStems,
      hasVideo
    } = this.state;
    const { onQuery } = this.props;
    return (
      <form
        className="AdvancedSearch"
        onSubmit={$event => {
          $event.preventDefault();
          // Build a custom query
          let queries = [];
          if (name) queries.push(`name="${name}"`);
          if (artist) queries.push(`artist="${artist}"`);
          if (album) queries.push(`album="${album}"`);
          if (genre) queries.push(`genre="${genre}"`);
          if (charter) queries.push(`charter="${charter}"`);
          for (let part in tiers) {
            if (tiers[part] || comparators[part] == -1) {
              queries.push(
                `tier_${part}=${comparators[part] == 1 ? "gt" : "lt"}${tiers[
                  part
                ] || 0}`
              );
            }
          }
          for (let part in diffs) {
            if (diffs[part]) queries.push(`diff_${part}=${diffs[part]}`);
          }
          if (hasForced != null) queries.push(`hasForced=${+hasForced}`);
          if (hasOpen != null) queries.push(`hasOpen=${+hasOpen}`);
          if (hasTap != null) queries.push(`hasTap=${+hasTap}`);
          if (hasSections != null) queries.push(`hasSections=${+hasSections}`);
          if (hasStarPower != null)
            queries.push(`hasStarPower=${+hasStarPower}`);
          if (hasSoloSections != null)
            queries.push(`hasSoloSections=${+hasSoloSections}`);
          if (hasStems != null) queries.push(`hasStems=${+hasStems}`);
          if (hasVideo != null) queries.push(`hasVideo=${+hasVideo}`);
          onQuery(queries.join(" "));
        }}
      >
        <div className="AdvancedSearch__text-row">
          <TextInput
            defaultValue={name}
            onInput={$event => this.updateField("name", $event)}
            label="Song name"
          />
          <TextInput
            defaultValue={artist}
            onInput={$event => this.updateField("artist", $event)}
            label="Artist/band name"
          />
          <TextInput
            defaultValue={album}
            onInput={$event => this.updateField("album", $event)}
            label="Album name"
          />
        </div>
        <div className="AdvancedSearch__text-row">
          <TextInput
            defaultValue={genre}
            onInput={$event => this.updateField("genre", $event)}
            label="Genre"
          />
          <TextInput
            defaultValue={charter}
            onInput={$event => this.updateField("charter", $event)}
            label="Charter"
          />
          <div style={{ flex: 1, margin: "0 .5em" }} />
        </div>
        <div className="AdvancedSearch__tier-row">
          {["band", "guitar", "bass"].map(part => (
            <TierPillSelector
              tier={tiers[part]}
              diffs={diffs[part]}
              comparator={comparators[part]}
              label={part}
              onSelect={tier =>
                this.setState({ tiers: Object.assign(tiers, { [part]: tier }) })
              }
              onDiff={flag =>
                this.setState({
                  diffs: Object.assign(diffs, { [part]: diffs[part] ^ flag })
                })
              }
              onToggleComparator={() =>
                this.setState({
                  comparators: Object.assign(comparators, {
                    [part]: comparators[part] == 1 ? -1 : 1
                  })
                })
              }
            />
          ))}
        </div>
        <div className="AdvancedSearch__tier-row">
          {["rhythm", "drums", "vocals"].map(part => (
            <TierPillSelector
              tier={tiers[part]}
              diffs={diffs[part]}
              comparator={comparators[part]}
              label={part}
              onSelect={tier =>
                this.setState({ tiers: Object.assign(tiers, { [part]: tier }) })
              }
              onDiff={flag =>
                this.setState({
                  diffs: Object.assign(diffs, { [part]: diffs[part] ^ flag })
                })
              }
              onToggleComparator={() =>
                this.setState({
                  comparators: Object.assign(comparators, {
                    [part]: comparators[part] == 1 ? -1 : 1
                  })
                })
              }
            />
          ))}
        </div>
        <div className="AdvancedSearch__tier-row">
          {["keys", "guitarghl", "bassghl"].map(part => (
            <TierPillSelector
              tier={tiers[part]}
              diffs={diffs[part]}
              comparator={comparators[part]}
              label={part}
              onSelect={tier =>
                this.setState({ tiers: Object.assign(tiers, { [part]: tier }) })
              }
              onDiff={flag =>
                this.setState({
                  diffs: Object.assign(diffs, { [part]: diffs[part] ^ flag })
                })
              }
              onToggleComparator={() =>
                this.setState({
                  comparators: Object.assign(comparators, {
                    [part]: comparators[part] == 1 ? -1 : 1
                  })
                })
              }
            />
          ))}
        </div>
        <div className="AdvancedSearch__feature-row">
          <FeatureSelector
            status={hasForced}
            labels={{ default: "Forced notes", disabled: "No forced notes" }}
            onToggle={() => {
              let status;
              if (hasForced == null) status = true;
              else if (hasForced) status = false;
              else status = null;
              this.setState({ hasForced: status });
            }}
          />
          <FeatureSelector
            status={hasOpen}
            labels={{ default: "Open notes", disabled: "No open notes" }}
            onToggle={() => {
              let status;
              if (hasOpen == null) status = true;
              else if (hasOpen) status = false;
              else status = null;
              this.setState({ hasOpen: status });
            }}
          />
          <FeatureSelector
            status={hasTap}
            labels={{ default: "Tap notes", disabled: "No tap notes" }}
            onToggle={() => {
              let status;
              if (hasTap == null) status = true;
              else if (hasTap) status = false;
              else status = null;
              this.setState({ hasTap: status });
            }}
          />
        </div>
        <div className="AdvancedSearch__feature-row">
          <FeatureSelector
            status={hasSections}
            labels={{ default: "Sections", disabled: "No sections" }}
            onToggle={() => {
              let status;
              if (hasSections == null) status = true;
              else if (hasSections) status = false;
              else status = null;
              this.setState({ hasSections: status });
            }}
          />
          <FeatureSelector
            status={hasStarPower}
            labels={{ default: "Star power", disabled: "No star power" }}
            onToggle={() => {
              let status;
              if (hasStarPower == null) status = true;
              else if (hasStarPower) status = false;
              else status = null;
              this.setState({ hasStarPower: status });
            }}
          />
          <FeatureSelector
            status={hasSoloSections}
            labels={{ default: "Solo sections", disabled: "No solo sections" }}
            onToggle={() => {
              let status;
              if (hasSoloSections == null) status = true;
              else if (hasSoloSections) status = false;
              else status = null;
              this.setState({ hasSoloSections: status });
            }}
          />
        </div>
        <div className="AdvancedSearch__feature-row">
          <FeatureSelector
            status={hasStems}
            labels={{ default: "Stems", disabled: "No stems" }}
            onToggle={() => {
              let status;
              if (hasStems == null) status = true;
              else if (hasStems) status = false;
              else status = null;
              this.setState({ hasStems: status });
            }}
          />
          <FeatureSelector
            status={hasVideo}
            labels={{
              default: "Video background",
              disabled: "No video background"
            }}
            onToggle={() => {
              let status;
              if (hasVideo == null) status = true;
              else if (hasVideo) status = false;
              else status = null;
              this.setState({ hasVideo: status });
            }}
          />
          <div style={{ flex: 1, margin: "0 3em" }} />
        </div>
        <div className="AdvancedSearch__submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
