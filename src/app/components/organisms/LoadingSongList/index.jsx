import Inferno from 'inferno';

import Skeleton from 'components/atoms/Skeleton';

export default () => (
  <div className="SongList">
    {[...new Array(5)].map((index) => (
      <div className="Song" key={index}>
        <div className="Song__meta">
          <Skeleton style={{ maxWidth: 250 }} />
          <Skeleton style={{ maxWidth: 100, height: 13 }} />
          <Skeleton style={{ maxWidth: 80, height: 13 }} />
          <Skeleton style={{ maxWidth: 125, height: 13 }} />
          <Skeleton style={{ marginTop: 30, maxWidth: 50, height: 13 }} />
          <Skeleton style={{ maxWidth: 125, height: 13 }} />
        </div>
        <div className="Song__chart-info">
          <div className="SongFeatures">
            <Skeleton style={{ width: 100, height: 13 }} />
            <Skeleton style={{ maxWidth: 100, height: 13 }} />
            <Skeleton style={{ maxWidth: 100, height: 13 }} />
          </div>
          <div className="Song__chart-metrics">
            <Skeleton style={{ width: 100, height: 13 }} />
            <Skeleton style={{ width: 50, height: 13 }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
