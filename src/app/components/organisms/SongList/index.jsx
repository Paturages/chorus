import Inferno from 'inferno';
import Http from 'utils/Http';

import LoadingIndicator from 'components/atoms/LoadingIndicator';
import OsuSong from 'components/molecules/OsuSong';

const trackClick = (song) => Http.post(`/api/click?id=${song.id}`);

import './style.scss';

export default ({
  isLoading,
  title,
  subtitle,
  roles,
  songs,
  onMore,
  hasMore,
  moreLabel,
}) =>
  (!isLoading || songs.length > 0) && (
    <div className="SongList">
      {title && <div className="SongList__title">{title}</div>}
      {subtitle && <div className="SongList__subtitle">{subtitle}</div>}
      {songs &&
        songs.map((song) => (
          <OsuSong
            roles={roles}
            onDownload={() => trackClick(song)}
            {...song}
          />
        ))}
      {onMore && hasMore && (
        <div className="SongList__more">
          <a href="javascript:void(0)" onClick={onMore}>
            {moreLabel || 'More songs'}
          </a>
        </div>
      )}
      {isLoading && <LoadingIndicator />}
    </div>
  );
