import { Component, render } from 'inferno';
import { BrowserRouter, Route, withRouter } from 'inferno-router';

import NavBar from 'components/organisms/NavBar';
import AdvancedSearch from 'components/organisms/AdvancedSearch';
import Announcement from 'components/organisms/Announcement';

import Home from 'pages/Home';
import Search from 'pages/Search';
import Random from 'pages/Random';

import 'assets/images/favicon_128.png';

import 'scss/global.scss';

// Un-comment in development mode if working without internet.
// import "assets/fonts/roboto/regular.ttf";
// import "assets/fonts/roboto/bold.ttf";
// import "assets/fonts/roboto/light.ttf";
// import "scss/fonts.scss";

import './index.html';

// Set a custom background if set by the user
const bg = window.localStorage.bg;
if (bg) {
  document.getElementById('background').style.backgroundImage = `url(${bg})`;
}

class ChorusApp extends Component {
  constructor(props) {
    super(props);
    this.state = { showAdvanced: false };
    this.query = this.query.bind(this);
    this.onAdvancedSearchToggle = this.onAdvancedSearchToggle.bind(this);
  }
  query(query) {
    this.setState({ showAdvanced: false });
    this.props.history.push(
      `${
        process.env.TESTING ? '/testing' : ''
      }/search?query=${encodeURIComponent(query)}`
    );
  }
  onAdvancedSearchToggle() {
    const { showAdvanced } = this.state;
    this.setState({ showAdvanced: !showAdvanced });
  }
  render() {
    const { showAdvanced } = this.state;
    return (
      <div>
        <NavBar
          onQuery={this.query}
          onAdvancedSearchToggle={this.onAdvancedSearchToggle}
          showAdvanced={showAdvanced}
        />
        <Announcement />
        {showAdvanced && <AdvancedSearch onQuery={this.query} />}
      </div>
    );
  }
}

const ChorusWithRouter = withRouter(ChorusApp);
render(
  <BrowserRouter>
    <div>
      <ChorusWithRouter />
      <Route exact path="/" component={Home} />
      <Route path="/random" component={Random} />
      <Route path="/search" component={Search} />
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
