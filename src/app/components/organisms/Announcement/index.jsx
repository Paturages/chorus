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
    <A href="https://www.youtube.com/watch?v=rVgq2d7U3FE">
      Sorry, did I say popular music? What I meant to say was
      👌👀👌👀👌👀👌👀👌👀 weird shit weird sHit👌 thats ✔ some weird👌👌shit
      right👌👌there👌👌👌 right✔there ✔✔if i do ƽaү so my self 💯 i say so 💯
      thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ)
      mMMMMᎷМ💯 👌👌 👌НO0ОଠOOOOOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ👌 👌👌 👌 💯 👌 👀 👀 👀
      👌👌Weird shit
    </A>
  </div>
);

const cth1r = (
  <div>
    Years after Carpal Tunnel Hero revolutionized the charting community and
    laid down the first groundwork for the creation of CSC,
    <br />
    we're proud to present it remastered and brought to modern standards -
    including lyrics and image backgrounds.
    <A href="https://www.youtube.com/watch?v=42rTAiEQuSQ">
      <b>Download Carpal Tunnel Hero Remaster</b>
    </A>
  </div>
);

const djent = (
  <div>
    Something about low-pitched guitars and bangers, this is the{' '}
    <b>Djent Hero Collection Pack #4</b>!{' '}
    <A href="https://www.youtube.com/watch?v=8dIKORUb5w8">Download here</A>
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
        {cth1r}
        {djent}
      </div>
    );
  }
}
