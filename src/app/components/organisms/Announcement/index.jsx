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
    const cowBlurb = (
      <div>
        A free shoutout to <b>Cow Hero</b>, just because I can.{" "}
        <a href="https://www.youtube.com/watch?v=vLrhWHcEr1I" target="_blank">
          Release video
        </a>
      </div>
    );
    const monthlyBlub = (
      <div>
        Do you miss skateboards, sitcoms, and the feeling of happiness? Go back
        to the <b>90's</b> with this <b>CSC May Monthly Pack</b>!{" "}
        <a href="https://www.youtube.com/watch?v=h_iLyypN98M" target="_blank">
          Release video
        </a>
      </div>
    );
    const chanBlurb = (
      <div>
        Still in search of a waifu who isn't trash? Behold <b>CHAN</b>, a brand new <b>anime-based</b> setlist. <a href="https://www.youtube.com/watch?v=hfRjeDjn9zA" target="_blank">Release video</a>
      </div>
    );
    return (
      <div className="Announcement">
        {monthlyBlub}
        {cowBlurb}
        {chanBlurb}
      </div>
    );
  }
}
