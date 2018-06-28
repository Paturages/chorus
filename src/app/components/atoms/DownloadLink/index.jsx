import { Component } from "inferno";

import "./style.scss";

export default class DownloadLink extends Component {
  constructor(props) {
    super(props);
    const parts = (props.charter || "")
      .split(/&|,|\+|\//)
      .map(x => x.trim().toLowerCase());
    const firstRoledPart = parts.find(part => props.roles[part]);
    this.state = {
      roleText: firstRoledPart ? props.roles[firstRoledPart] : ""
    };
  }
  render() {
    const { link, charter, roles, isPack } = this.props;
    const { roleText } = this.state;
    const entityLabel = isPack ? " pack" : " chart";

    if (!charter) {
      if (!link) return <div className="DownloadLink">Unknown charter</div>;
      return (
        <div className="DownloadLink">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Download here
          </a>
        </div>
      );
    }

    const parts = charter.split(/&|,|\+|\//).map(x => x.trim());
    if (!parts.find(part => roles[part.toLowerCase()])) {
      if (!link)
        return (
          <div className="DownloadLink">
            charted by <b>{charter}</b>
          </div>
        );
      return (
        <div className="DownloadLink">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Download{" "}
            <b>
              {charter}'{charter.slice(-1) == "s" ? "" : "s"}
            </b>
            {entityLabel}
          </a>
        </div>
      );
    }

    const chartersElt = (
      <b>
        {parts.map((part, i) => {
          let suffix;
          if (i == parts.length - 1) suffix = "";
          else if (i == parts.length - 2) suffix = " and ";
          else suffix = ", ";
          return (
            <span
              className={
                roles[part.toLowerCase()]
                  ? "DownloadLink__charter--roled"
                  : "DownloadLink__charter"
              }
              onMouseOver={() =>
                roles[part.toLowerCase()] &&
                this.setState({
                  roleText: roles[part.toLowerCase()]
                })
              }
            >
              <span className="DownloadLink__charter-name">{part}</span>
              {suffix}
            </span>
          );
        })}
        {link ? (charter.slice(-1) == "s" ? "'" : "'s") : ""}
      </b>
    );

    if (!link)
      return (
        <div className="DownloadLink--verified DownloadLink--no-link">
          charted by <a>{chartersElt}</a>
          <div className="DownloadLink__tooltip">{roleText}</div>
        </div>
      );
    return (
      <div className="DownloadLink--verified">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Download {chartersElt}
          {entityLabel}
        </a>
        <div className="DownloadLink__tooltip">{roleText}</div>
      </div>
    );
  }
}
