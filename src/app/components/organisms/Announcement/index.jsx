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

const RELEASE = new Date("2019-01-07T23:00:00Z");

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = { left: RELEASE - new Date() };
    // if (this.state.left > 0) setInterval(() => this.setState({ left: RELEASE - new Date() }), 333);
  }
  render() {
    return (
      <div className="Announcement">
        <div>
          To celebrate Women's History Month, the{" "}
          <b>CSC March Monthly Pack</b> features <b>Female-Fronted bands and artists!</b>{" "}
          <a href="https://www.youtube.com/watch?v=nPJAKqiEjU0">
            Release video
          </a>{" "}
        </div>
        <div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSceW3Ir2cOmsGX-7GC3_Y3YfUid_UhrSrR3JHB2yjpz7zN16w/viewform">
            <b>chorus needs your feedback!</b> Contribute to the future development of chorus with your insight and ideas!
          </a>
        </div>
      </div>
    );
  }
}
