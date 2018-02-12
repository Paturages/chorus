import Inferno from "inferno";

import Logo from "components/atoms/Logo";
import DigitalTipJar from "components/atoms/DigitalTipJar";
// import Login from "components/molecules/Login";

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

export default ({ count }) => (
  <div className="NavBar">
    <div className="NavBar__head">
      <Logo />
      <DigitalTipJar />
      <div className="NavBar__head-spacer" />
      {/*
        TODO: Uncomment when feeling like implementing Discord auth
        <Login />
      */}
    </div>
    <div className="NavBar__text">
      <div className="NavBar__item">
        {Math.random() < 0.1
          ? ACRONYMS[(Math.random() * ACRONYMS.length) >> 0]
          : ACRONYMS[0]}
      </div>
      {count && (
        <div className="NavBar__item">
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
      <div className="NavBar__item">
        <a
          href="https://www.youtube.com/watch?v=RgXoakBVAgc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wait, what is Clone Hero?
        </a>
      </div>
      <br />
      <div className="NavBar__item">
        You probably won't be able to find the DDLC easter egg here. Why don't
        you read an{" "}
        <i>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://store.steampowered.com/app/658620/Wonderful_Everyday_Down_the_RabbitHole/"
          >
            actual visual novel
          </a>
        </i>? <small className="NavBar__kappa">Kappa</small>
      </div>
      <div className="NavBar__item">
        <a
          href="https://github.com/Paturages/chorus"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>&nbsp;-&nbsp;<a
          href="https://github.com/Paturages/chorus/blob/master/sources/sources.txt"
          target="_blank"
          rel="noopener noreferrer"
        >
          Want to add more songs to chorus?
        </a>
      </div>
      <div className="NavBar__item">
        Chart not working? This is your friendly reminder to{" "}
        <b>scan your songs on CH</b> after extracting them. Also try&nbsp;
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
      </div>
      <div className="NavBar__item">
        Having issues? File an issue on the GitHub or DM Paturages#9405 on
        Discord!
      </div>
    </div>
  </div>
);
