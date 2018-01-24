import Inferno from "inferno";
import Component from "inferno-component";

import Logo from "components/atoms/Logo";
import SearchBox from "components/organisms/SearchBox";
import SongList from "components/organisms/SongList";
import AdvancedSearch from "components/organisms/AdvancedSearch";

import Http from "utils/Http";

import Search from "pages/Search";

import "./style.scss";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    Http.get("/api/count").then(count => this.setState({ count }));
    Http.get("/api/latest").then(songs => this.setState({ songs }));
  }
  render() {
    const { count, songs, query, advanced } = this.state;
    const onQuery = query =>
      this.setState({ query }, () => {
        window.history.pushState(
          null,
          "Search",
          `${
            process.env.TESTING ? "/testing" : ""
          }/search?query=${encodeURIComponent(query)}`
        );
        if (typeof ga !== "undefined") {
          ga("set", "page", `/search?query=${encodeURIComponent(query)}`);
          ga("send", "pageview");
        }
      });
    return query ? (
      <Search query={query} />
    ) : (
      <div className="Home">
        <Logo count={count} />
        {!advanced && (
          <SearchBox
            label="What do you feel like playing today?"
            onQuery={onQuery}
          />
        )}
        {advanced && (
          <AdvancedSearch
            onQuery={onQuery}
            onSimple={() => this.setState({ advanced: false })}
          />
        )}
        <div className="Home__links">
          <a
            onClick={() => this.setState({ advanced: !advanced })}
            href="javascript:void(0)"
          >
            {advanced ? "Back to quick search" : "Advanced search"}
          </a>
        </div>
        <SongList title="Latest indexed charts" songs={songs} />
      </div>
    );
  }
}
