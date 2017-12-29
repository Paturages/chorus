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
        <b><a href="https://github.com/Paturages/chorus">GitHub</a></b>
      </div>
    </div>
  );
