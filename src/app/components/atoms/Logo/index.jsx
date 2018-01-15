import Inferno from "inferno";

import logo from "assets/images/logo.png"; // credits for the logo go to TheFilyng!

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
        <a href={`${process.env.TESTING ? "/testing" : ""}/`}>
          <img
            src="/assets/images/logo.png"
            alt="chorus"
            className="Logo__image"
          />
        </a>
      </div>
    </div>
  ) : (
    <div className="Logo">
      <div className="Logo__title">
        <a href={`${process.env.TESTING ? "/testing" : ""}/`}>
          <img
            src="/assets/images/logo.png"
            alt="chorus"
            className="Logo__image"
          />
        </a>
        <a
          href="https://digitaltipjar.com/paturages?_external=true"
          class="dtj-tip-button"
          data-username="paturages"
        >
          Digital Tip Jar
        </a>
        <script>
          var a = document.querySelectorAll('.dtj-tip-button')[0]; var i =
          document.createElement('IFRAME'); i.setAttribute('src',
          "https://digitaltipjar.com/paturages/widgets/tip?_external=true");
          i.setAttribute('frameborder','0'); i.style.height = 70 +'px';
          i.style.width = 120 +'px'; a.parentNode.insertBefore(i,a);
          a.parentNode.removeChild(a);
        </script>
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
          </a>&nbsp; (shoutouts to <b>ZeroHearts</b>) and tons more from the
          Clone Hero community
        </div>
      )}
      <div className="Logo__subtitle">
        <br />
        <span>
          Advanced search is coming soon, I swear. Credits for the logo and
          favicon go to <b>TheFilyng</b>. Thanks man!
        </span>
        <br />
        <b>
          <a
            href="https://github.com/Paturages/chorus"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </b>&nbsp;-&nbsp;
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
