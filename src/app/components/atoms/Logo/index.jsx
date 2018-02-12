import Inferno from "inferno";

import logo from "assets/images/logo.png"; // credits for the logo go to TheFilyng!

import "./style.scss";

export default () => (
  <div className="Logo" title="props to TheFilyng for the logo and favicon">
    <a href={`${process.env.TESTING ? "/testing" : ""}/`}>
      <img src="/assets/images/logo.png" alt="chorus" className="Logo__image" />
    </a>
  </div>
);
