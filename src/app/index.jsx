import Inferno from "inferno";

import Home from "pages/Home";
import Search from "pages/Search";

import "assets/fonts/roboto/regular.ttf";
import "assets/fonts/roboto/bold.ttf";

import "scss/global.scss";
import "scss/fonts.scss";

import "./index.html";

// Evil good ol' spying Google Analytics >:)
if (process.env.NODE_ENV === 'production') {
  const remote = document.createElement('script');
  remote.async = true;
  remote.src = 'https://www.googletagmanager.com/gtag/js?id=UA-112049887-1';
  remote.type = 'text/javascript';
  (document.getElementsByTagName('HEAD')[0] || document.body).appendChild(remote);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'UA-112049887-1');
};

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
