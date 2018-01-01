import Inferno from "inferno";

import "./style.scss";

export default ({ simple, count }) =>
  simple ? (
    <div className="Logo">
      <div className="Logo__title">
        <a href="/">chorus</a>
      </div>
    </div>
  ) : (
    <div className="Logo">
      <div className="Logo__title">
        <a href="/">chorus</a>
      </div>
      <div className="Logo__subtitle">
        Clone Hero-friendly Organized Repository of User-provided Songs
      </div>
      {count && (
        <div className="Logo__subtitle">
          featuring <b>{count}</b> charts scraped from&nbsp;
          <a
            href="https://docs.google.com/spreadsheets/d/13B823ukxdVMocowo1s5XnT3tzciOfruhUVePENKc01o/edit#gid=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            various drives of this spreadsheet
          </a>
        </div>
      )}
      <div className="Logo__subtitle">
        <br />
        <b>
          <a
            href="https://github.com/Paturages/chorus"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </b>
        <br />
        <a
          href="https://github.com/Paturages/chorus/blob/master/source-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Want to add more songs to chorus?
        </a>
        <br />
        <span>
          Having issues? File an issue on the GitHub or DM Paturages#9405 on
          Discord!
        </span>
      </div>
    </div>
  );
