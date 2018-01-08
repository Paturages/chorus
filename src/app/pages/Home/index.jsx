import Inferno from "inferno";
import Component from "inferno-component";

import Logo from "components/atoms/Logo";
import SearchBox from "components/organisms/SearchBox";
import SongList from "components/organisms/SongList";

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
    const { count, songs, query } = this.state;
    return query ? (
      <Search query={query} />
    ) : (
      <div className="Home">
        <Logo count={count} />
        <SearchBox
          label="What do you feel like playing today?"
          onQuery={query =>
            this.setState({ query: encodeURIComponent(query) }, () => {
              window.history.pushState(
                null,
                "Search",
                `/search?query=${encodeURIComponent(query)}`
              );
              if (typeof ga !== "undefined") {
                ga("set", "page", `/search?query=${encodeURIComponent(query)}`);
                ga("send", "pageview");
              }
            })
          }
        />
        <SongList title="Latest indexed charts" songs={songs} />
      </div>
    );
  }
}
