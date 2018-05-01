import { Component } from "inferno";
import { withRouter } from "inferno-router";

import Http from "utils/Http";

import Logo from "components/atoms/Logo";
import SearchInput from "components/molecules/SearchInput";
// import DonationButton from "components/atoms/DonationButton";
// import Login from "components/molecules/Login";

import "./style.scss";

// Of course there's an easter egg.
const ACRONYMS = [
  "Clone Hero-friendly Organized Repository of User-provided Songs",
  "Charting Habitat Of Real Unsettling Secrets",
  "Cool Hats On Randyladyman's Unlisted Stream",
  "Clown Harmonica Olympics: a Really Useless Sport",
  "Cars Honking Over a Rare Utopian Speedway",
  "No, you won't find GH2 ISOs here",
  "we are solo",
  "FLEE THE BURNING"
  // TODO: I need more! Send pull requests!
];
let ACRONYM;
const now = new Date();
if (now.getHours() == 21 && now.getMinutes() > 30) {
  ACRONYM = "holy shit its almost 10pm, I can be a Charter";
} else if (Math.random() < 0.1) {
  ACRONYM = ACRONYMS[(Math.random() * ACRONYMS.length) >> 0];
} else {
  ACRONYM = ACRONYMS[0];
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: new URLSearchParams(props.location.search).get("query")
    };
    Http.get("/api/count").then(count => this.setState({ count }));
  }
  onQuery(query) {
    this.props.history.push(
      `${process.env.TESTING ? "/testing" : ""}/${(query &&
        `search?query=${encodeURIComponent(query)}`) ||
        ""}`
    );
  }
  goToRandom(evt) {
    evt.preventDefault();
    this.props.history.push(`${process.env.TESTING ? "/testing" : ""}/random`);
  }
  render() {
    const { count } = this.state;
    return (
      <div className="NavBar">
        <div className="NavBar__links">
          <div className="NavBar__inner">
            <div className="NavBar__item NavBar__item-acronym">
              {ACRONYM}&nbsp;
              {count && (
                <span>
                  <a
                    href="https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o/edit#gid=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Shoutouts to ZeroHearts and tons more from the Clone Hero community!"
                  >
                    (<b>{count}</b> songs and counting)
                  </a>
                </span>
              )}
            </div>
            <div className="NavBar__spacer" />
            <a
              class="NavBar__item NavBar__item-link"
              href="https://www.youtube.com/channel/UCc3IfdqGZjhdgQbi_EpfuYg"
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
              <Logo />
            </div>
            <div className="NavBar__item NavBar__item-input">
              <SearchInput
                placeholder="What do you feel like playing today?"
                query={this.state.query}
                onQuery={this.onQuery.bind(this)}
              />
            </div>
            <a
              class="NavBar__item NavBar__item-link"
              onClick={this.goToRandom.bind(this)}
              href="#"
            >
              Randomizer!
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
