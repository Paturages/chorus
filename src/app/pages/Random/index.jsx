import { Component } from "inferno";

import LoadingIndicator from "components/atoms/LoadingIndicator";
import SongList from "components/organisms/SongList";

import Http from "utils/Http";

import "./style.scss";

export default class Random extends Component {
  constructor(props) {
    super(props);
    this.state = this.getLoadingState();
    this.fetchRandom();
  }
  componentWillReceiveProps(props) {
    this.setState(this.getLoadingState());
    this.fetchRandom();
  }
  getLoadingState() {
    return { songs: [], isLoading: true };
  }
  fetchRandom() {
    if (typeof ga !== "undefined") {
      ga("set", "page", `/random`);
      ga("send", "pageview");
    }
    Http.get("/api/random").then(({ songs, roles }) => {
      this.setState({ roles, songs, isLoading: false });
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }
  render() {
    const { isLoading, songs, roles } = this.state;
    return (
      <div className="Random">
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <SongList
            title="Hand-crafted randomness"
            roles={roles}
            songs={songs}
            hasMore={true}
            onMore={this.fetchRandom.bind(this)}
            moreLabel="Gimme moar random"
          />
        )}
      </div>
    );
  }
}
