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

// const RELEASE_DJENT = new Date('2020-01-16T09:00:00Z');
// const RELEASE_MONTHLY = new Date("2019-06-08T02:02:00Z");

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener">
    {children}
  </a>
);

const monthly = (
  <div>
    Well, we can't go out and see our favorite bands live right now. But you can
    at least enjoy live performances from some amazing bands in this month's
    pack!{' '}
    <A href="https://youtu.be/UZvmvgwAPIY">
      <b>Download CSC's May 2020 "Live" pack!</b>
    </A>
  </div>
);

const djent = (
  <div>
    36 songs, 2 solo medleys, a 27 minute song... and it djents?{' '}
    <A href="https://www.youtube.com/watch?v=mws8GZBhmLo">
      <b>Download the Djent Hero Collection Pack #3!</b>
    </A>
  </div>
);

const review = (
  <div>
    The new system is here! You can now apply to a{' '}
    <A href="https://docs.google.com/forms/d/e/1FAIpQLScjIfhEPp5rT1kNNJJINTYDpU2DmqpLOBSw06O9cu39xrr5Gw/viewform">
      new and shiny form
    </A>{' '}
    to get your charts in! Make sure you read the rules though.
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
    return (
      <div className="Announcement">
        {monthly}
        <br />
        Well shit, seems like things broke even more than usual. It's gonna take
        quite a bit of time to recover (more than 24 hours), so I guess this is
        nature's way of saying{' '}
        <A href="https://twitter.com/search?q=%23BlackLivesMatter">
          #BlackLivesMatter
        </A>
        .
        <br />
        Also{' '}
        <A href="https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o/edit#gid=0">
          refer to the spreadsheet
        </A>{' '}
        for common stuff like official setlists and so on.
      </div>
    );
  }
}
