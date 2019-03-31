import { Component } from "inferno";

import page1 from "assets/gh3/setlist__page-1.png";
import page2 from "assets/gh3/setlist__page-2.png";
import page3 from "assets/gh3/setlist__page-3.png";

import "assets/gh3/nightmare-hero.ttf";
import "assets/gh3/catseye.ttf";

import "./style.scss";

export default class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="GH3">
        <div className="GH3__page-1">
          <div className="GH3__page-1-line" />
          <img alt="" src={page1} />
          <div className="GH3__page-1-filler" />
        </div>
        <div className="GH3__page-2">
          <img alt="" src={page2} />
          <div className="GH3__page-2-filler" />
        </div>
        <div className="GH3__page-3">
          <img alt="" src={page3} />
          <div className="GH3__page-3-filler" />
        </div>
        <div className="GH3__body">{this.props.children}</div>
      </div>
    );
  }
}
