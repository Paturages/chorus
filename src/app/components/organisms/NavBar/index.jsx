import { Component } from 'inferno';
import { withRouter } from 'inferno-router';

import Http from 'utils/Http';

import Logo from 'components/atoms/Logo';
import SearchInput from 'components/molecules/SearchInput';
// import DonationButton from "components/atoms/DonationButton";
// import Login from "components/molecules/Login";

import './style.scss';

// Of course there's an easter egg.
const ACRONYMS = [
  'Clone Hero-friendly Organized Repository of User-provided Songs',
  'Charting Habitat Of Real Unsettling Secrets',
  "Cool Hats On Randyladyman's Unlisted Stream",
  'Clown Harmonica Olympics: a Really Useless Sport',
  'Cars Honking Over a Rare Utopian Speedway',
  'we are solo',
  'h',
  'intake remedy',
  'consume prescription',
  'take meds',
  '薬忘れない',
  'Home of Guitar Hero: High Tech 3',
  '!chorusstatus',
  'Daily reminder that stealing charts is wrong and there will be retaliation',
  'honk',
  '6-frets is not dead',
  "Chezy's Amazingly Rad Setli- wait, hold on a second"
];
let ACRONYM;
const now = new Date();
if (now.getHours() == 21 && now.getMinutes() > 30) {
  ACRONYM = 'holy shit its almost 10pm, I can be a Charter';
} else if (Math.random() < 0.1) {
  ACRONYM = ACRONYMS[(Math.random() * ACRONYMS.length) >> 0];
} else {
  ACRONYM = ACRONYMS[0];
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { query: this.getQuery(props) };
    Http.get('/api/count').then(count => this.setState({ count }));
  }
  componentWillReceiveProps(props) {
    this.setState({ query: this.getQuery(props) });
  }
  getQuery(props) {
    return new URLSearchParams(props.location.search).get('query');
  }
  goToRandom(evt) {
    evt.preventDefault();
    this.props.history.push(`${process.env.TESTING ? '/testing' : ''}/random`);
  }
  render() {
    const { onQuery, onAdvancedSearchToggle, showAdvanced } = this.props;
    const { count } = this.state;
    return (
      <div className="NavBar">
        <div className="NavBar__links">
          <div className="NavBar__inner">
            <div className="NavBar__item NavBar__item-acronym">
              {ACRONYM}
              &nbsp;
              {count && (
                <span>
                  <a
                    href="https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o/edit#gid=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Link to CH customs spreadsheet. Shoutouts to all contributing charters!"
                  >
                    (<b>{count}</b> songs and counting)
                  </a>
                </span>
              )}
            </div>
            <div className="NavBar__spacer" />
            <a
              class="NavBar__item NavBar__item-link"
              href="https://clonehero.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Clone Hero
            </a>
            <a
              class="NavBar__item NavBar__item-link"
              href="https://github.com/Paturages/chorus/blob/master/sources/sources.txt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add Songs
            </a>
            <a
              class="NavBar__item NavBar__item-link"
              href="https://github.com/Paturages/chorus/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              File a Bug
            </a>
          </div>
        </div>
        <div className="NavBar__main">
          <div className="NavBar__inner">
            <div className="NavBar__item NavBar__item-logo">
              <Logo history={this.props.history} />
            </div>
            <div className="NavBar__item NavBar__item-input">
              <SearchInput
                placeholder="What do you feel like playing today?"
                query={this.state.query}
                onQuery={onQuery}
              />
            </div>
            <a
              class="NavBar__item NavBar__item-link"
              onClick={onAdvancedSearchToggle}
              href="javascript:void(0)"
            >
              {showAdvanced ? 'Back to Normal Search' : 'Advanced Search'}
            </a>
            <a
              class="NavBar__item NavBar__item-link"
              onClick={this.goToRandom.bind(this)}
              href="javascript:void(0)"
            >
              Randomizer!
            </a>
            <a
              class="NavBar__item NavBar__item-link"
              href="javascript:void(0)"
              onClick={() => {
                const bg = window.prompt(
                  'Paste in a direct link to an image (e.g. https://chorus.fightthe.pw/assets/images/monika.jpg) to set it as a custom background. (Note: You can reset this by clicking OK without any text)'
                );
                window.localStorage.bg = bg;
                document.getElementById(
                  'background'
                ).style.backgroundImage = `url(${bg})`;
              }}
            >
              Set Background
            </a>
            <a
              class="NavBar__item NavBar__item-link"
              href="https://gh3orus.fightthe.pw"
            >
              gh3orus
            </a>
            {/* <DonationButton /> */}
            {/*
              TODO: Uncomment when feeling like implementing Discord auth
              <Login />
            */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NavBar);
