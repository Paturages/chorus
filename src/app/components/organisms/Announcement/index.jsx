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
    Have you found your Valentine's yet? It's not too late, you can get the{' '}
    <b>CSC February Monthly Pack</b> to help you! (it's also not too late for me
    to put this announcement){' '}
    <A href="https://customsongscentral.com/csc-monthly-pack-february-2020/">
      <b>Download here!</b>
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
        {review}
      </div>
    );
  }
}
