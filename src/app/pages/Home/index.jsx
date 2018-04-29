import { Component } from "inferno";

import NavBar from "components/organisms/NavBar";
import SearchBox from "components/organisms/SearchBox";
import SongList from "components/organisms/SongList";
import AdvancedSearch from "components/organisms/AdvancedSearch";

import Http from "utils/Http";

import "./style.scss";

const RANDOM_LABELS = [
  "just fuck my shit up fam",
  "I hope there's no tables",
  "I have no idea what I'm doing",
  "i'm 12 and what is this",
  "20 TTFAF memes and recharts",
  "Serendipity"
];
const RANDOM_LABEL = RANDOM_LABELS[(Math.random() * RANDOM_LABELS.length) >> 0];

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
    const { count, roles, songs, advanced, hasMore, from } = this.state;
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
        <NavBar count={count} />
        {!advanced && (
          <SearchBox
            label="What do you feel like playing today?"
            onQuery={onQuery.bind(this)}
          />
        )}
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
            {advanced ? "Back to quick search" : "Advanced search"}
          </a>&nbsp;-&nbsp;<a
            onClick={() => {
              this.props.history.push(
                `${process.env.TESTING ? "/testing" : ""}/random`
              );
              if (typeof ga !== "undefined") {
                ga("set", "page", `/random`);
                ga("send", "pageview");
              }
            }}
            href="javascript:void(0)"
          >
            {RANDOM_LABEL} (random songs)
          </a>
        </div>
        <SongList
          title="Latest charts"
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
