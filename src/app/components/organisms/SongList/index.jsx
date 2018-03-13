import Inferno from "inferno";

import Song from "components/molecules/Song";

import "./style.scss";

export default ({ title, roles, songs, onMore, hasMore, moreLabel }) => (
  <div className="SongList">
    {title && <div className="SongList__title">{title}</div>}
    {songs && songs.map(song => <Song roles={roles} {...song} />)}
    {onMore &&
      hasMore && (
        <div className="SongList__more">
          <a href="javascript:void(0)" onClick={onMore}>
            {moreLabel || "More songs"}
          </a>
        </div>
      )}
  </div>
);
