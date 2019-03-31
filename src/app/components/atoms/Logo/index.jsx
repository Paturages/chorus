import { Component } from "inferno";

import logo from "assets/images/logo.png"; // credits for the logo go to TheFilyng!

import "./style.scss";

export default class Logo extends Component {
  constructor(props) {
    super(props);
  }
  goHome(evt) {
    if (this.props.href) return;
    evt.preventDefault();
    this.props.history.push(process.env.TESTING ? "/testing" : "/");
  }
  render() {
    return (
      <div className="Logo" title="props to TheFilyng for the logo and favicon">
        <a
          onClick={this.goHome.bind(this)}
          href={this.props.href || "javascript:void(0)"}
        >
          <img
            src="/assets/images/logo.png"
            alt="gh3orus"
            className="Logo__image"
          />
        </a>
      </div>
    );
  }
}
