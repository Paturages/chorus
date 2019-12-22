import Inferno from 'inferno';
import Component from 'inferno-component';

import './style.scss';

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
    .join(' ');
};

// const RELEASE_BS = new Date("2019-05-31T23:00:00Z");
// const RELEASE_MONTHLY = new Date("2019-06-08T02:02:00Z");

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener">
    {children}
  </a>
);

const monthly = (
  <div>
    We're about to see off a decade guys, and what better way than a whopping{' '}
    <b>65 songs (!)</b> part of the <b>CSC December 2019 monthly pack</b>? The
    theme is <b>the 2010s</b>!{' '}
    <A href="https://customsongscentral.com/december-2019-best-of-the-2010s/">
      <b>Download here!</b>
    </A>
  </div>
);
const chartathon = (
  <div>
    This month is a month of <b>charity</b>! Support the ongoing,{' '}
    <b>cross-community</b> campaign between folks from{' '}
    <b>Rock Band, Clone Hero, Audica, Beat Saber, Rocksmith and Synth Riders</b>
    !{' '}
    <A href="https://charity.gofundme.com/o/en/campaign/chartathon">
      <b>More information here!</b>
    </A>
  </div>
);
const advent = (
  <div>
    Not enough charity? Follow the ongoing <b>Advent calendar</b> of Clone Hero
    streamers raising funds for different charities of their choice!{' '}
    <A href="https://discord.gg/fNXFt7B">Join the Discord!</A>
  </div>
);
const vu = (
  <div>
    You know the tedious process I'm getting you to do to even get on here?
    These people haven't gone through that! Heathens! Introducing{' '}
    <b>Verified Unverified</b>, a setlist made by promising, yet non-roled
    charters from the CH community.{' '}
    <A href="https://www.youtube.com/watch?v=iQVcapBKwYU">Download here!</A>
  </div>
);

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
    return (
      <div className="Announcement">
        {monthly}
        {chartathon}
        {advent}
        {vu}
      </div>
    );
  }
}
