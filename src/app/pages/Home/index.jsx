import Inferno from "inferno";
import Component from "inferno-component";

import NavBar from "components/organisms/NavBar";
import SearchBox from "components/organisms/SearchBox";
import SongList from "components/organisms/SongList";
import AdvancedSearch from "components/organisms/AdvancedSearch";

import Http from "utils/Http";

import Search from "pages/Search";

import "./style.scss";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { from: 0 };
    Http.get("/api/count").then(count => this.setState({ count }));
    Http.get("/api/latest").then(({ roles, songs }) =>
      this.setState({ roles, songs, hasMore: songs.length == 20 })
    );
  }
  render() {
    const { count, roles, songs, query, advanced, hasMore, from } = this.state;
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
        <NavBar count={count} />
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
        <SongList
          title="Latest indexed charts"
          roles={roles}
          songs={songs}
          hasMore={hasMore}
          onMore={() =>
            Http.get("/api/latest", { from: from + 20 }).then(
              ({ songs: newSongs, roles: newRoles }) =>
                this.setState({
                  hasMore: newSongs.length == 20,
                  songs: songs.concat(newSongs),
                  roles: Object.assign(roles, newRoles),
                  from: from + 20
                })
            )
          }
        />
      </div>
    );
  }
}
