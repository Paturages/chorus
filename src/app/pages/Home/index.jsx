import { Component } from "inferno";

import LoadingIndicator from "components/atoms/LoadingIndicator";
import NavBar from "components/organisms/NavBar";
import SearchBox from "components/organisms/SearchBox";
import SongList from "components/organisms/SongList";
import AdvancedSearch from "components/organisms/AdvancedSearch";

import Http from "utils/Http";

import "./style.scss";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { from: 0, isLoading: true };

    Http.get("/api/latest").then(({ roles, songs }) =>
      this.setState({
        isLoading: false,
        roles,
        songs,
        hasMore: songs.length == 20
      })
    );
  }
  loadMore() {
    const { songs, roles, from } = this.state;
    Http.get("/api/latest", { from: from + 20 }).then(
      ({ songs: newSongs, roles: newRoles }) =>
        this.setState({
          hasMore: newSongs.length == 20,
          songs: songs.concat(newSongs),
          roles: Object.assign(roles, newRoles),
          from: from + 20
        })
    );
  }
  render() {
    const { isLoading, roles, songs, advanced, hasMore, from } = this.state;
    const onQuery = query => {
      this.props.history.push(
        `${
          process.env.TESTING ? "/testing" : ""
        }/search?query=${encodeURIComponent(query)}`
      );
      if (typeof ga !== "undefined") {
        ga("set", "page", `/search?query=${encodeURIComponent(query)}`);
        ga("send", "pageview");
      }
    };
    return (
      <div className="Home">
        {advanced && (
          <AdvancedSearch
            onQuery={onQuery.bind(this)}
            onSimple={() => this.setState({ advanced: false })}
          />
        )}
        <div className="Home__links">
          <a
            onClick={() => this.setState({ advanced: !advanced })}
            href="javascript:void(0)"
          >
            {advanced ? "Close" : "Advanced search"}
          </a>
        </div>
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <SongList
            title="Latest charts"
            roles={roles}
            songs={songs}
            hasMore={hasMore}
            onMore={this.loadMore.bind(this)}
          />
        )}
      </div>
    );
  }
}
