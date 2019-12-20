import Inferno from "inferno";

import "./style.scss";

export default ({ label, className, ...props }) => (
  <div className="TextInput">
    {label && <div className="TextInput__label">{label}</div>}
    <input className="TextInput__input" {...props} />
  </div>
);
