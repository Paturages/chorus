import LoadingIndicator from "components/atoms/LoadingIndicator";
import Skeleton from "components/atoms/Skeleton";
import Song from "components/molecules/Song";
import Http from "utils/Http";
import "./style.scss";

const trackClick = song => Http.post(`/api/click?id=${song.id}`);

export default ({
  isLoading,
  title,
  subtitle,
  roles,
  songs,
  onMore,
  hasMore,
  moreLabel
}) => {
  return (
    (!isLoading || songs.length > 0) && (
      <div className="SongList">
        {title && <div className="SongList__title">{title}</div>}
        {subtitle && <div className="SongList__subtitle">{subtitle}</div>}
        {songs &&
          songs.map(song => (
            <Song roles={roles} onDownload={() => trackClick(song)} {...song} />
          ))}
        {onMore && hasMore && (
          <div className="SongList__more">
            <a href="javascript:void(0)" onClick={onMore}>
              {moreLabel || "More songs"}
            </a>
          </div>
        )}
        {isLoading && <LoadingIndicator />}
      </div>
    )
  );
};
