import { Component } from "inferno";

import SongList from "components/organisms/SongList";

import Http from "utils/Http";

import "./style.scss";

const substitutes = {
  "ugandan knuckles": "No, I don't know the fucking way.",
  "uganda knuckles": "No, I don't know the fucking way."
};

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = this.getLoadingState();
    this.fetchData(props);
  }
  componentWillReceiveProps(props) {
    this.setState(this.getLoadingState());
    this.fetchData(props);
  }
  getLoadingState() {
    return { songs: [], from: 0, hasMore: false, isLoading: true };
  }
  getQuery(props) {
    return new URLSearchParams(props.location.search).get("query");
  }
  fetchData(props) {
    const query = this.getQuery(props);
    if (typeof ga !== "undefined") {
      ga("set", "page", `/search?query=${query}`);
      ga("send", "pageview");
    }
    Http.get("/api/search", { query }).then(({ songs, roles }) => {
      this.setState({
        isLoading: false,
        roles,
        songs,
        hasNothing: !songs.length,
        hasMore: songs.length == 20,
        substituteResult: (() => {
          for (let phrase in substitutes) {
            if (query.toLowerCase().indexOf(phrase) > -1) {
              return substitutes[phrase];
            }
          }
          return null;
        })()
      });
    });
  }
  nextPage() {
    const query = this.getQuery(this.props);
    const { from, roles, songs } = this.state;
    this.setState({ isLoading: true });
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    Http.get("/api/search", { query, from: from + 20 }).then(
      ({ songs: newSongs, roles: newRoles }) =>
        this.setState({
          isLoading: false,
          hasMore: newSongs.length == 20,
          songs: songs.concat(newSongs),
          roles: Object.assign(roles, newRoles),
          from: from + 20
        })
    );
  }
  render() {
    const {
      isLoading,
      songs,
      roles,
      hasMore,
      hasNothing,
      substituteResult
    } = this.state;
    return (
      <div className="Search">
        {!hasNothing &&
          !substituteResult && (
            <SongList
              isLoading={isLoading}
              title="Search results"
              roles={roles}
              songs={songs}
              hasMore={hasMore}
              onMore={this.nextPage.bind(this)}
            />
          )}
        {!isLoading &&
          hasNothing &&
          !substituteResult && (
            <div className="Search__nothing">
              Sorry, we couldn't find anything!
            </div>
          )}
        {!isLoading &&
          substituteResult && (
            <div className="Search__nothing">{substituteResult}</div>
          )}
      </div>
    );
  }
}
