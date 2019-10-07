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
        The night is dark and full of surprises. And apparently people like
        surprises.{" "}
        <a
          href="https://customsongscentral.com/csc-monthly-pack-october-2019/"
          target="_blank"
        >
          Download the CSC October 2019 Monthly Pack
        </a>
        !
      </div>
    );
    return <div className="Announcement">{monthlyBlurb}</div>;
  }
}
