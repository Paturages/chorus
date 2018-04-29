import { Component } from "inferno";

import Logo from "components/atoms/Logo";
import SearchBox from "components/organisms/SearchBox";
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
    const query = new URLSearchParams(props.location.search).get("query");
    this.state = { songs: [], query, from: 0 };
    if (typeof ga !== "undefined") {
      ga("set", "page", `/search?query=${query}`);
      ga("send", "pageview");
    }
    Http.get("/api/search", { query }).then(({ songs, roles }) => {
      this.setState({
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
  render() {
    const {
      songs,
      roles,
      query,
      from,
      hasMore,
      hasNothing,
      substituteResult
    } = this.state;
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
                  this.props.history.push(
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
                  Http.get("/api/search", { query }).then(({ songs, roles }) =>
                    this.setState({
                      songs,
                      roles,
                      hasNothing: !songs.length,
                      hasMore: songs.length == 20,
                      substituteResult: (() => {
                        for (let phrase in substitutes) {
                          if (
                            this.state.query.toLowerCase().indexOf(phrase) > -1
                          ) {
                            return substitutes[phrase];
                          }
                        }
                        return null;
                      })()
                    })
                  );
                }
              )
            }
          />
        </div>
        {!hasNothing &&
          !substituteResult && (
            <SongList
              roles={roles}
              songs={songs}
              hasMore={hasMore}
              onMore={() =>
                Http.get("/api/search", { query, from: from + 20 }).then(
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
          )}
        {hasNothing &&
          !substituteResult && (
            <div className="Search__nothing">
              Sorry, we couldn't find anything!
            </div>
          )}
        {substituteResult && (
          <div className="Search__nothing">{substituteResult}</div>
        )}
      </div>
    );
  }
}
