import Inferno from "inferno";

import DownloadLink from "components/atoms/DownloadLink";
import TierPills from "components/molecules/TierPills";
import NoteDensity from "components/molecules/NoteDensity";

import "./style.scss";

const toTime = fullSeconds => {
  const minutes = (fullSeconds / 60) >> 0;
  const seconds = fullSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default ({
  name,
  artist,
  album,
  genre,
  length,
  effectiveLength,
  year,
  charter,
  roles,
  tier_band,
  tier_guitar,
  tier_bass,
  tier_rhythm,
  tier_drums,
  tier_vocals,
  tier_keys,
  tier_guitarghl,
  tier_bassghl,
  diff_guitar,
  diff_bass,
  diff_rhythm,
  diff_drums,
  diff_keys,
  diff_guitarghl,
  diff_bassghl,
  isPack,
  hasForced,
  hasOpen,
  hasTap,
  hasSections,
  hasStarPower,
  hasSoloSections,
  hasStems,
  hasVideo,
  noteCounts,
  lastModified,
  link,
  parent,
  hashes,
  sources
}) => (
  <div className="Song">
    <div className="Song__modified">
      {new Date(lastModified).toISOString().replace(/T|\.\d+Z$/g, " ")}
    </div>
    <div className="Song__meta">
      <div className="Song__artist">{artist}</div>
      <div className="Song__name">{name}</div>
      {length && (
        <div className="Song__length">
          {toTime(length)}{" "}
          <span className="Song__length-tooltip-trigger">
            ({toTime(effectiveLength)})
          </span>
          <div className="Song__length-tooltip">
            Between brackets is the effective length, which is the duration
            between the first and the last note. This duration is the one used
            in the NPS calculation.
          </div>
        </div>
      )}
      {genre && <div className="Song__genre">{genre}</div>}
      <div className="Song__album">
        {album || "Unknown album"}
        {year ? ` (${year})` : ""}
      </div>
      <div className="Song__charter">
        <DownloadLink
          link={link}
          charter={charter}
          roles={roles}
          isPack={isPack}
        />
      </div>
      <div className="Song__sources">
        Source{sources.length == 1 ? "" : "s"}:
        {sources.map(({ name, link, parent }) => (
          <div className="Song__source">
            {parent && (
              <a href={parent.link} target="_blank" rel="noopener noreferrer">
                {parent.name}
              </a>
            )}
            {parent ? " in " : ""}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          </div>
        ))}
      </div>
      {hashes && (
        <div className="Song__hash">Chart checksum: {hashes.file}</div>
      )}
    </div>
    {noteCounts &&
      !!Object.keys(noteCounts).length && (
        <div className="Song__chart-info">
          <div className="Song__features">
            <div
              className={[
                "Song__feature",
                !Object.keys(hasOpen).length && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Open notes
              {!!Object.keys(hasOpen).length && (
                <div className="Song__feature-items">
                  {Object.keys(hasOpen).map(part => (
                    <div className="Song__feature-item">{part}</div>
                  ))}
                </div>
              )}
            </div>
            <div
              className={[
                "Song__feature",
                !hasForced && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Forced notes
            </div>
            <div
              className={["Song__feature", !hasTap && "Song__feature--disabled"]
                .filter(x => x)
                .join(" ")}
            >
              Tap notes
            </div>
            <div
              className={[
                "Song__feature",
                !hasSections && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Sections
            </div>
            <div
              className={[
                "Song__feature",
                !hasSoloSections && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Solo Sections
            </div>
            <div
              className={[
                "Song__feature",
                !hasStarPower && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Star Power
            </div>
            <div
              className={[
                "Song__feature",
                !hasStems && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Stems (multi-track)
            </div>
            <div
              className={[
                "Song__feature",
                !hasVideo && "Song__feature--disabled"
              ]
                .filter(x => x)
                .join(" ")}
            >
              Video background
            </div>
          </div>
          <div className="Song__tiers">
            <div className="Song__tier--band">
              <TierPills label="band" tier={tier_band} hideDiffs />
            </div>
            <div className="Song__tiers-columns">
              <div className="Song__tiers-column">
                <div className="Song__tier--guitar">
                  <TierPills
                    label="guitar"
                    tier={tier_guitar}
                    diff={diff_guitar}
                    counts={noteCounts.guitar}
                    hashes={hashes.guitar}
                  />
                </div>
                <div className="Song__tier--bass">
                  <TierPills
                    label="bass"
                    tier={tier_bass}
                    diff={diff_bass}
                    counts={noteCounts.bass}
                    hashes={hashes.bass}
                  />
                </div>
                <div className="Song__tier--rhythm">
                  <TierPills
                    label="rhythm"
                    tier={tier_rhythm}
                    diff={diff_rhythm}
                    counts={noteCounts.rhythm}
                    hashes={hashes.rhythm}
                  />
                </div>
                <div className="Song__tier--drums">
                  <TierPills
                    label="drums"
                    tier={tier_drums}
                    diff={diff_drums}
                    counts={noteCounts.drums}
                    hashes={hashes.drums}
                  />
                </div>
              </div>
              <div className="Song__tiers-column">
                <div className="Song__tier--vocals">
                  <TierPills label="vocals" tier={tier_vocals} />
                </div>
                <div className="Song__tier--keys">
                  <TierPills
                    label="keys"
                    tier={tier_keys}
                    diff={diff_keys}
                    counts={noteCounts.keys}
                    hashes={hashes.keys}
                  />
                </div>
                <div className="Song__tier--guitarghl">
                  <TierPills
                    label="guitarghl"
                    tier={tier_guitarghl}
                    diff={diff_guitarghl}
                    counts={noteCounts.guitarghl}
                    hashes={hashes.guitarghl}
                  />
                </div>
                <div className="Song__tier--bassghl">
                  <TierPills
                    label="bassghl"
                    tier={tier_bassghl}
                    diff={diff_bassghl}
                    counts={noteCounts.bassghl}
                    hashes={hashes.bassghl}
                  />
                </div>
              </div>
            </div>
            <NoteDensity length={effectiveLength} noteCounts={noteCounts} />
          </div>
        </div>
      )}
  </div>
);
