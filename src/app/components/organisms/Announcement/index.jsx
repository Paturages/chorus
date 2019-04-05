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

const RELEASE = new Date("2019-04-05T22:02:00Z");

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = { left: RELEASE - new Date() };
    if (this.state.left > 0)
      setInterval(() => this.setState({ left: RELEASE - new Date() }), 333);
  }
  render() {
    const cbBlurb = (
      <div>
        Are you ready to get your circuits broken? Introducing the highly
        anticipated <b>Circuit Breaker</b>: a full difficulty and all{" "}
        <b>electronic</b> setlist!{" "}
        <a href="https://www.youtube.com/watch?v=sAWyK-YVRRQ" target="_blank">
          Release video
        </a>
      </div>
    );
    const monthlyBlub =
      this.state.left > 0 ? (
        <div>
          <b>{getHumanTime(this.state.left)}</b> before my weeb shit comes out
          of the closet.{" "}
          <a href="https://www.youtube.com/watch?v=n-OUi_xDQSQ" target="_blank">
            Come join us!
          </a>
        </div>
      ) : (
        <div>
          I swear I'm not a fucking weeb, but here's the{" "}
          <b>CSC April Monthly Pack</b>, full of <b>guilty pleasures!</b>{" "}
          <a href="https://www.youtube.com/watch?v=n-OUi_xDQSQ" target="_blank">
            Release video
          </a>
        </div>
      );
    return (
      <div className="Announcement">
        {cbBlurb}
        {monthlyBlub}
        <div>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSceW3Ir2cOmsGX-7GC3_Y3YfUid_UhrSrR3JHB2yjpz7zN16w/viewform">
            <b>chorus needs your feedback!</b> Contribute to the future
            development of chorus with your insight and ideas!
          </a>
        </div>
      </div>
    );
  }
}
