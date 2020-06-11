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
    It's the two-year anniversary of the CSC monthly pack, and you know what
    that means: we're kicking metal to the curb in favor of literally anything
    else!{' '}
    <A href="https://www.youtube.com/watch?v=R5Q5AkM0qSA">
      <b>Download CSC's June 2020 "Anything but metal" pack!</b>
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
        It's not like anyone will notice what I write here anyway.
      </div>
    );
  }
}
