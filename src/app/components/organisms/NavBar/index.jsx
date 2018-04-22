import Inferno from "inferno";

import Logo from "components/atoms/Logo";
// import DonationButton from "components/atoms/DonationButton";
// import Login from "components/molecules/Login";

import ohMyGood from "assets/images/ohmygood.png";

import "./style.scss";

// Of course there's an easter egg.
const ACRONYMS = [
  "Clone Hero-friendly Organized Repository of User-provided Songs",
  "Charting habitat of real unsettling secrets",
  "Cool hats on randyladyman's unlisted stream",
  "Clown harmonica olympics: a really useless sport.",
  `I see alot of personal preference in there... "looks bad" thats like a personal opinion. Not even going to bother arguing back on this because from how much you tried putting in there on finding things, i can see how thick you are in the head :LUL3D:`,
  <div>
    {[1, 2, 3, 4, 5]
      .map(() => (
        <img className="NavBar__oh-my-good" src={ohMyGood} alt="Oh my good!" />
      ))
      .concat(<small>(no, you won't find GH2 ISOs here)</small>)}
  </div>,
  "we are solo",
  "FLEE THE BURNING"
  // TODO: I need more! Send pull requests!
];
let ACRONYM;
const now = new Date();
if (now.getHours() == 21 && now.getMinutes() > 30) {
  ACRONYM = "holy shit its almost 10pm, I can be a Charter";
} else if (Math.random() < 0.1) {
  ACRONYM = ACRONYMS[(Math.random() * ACRONYMS.length) >> 0];
} else {
  ACRONYM = ACRONYMS[0];
}

export default ({ count }) => (
  <div className="NavBar">
    <div className="NavBar__head">
      <Logo />
      {/* <DonationButton /> */}
      <div className="NavBar__head-spacer" />
      {/*
        TODO: Uncomment when feeling like implementing Discord auth
        <Login />
      */}
    </div>
    <div className="NavBar__text">
      <div className="NavBar__item">{ACRONYM}</div>
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
          href="https://www.youtube.com/channel/UCc3IfdqGZjhdgQbi_EpfuYg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wait, what is Clone Hero?
        </a>
      </div>
      <br />
      <div className="NavBar__item">
        Did you like the custom background? You can define your own one by{" "}
        <a
          href="javasript:void(0)"
          onClick={() => {
            const bg = window.prompt(
              "Paste in a direct link to an image (e.g. https://chorus.fightthe.pw/assets/images/monika.jpg)"
            );
            window.localStorage.setItem("bg", bg);
            document.getElementsByClassName(
              "Background"
            )[0].style.backgroundImage = `url(${bg})`;
          }}
        >
          clicking here
        </a>!
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
