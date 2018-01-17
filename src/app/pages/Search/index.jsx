import Inferno from "inferno";
import Component from "inferno-component";

import Logo from "components/atoms/Logo";
import SearchBox from "components/organisms/SearchBox";
import SongList from "components/organisms/SongList";

import Http from "utils/Http";

import "./style.scss";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { songs: [], query: props.query, from: 0 };
    if (typeof ga !== "undefined") {
      ga("set", "page", `/search?query=${props.query}`);
      ga("send", "pageview");
    }
    Http.get("/api/search", { query: props.query }).then(songs =>
      this.setState({
        songs,
        hasNothing: !songs.length,
        hasMore: songs.length == 20
      })
    );
  }
  render() {
    const { songs, query, from, hasMore, hasNothing } = this.state;
    return (
      <div className="Search">
        <div className="Search__header">
          <Logo simple />
          <SearchBox
            query={query}
            onQuery={query =>
              this.setState(
                { query, hasNothing: null, songs: [], from: 0 },
                () => {
                  window.history.pushState(
                    null,
                    "Search",
                    `${
                      process.env.TESTING ? "/testing" : ""
                    }/search?query=${encodeURIComponent(query)}`
                  );
                  if (typeof ga !== "undefined") {
                    ga(
                      "set",
                      "page",
                      `/search?query=${encodeURIComponent(query)}`
                    );
                    ga("send", "pageview");
                  }
                  Http.get("/api/search", { query }).then(songs =>
                    this.setState({
                      songs,
                      hasNothing: !songs.length,
                      hasMore: songs.length == 20
                    })
                  );
                }
              )
            }
          />
        </div>
        {!hasNothing && (
          <SongList
            songs={songs}
            hasMore={hasMore}
            onMore={() =>
              Http.get("/api/search", { query, from: from + 20 }).then(
                newSongs =>
                  this.setState({
                    hasMore: newSongs.length == 20,
                    songs: songs.concat(newSongs),
                    from: from + 20
                  })
              )
            }
          />
        )}
        {hasNothing && (
          <div className="Search__nothing">
            Sorry, we couldn't find anything!
          </div>
        )}
      </div>
    );
  }
}
