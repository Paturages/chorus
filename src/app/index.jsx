import Inferno from "inferno";

import Home from "pages/Home";
import Search from "pages/Search";

import "assets/fonts/roboto/regular.ttf";
import "assets/fonts/roboto/bold.ttf";

import "scss/global.scss";
import "scss/fonts.scss";

import "./index.html";

// Evil good ol' spying Google Analytics >:)
if (process.env.NODE_ENV === "production") {
  (function(i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    "script",
    "https://www.google-analytics.com/analytics_debug.js",
    "ga"
  );
  ga("create", "UA-112049887-1", "auto");
  ga("send", "pageview");
}

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
