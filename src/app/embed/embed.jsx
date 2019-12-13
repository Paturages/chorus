import { Component, render } from 'inferno';

import Search from 'pages/Search';

import './index.html';
import './style.scss';

// Evil good ol' spying Google Analytics >:)
if (process.env.NODE_ENV === 'production' && !process.env.TESTING) {
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
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
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
  );
  ga('create', 'UA-112049887-1', 'auto');
  ga('send', 'pageview');
}

render(
  <div className="Embed">
    <Search location={window.location} pageName="" />
  </div>,
  document.getElementById('root')
);
