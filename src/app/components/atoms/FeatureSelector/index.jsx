import Inferno from 'inferno';

import './style.scss';

export default ({ status, labels, onToggle }) => (
  <button
    type="button"
    className={`FeatureSelector ${
      status != null ? 'FeatureSelector--active' : ''
    }`}
    onClick={onToggle}
  >
    {status == null || status ? labels.default : labels.disabled}
  </button>
);
