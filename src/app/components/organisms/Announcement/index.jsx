import Inferno from "inferno";
import Component from "inferno-component";

import "./style.scss";

const getHumanTime = time => {
  if (!time || time < 0) return;
  time = (time / 1000) >> 0;
  let seconds = time % 60;
  time = (time / 60) >> 0;
  let minutes = time % 60;
  time = (time / 60) >> 0;
  const hours = time % 24;
  const days = (time / 24) >> 0;
  return [
    days && `${days}d`,
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    `${seconds}s`
  ]
    .filter(x => x)
    .join(" ");
};

const RELEASE = new Date("2018-12-10T10:00:00Z");

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = { left: RELEASE - new Date() };
    setInterval(() => this.setState({ left: RELEASE - new Date() }), 333);
  }
  render() {
    return (
      <div className="Announcement">
        <div>
          The <b>CSC November Monthly Pack</b> is up, with the most original
          theme ever: <b>Covers!</b>{" "}
          <a href="https://www.youtube.com/watch?v=7W-yeFGS2mg">
            Release video
          </a>
        </div>
        <div>
          <b>Djent Hero</b> is coming very soon!{" "}
          <b>{getHumanTime(this.state.left)}</b>
        </div>
      </div>
    );
  }
}
