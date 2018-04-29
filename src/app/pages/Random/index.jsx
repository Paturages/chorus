import { Component } from "inferno";

import Logo from "components/atoms/Logo";
import SongList from "components/organisms/SongList";

import Http from "utils/Http";

import "./style.scss";

export default class Random extends Component {
  constructor(props) {
    super(props);
    this.state = { songs: [] };
    if (typeof ga !== "undefined") {
      ga("set", "page", `/random`);
      ga("send", "pageview");
    }
    Http.get("/api/random").then(({ songs, roles }) =>
      this.setState({ roles, songs })
    );
  }
  render() {
    const { songs, roles } = this.state;
    return (
      <div className="Random">
        <div className="Random__header">
          <Logo simple />
        </div>
        <SongList
          title="Random selection"
          roles={roles}
          songs={songs}
          hasMore={true}
          onMore={() =>
            this.setState({ songs: [] }, () =>
              Http.get("/api/random").then(({ songs, roles }) =>
                this.setState({ roles, songs })
              )
            )
          }
          moreLabel="New draft"
        />
      </div>
    );
  }
}
