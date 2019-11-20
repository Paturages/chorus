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

const digitizer = (
  <div>
    <A href="https://customsongscentral.com/digitizer/">
      <b>Digitizer</b>
    </A>
    : OHM's new <b>EDM-centric</b> setlist, also with guest charts from renowned
    charters!
  </div>
);
const zg = (
  <div>
    <A href="https://www.youtube.com/watch?v=t5RoOh3cYx8">
      <b>Zero Gravity</b>
    </A>
    : <b>170 charts</b> that might or might not be related to <b>space</b>!
  </div>
);
const stargate = (
  <div>
    <A href="https://drive.google.com/open?id=1yrzdvaSBHi_IlGj5mP0fGusC-Lv6_O-G">
      <b>Stargate</b>
    </A>
    : <b>29 EDM/VGM charts</b> from rising charter Geo that are not related to
    the TV series!
  </div>
);
const paradigm = (
  <div>
    <A href="https://www.youtube.com/watch?v=Hnp5yQ0DJIs">
      <b>Paradigm</b>
    </A>
    : a <b>career-based</b>, GH-reminiscent experience!
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
    const monthlyBlurb = (
      <div>
        There are so many setlists coming up I can't keep up! Here's a few you
        (and I) may have missed:
        {digitizer}
        {zg}
        {stargate}
        {paradigm}
      </div>
    );
    return <div className="Announcement">{monthlyBlurb}</div>;
  }
}
