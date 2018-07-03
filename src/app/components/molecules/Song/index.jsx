import Inferno from "inferno";

import DownloadLink from "components/atoms/DownloadLink";
import NoteDensity from "components/molecules/NoteDensity";
import SongFeatures from "components/molecules/SongFeatures";
import SongParts from "components/molecules/SongParts";

import "./style.scss";

const toTime = fullSeconds => {
  const minutes = (fullSeconds / 60) >> 0;
  const seconds = fullSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default props => {
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
    onDownload
  } = props;
  const playlist = fullSources.find(source => source.isSetlist);
  const sources = fullSources.filter(source => !source.isSetlist);
  return (
    <div className="Song">
      <div className="Song__meta">
        <div className="Song__artist">{artist}</div>
        <div className="Song__name">{name}</div>
        <div className="Song__album">
          {album || "Unknown album"}
          {year ? ` (${year})` : ""}
        </div>
        {genre && <div className="Song__genre">{genre}</div>}
        {length && (
          <div className="Song__length">
            {toTime(length)}{" "}
            <span className="Song__length-tooltip-trigger">
              ({toTime(effectiveLength)})
            </span>
            <div className="Song__length-tooltip">
              Between brackets is the effective length, which is the duration
              between the first and the last note. This duration is the one used
              in the NPS calculation.
            </div>
          </div>
        )}
        <div className="Song__charter">
          <DownloadLink
            onDownload={onDownload}
            link={link}
            charter={charter}
            roles={roles}
            isPack={isPack}
          />
          {playlist && (
            <div>
              <a href={playlist.link} onClick={onDownload}>
                Download the full <b>{playlist.name}</b> setlist
              </a>
            </div>
          )}
          {playlist &&
            playlist.parent && (
              <div className="Song__playlist-source">
                (from <b>{playlist.parent.name}</b>)
              </div>
            )}
        </div>
        {!!sources.length && (
          <div className="Song__sources">
            Source{sources.length == 1 ? "" : "s"}:
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
                {parent ? " in " : ""}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </div>
            ))}
          </div>
        )}
        <div className="Song__modified">
          {new Date(lastModified || uploadedAt)
            .toISOString()
            .replace(/T|\.\d+Z$/g, " ")}
        </div>
        {hashes && (
          <div className="Song__hash">Chart checksum: {hashes.file}</div>
        )}
      </div>
      {noteCounts && (
        <div className="Song__chart-info">
          <SongFeatures {...props} />
          <div className="Song__chart-metrics">
            <SongParts {...props} />
            <NoteDensity length={effectiveLength} noteCounts={noteCounts} />
          </div>
        </div>
      )}
    </div>
  );
};
