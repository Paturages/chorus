import Inferno from "inferno";

import Home from "pages/Home";
import Search from "pages/Search";

import "assets/fonts/roboto/regular.ttf";
import "assets/fonts/roboto/bold.ttf";

import "scss/global.scss";
import "scss/fonts.scss";

import "./index.html";

const queryParts = (window.location.search || "")
  .slice(1)
  .split("&")
  .map(x => {
    const [key, value] = x.split("=");
    return { key, value };
  });
const query = queryParts.find(x => x.key == "query") || {};

Inferno.render(
  window.location.pathname === "/" ? (
    <Home />
  ) : (
    <Search query={decodeURIComponent(query.value)} />
  ),
  document.getElementById("root")
);
