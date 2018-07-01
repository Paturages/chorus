import Inferno from "inferno";
import Http from "utils/Http";

import LoadingIndicator from "components/atoms/LoadingIndicator";
import Song from "components/molecules/Song";

const trackClick = song => Http.post(`/api/click?id=${song.id}`);

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
    {songs &&
      songs.map(song => (
        <Song roles={roles} onDownload={() => trackClick(song)} {...song} />
      ))}
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
