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

const RELEASE = new Date("2019-03-15T20:00:00Z");

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = { left: RELEASE - new Date() };
    if (this.state.left > 0)
      setInterval(() => this.setState({ left: RELEASE - new Date() }), 333);
  }
  render() {
    const tfotCountdown = (
      <div>
        ...Troy will fall in <b>{getHumanTime(this.state.left)}</b>
      </div>
    );
    const tfotBlurb = (
      <div>
        Charter extraordinaire <b>xX760Xx</b> presents to you: the{" "}
        <b>full discography of The Fall of Troy</b>!{" "}
        <a href="http://bit.ly/TFoTHero" target="_blank">
          Download here!
        </a>
      </div>
    );
    return (
      <div className="Announcement">
        {this.state.left > 0 ? tfotCountdown : tfotBlurb}
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
