import Inferno from "inferno";

import LoadingIndicator from "components/atoms/LoadingIndicator";
import Song from "components/molecules/Song";

import "./style.scss";

export default ({
  isLoading,
  title,
  roles,
  songs,
  onMore,
  hasMore,
  moreLabel
}) => (
  <div className="SongList">
    {(!isLoading || songs.length > 0) &&
      title && <div className="SongList__title">{title}</div>}
    {songs && songs.map(song => <Song roles={roles} {...song} />)}
    {!isLoading &&
      onMore &&
      hasMore && (
        <div className="SongList__more">
          <a href="javascript:void(0)" onClick={onMore}>
            {moreLabel || "More songs"}
          </a>
        </div>
      )}
    {isLoading && <LoadingIndicator />}
  </div>
);
