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
      roleText: firstRoledPart ? props.roles[firstRoledPart] : "",
      partIndex: 0
    };
  }
  render() {
    const { link, charter, roles, isPack } = this.props;
    const { roleText, partIndex } = this.state;
    if (!charter)
      return (
        <div className="DownloadLink">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Download here
          </a>
        </div>
      );

    const parts = charter.split(/&|,|\+|\//).map(x => x.trim());
    if (!parts.find(part => roles[part.toLowerCase()]))
      return (
        <div className="DownloadLink">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Download{" "}
            <b>
              {charter}'{charter.slice(-1) == "s" ? "" : "s"}
            </b>{" "}
            {isPack ? "pack" : "chart"}
          </a>
        </div>
      );

    return (
      <div className="Charter--roled">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Download{" "}
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
                      ? "Charter__charter--roled"
                      : "Charter__charter"
                  }
                  onMouseOver={() =>
                    roles[part.toLowerCase()] &&
                    this.setState({
                      roleText: roles[part.toLowerCase()],
                      partIndex: i
                    })
                  }
                >
                  <span className="Charter__charter-name">{part}</span>
                  {suffix}
                </span>
              );
            })}
            '{charter.slice(-1) == "s" ? "" : "s"}
          </b>{" "}
          {isPack ? "pack" : "chart"}
        </a>
        <div className="Charter__tooltip">{roleText}</div>
      </div>
    );
  }
}
