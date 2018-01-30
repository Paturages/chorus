import Inferno from "inferno";

import logo from "assets/images/logo.png"; // credits for the logo go to TheFilyng!

import "./style.scss";

// Of course there's an easter egg.
const ACRONYMS = [
  "Clone Hero-friendly Organized Repository of User-provided Songs",
  "Charting habitat of real unsettling secrets",
  "Cool hats on randyladyman's unlisted stream",
  "Clown harmonica olympics: a really useless sport.",
  `I see alot of personal preference in there... "looks bad" thats like a personal opinion. Not even going to bother arguing back on this because from how much you tried putting in there on finding things, i can see how thick you are in the head :LUL3D:`
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
        {process.env.NODE_ENV != "dev" && (
          <a
            href="https://digitaltipjar.com/paturages?_external=true"
            class="dtj-tip-button"
            data-username="paturages"
          >
            Digital Tip Jar
          </a>
        )}
        {process.env.NODE_ENV != "dev" && (
          <script>
            var a = document.querySelectorAll('.dtj-tip-button')[0]; var i =
            document.createElement('IFRAME'); i.setAttribute('src',
            "https://digitaltipjar.com/paturages/widgets/tip?_external=true");
            i.setAttribute('frameborder','0'); i.style.height = 70 +'px';
            i.style.width = 120 +'px'; a.parentNode.insertBefore(i,a);
            a.parentNode.removeChild(a);
          </script>
        )}
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
          </a>&nbsp;(shoutouts to <b>ZeroHearts</b>) and tons more from the
          Clone Hero community
        </div>
      )}
      <div className="Logo__subtitle">
        <a
          href="https://docs.google.com/document/d/14gJj66WpGKFPJOBCQ1HTOCrXuidWmGMVI2CIXA1-Qws/edit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wait, what is Clone Hero?
        </a>
        <br />
        <br />
        <span>
          Advanced search: it's ugly but it's here and it works. Kinda. Credits
          for the logo and favicon go to <b>TheFilyng</b>. Thanks man!
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
        Chart not working? Try&nbsp;
        <a
          href="https://drive.google.com/file/d/0BxG2l7vY7NPteWx0T0N1TkF2WDg/view"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIDIFix
        </a>! Make sure to&nbsp;
        <a
          href="https://i.gyazo.com/5da0997d9f2282a29532ae70559c7069.gif"
          target="_blank"
          rel="noopener noreferrer"
        >
          follow the instructions
        </a>.
        <br />
        <span>
          Having issues? File an issue on the GitHub or DM Paturages#9405 on
          Discord!
        </span>
      </div>
    </div>
  );
