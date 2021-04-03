import Inferno from 'inferno';

import DifficultyMeter from 'components/molecules/DifficultyMeter';

import './style.scss';

const PARTS = [
  'guitar',
  'guitarghl',
  'bass',
  'bassghl',
  'rhythm',
  'keys',
  'drums',
];

export default ({
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
  noteCounts,
  hashes,
}) => {
  const tiers = {
    guitar: tier_guitar,
    guitarghl: tier_guitarghl,
    bass: tier_bass,
    bassghl: tier_bassghl,
    rhythm: tier_rhythm,
    keys: tier_keys,
    drums: tier_drums,
  };
  const diffs = {
    guitar: diff_guitar,
    guitarghl: diff_guitarghl,
    bass: diff_bass,
    bassghl: diff_bassghl,
    rhythm: diff_rhythm,
    keys: diff_keys,
    drums: diff_drums,
  };
  return (
    <div className="SongParts">
      {PARTS.map(
        (PART) =>
          noteCounts[PART] &&
          !!Object.keys(noteCounts).length && (
            <div className="SongParts__part">
              <DifficultyMeter
                label={PART}
                diff={diffs[PART]}
                tier={tiers[PART]}
                counts={noteCounts[PART]}
                hashes={hashes[PART]}
              />
            </div>
          )
      )}
    </div>
  );
};

const old = ({
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
  noteCounts,
  hashes,
}) => (
  <div className="Song__tiers">
    <div className="Song__tier--band">
      <DifficultyMeter label="band" tier={tier_band} hideDiffs />
    </div>
    <div className="Song__tiers-columns">
      <div className="Song__tier--guitar">
        <DifficultyMeter
          label="guitar"
          tier={tier_guitar}
          diff={diff_guitar}
          counts={noteCounts.guitar}
          hashes={hashes.guitar}
        />
      </div>
      <div className="Song__tier--bass">
        <DifficultyMeter
          label="bass"
          tier={tier_bass}
          diff={diff_bass}
          counts={noteCounts.bass}
          hashes={hashes.bass}
        />
      </div>
      <div className="Song__tier--rhythm">
        <DifficultyMeter
          label="rhythm"
          tier={tier_rhythm}
          diff={diff_rhythm}
          counts={noteCounts.rhythm}
          hashes={hashes.rhythm}
        />
      </div>
      <div className="Song__tier--drums">
        <DifficultyMeter
          label="drums"
          tier={tier_drums}
          diff={diff_drums}
          counts={noteCounts.drums}
          hashes={hashes.drums}
        />
      </div>
      <div className="Song__tier--vocals">
        <DifficultyMeter label="vocals" tier={tier_vocals} />
      </div>
      <div className="Song__tier--keys">
        <DifficultyMeter
          label="keys"
          tier={tier_keys}
          diff={diff_keys}
          counts={noteCounts.keys}
          hashes={hashes.keys}
        />
      </div>
      <div className="Song__tier--guitarghl">
        <DifficultyMeter
          label="guitarghl"
          tier={tier_guitarghl}
          diff={diff_guitarghl}
          counts={noteCounts.guitarghl}
          hashes={hashes.guitarghl}
        />
      </div>
      <div className="Song__tier--bassghl">
        <DifficultyMeter
          label="bassghl"
          tier={tier_bassghl}
          diff={diff_bassghl}
          counts={noteCounts.bassghl}
          hashes={hashes.bassghl}
        />
      </div>
    </div>
  </div>
);
