import Inferno from "inferno";

import "./style.scss";

// Of course there's an easter egg.
const ACRONYMS = [
  "Clone Hero-friendly Organized Repository of User-provided Songs",
  "Charting habitat of real unsettling secrets",
  "Cool hats on randyladyman's unlisted stream",
  "Clown harmonica olympics: a really useless sport."
  // TODO: I need more! Send pull requests!
];

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
        {Math.random() < 0.1
          ? ACRONYMS[(Math.random() * ACRONYMS.length) >> 0]
          : ACRONYMS[0]}
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
          </a>&nbsp;and tons more from the Clone Hero community
        </div>
      )}
      <div className="Logo__subtitle">
        <br />
        <span>Advanced search is coming soon, I swear.</span>
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
          href="https://github.com/Paturages/chorus/blob/master/sources/sources.txt"
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
