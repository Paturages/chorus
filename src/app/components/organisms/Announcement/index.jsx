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

// const RELEASE_BS = new Date("2019-05-31T23:00:00Z");
// const RELEASE_MONTHLY = new Date("2019-06-08T02:02:00Z");

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   leftBS: RELEASE_BS - new Date(),
    //   leftMonthly: RELEASE_MONTHLY - new Date()
    // };
    // if (this.state.leftBS > 0 || this.state.leftMonthly > 0)
    //   setInterval(
    //     () =>
    //       this.setState({
    //         leftBS: RELEASE_BS - new Date(),
    //         leftMonthly: RELEASE_MONTHLY - new Date()
    //       }),
    //     333
    //   );
  }
  render() {
    const monthlyBlurb = (
      <div>
        What's up nerds, are ya ready to play sum <b>vidya gaems</b>? Go ahead
        and grind the{" "}
        <a href="https://www.youtube.com/watch?v=8MuWrceJ2VY" target="_blank">
          CSC Monthly Pack, August 2019
        </a>
        !
      </div>
    );
    const ahBlurb = (
      <div>
        The <b>Anti Hero</b> Team is doing a fundraiser for the{" "}
        <b>JED Foundation</b>!{" "}
        <a
          href="https://donate.jedfoundation.org/fundraiser/2169886"
          target="_blank"
        >
          More details here
        </a>
      </div>
    );
    const fpBlurb = (
      <div>
        Filled to the brim with top tier metal picks, supreme solos, and diverse
        variety, Focal Point is a setlist that's sure to hold your attention!{" "}
        <a href="https://www.youtube.com/watch?v=TTg0gzLK5eo" target="_blank">
          Release video
        </a>
      </div>
    );
    return (
      <div className="Announcement">
        {monthlyBlurb}
        {ahBlurb}
        {fpBlurb}
      </div>
    );
  }
}
