import Inferno from "inferno";

import "./style.scss";

export default ({
  name,
  artist,
  charter,
  source,
  sourceLink,
  link,
  lastModified
}) => (
  <div className="Song">
    <div className="Song__meta">
      <div className="Song__artist">{artist}</div>
      <div className="Song__name">{name}</div>
      <div className="Song__link">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Download here
        </a>
      </div>
    </div>
    <div className="Song__chart">
      {charter ? (
        <div className="Song__charter">
          charted by <b>{charter}</b>
        </div>
      ) : (
        "Unknown charter"
      )}
      <div className="Song__source">
        found in{" "}
        <a href={sourceLink} target="_blank" rel="noopener noreferrer">
          {source}
        </a>
      </div>
      <div className="Song__modified">
        {new Date(lastModified).toISOString().replace(/T|\.\d+Z$/g, " ")}
      </div>
    </div>
  </div>
);
