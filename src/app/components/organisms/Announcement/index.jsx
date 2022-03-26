import Inferno from 'inferno';
import Component from 'inferno-component';

import './style.scss';

const getHumanTime = (time) => {
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
    `${seconds}s`,
  ]
    .filter((x) => x)
    .join(' ');
};

// const RELEASE_DJENT = new Date('2020-01-16T09:00:00Z');
// const RELEASE_MONTHLY = new Date("2019-06-08T02:02:00Z");

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener">
    {children}
  </a>
);

const monthly = (
  <div>
    <A href="https://www.youtube.com/watch?v=2Db1hOJ8d_Y">
      This month, everyone is doing what they're known for. These are our
      signatures, and we hope you'll recognize them!
    </A>
  </div>
);

const revolved = (
  <div>
    You most likely don't need to know how much is 1 + 1 for this one, but you
    never know. <b>REVOLVED Vol. 1 - Mathcore Fest (Full Difficulty)</b>{' '}
    <A href="https://youtu.be/-iT1hRSQOQY">Download here</A>
  </div>
);

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   left: RELEASE_DJENT - new Date()
    // };
    // if (this.state.left > 0)
    //   setInterval(
    //     () =>
    //       this.setState({
    //         left: RELEASE_DJENT - new Date()
    //       }),
    //     333
    //   );
  }
  render() {
    // zzzzzzzzz
    return null;
    // return (
    //   <div className="Announcement">
    //     In today's episode of "I am very bad at design", I realized upon
    //     implementing osu!chorus that uh
    //     <br />
    //     things might look better with less information, so try this I guess
    //   </div>
    // );
  }
}
