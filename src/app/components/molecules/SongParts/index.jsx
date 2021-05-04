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
