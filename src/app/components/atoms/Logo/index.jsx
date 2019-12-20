import { Component } from "inferno";

import logo from "assets/images/logo.png"; // credits for the logo go to TheFilyng!

import "./style.scss";

export default class Logo extends Component {
  constructor(props) {
    super(props);
  }
  goHome(evt) {
    evt.preventDefault();
    this.props.history.push(process.env.TESTING ? "/testing" : "/");
  }
  render() {
    return (
      <div className="Logo" title="props to TheFilyng for the logo and favicon">
        <a onClick={this.goHome.bind(this)} href="#">
          <img
            src="/assets/images/logo.png"
            alt="chorus"
            className="Logo__image"
          />
        </a>
      </div>
    );
  }
}
