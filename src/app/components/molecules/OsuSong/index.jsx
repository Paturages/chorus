import Inferno from 'inferno';
import './style.scss';

import DownloadLink from 'components/atoms/DownloadLink';
import SongParts from 'components/molecules/SongParts';
import NoteDensity from 'components/molecules/NoteDensity';

export default (props) => {
  const {
    name,
    artist,
    album,
    genre,
    length,
    effectiveLength,
    year,
    charter,
    roles,
    isPack,
    noteCounts,
    lastModified,
    uploadedAt,
    link,
    hashes,
    sources: fullSources = [],
    onDownload,
  } = props;
  const playlist = fullSources.find((source) => source.isSetlist);
  const sources = fullSources.filter((source) => !source.isSetlist);
  return (
    <div class="osu-row">
      <div class="left">
        <div class="title">
          <span class="name">{name}</span>
          <span class="artist">by {artist}</span>
        </div>
        <div class="description">
          <DownloadLink
            onDownload={onDownload}
            link={link}
            charter={charter}
            roles={roles}
            isPack={isPack}
          />
          <span class="period">
            {new Date(lastModified || uploadedAt)
              .toISOString()
              .replace(/T|\.\d+Z$/g, ' ')}
          </span>
        </div>
      </div>
      <div class="details">
        {!!sources.length && (
          <div className="Song__sources">
            Source
            {sources.length == 1 ? '' : 's'}:
            {sources.map(({ name, link, parent }) => (
              <div className="Song__source">
                {parent && (
                  <a
                    href={parent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {parent.name}
                  </a>
                )}
                {parent ? ' in ' : ''}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      <div class="right">
        <SongParts {...props} />
      </div>
    </div>
  );
};
