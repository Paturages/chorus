const Drive = require('./src/utils/drive');
const Pg = require("./src/utils/pg");
const getMetaFromChart = require('./src/utils/meta/chart');
const getMetaFromArchive = require('./src/utils/extract/archive');
const Request = require('request');
const prefixLength = "https://drive.google.com/uc?id=".length;
const download = (url, attempt) => new Promise((resolve, reject) =>
  Request.get(url, { encoding: null }, (err, res) => {
    if (err) return reject(err);
    // Bypass the download warning page if there's one
    // if (res.body.toString('utf8', 0, 15) == '<!DOCTYPE html>') {
    //   return Drive.get(url.slice(prefixLength, url.indexOf('&', prefixLength)))
    //     .then(body => resolve(body))
    //     .catch(err => console.error(err) || resolve(res.body));
    // }
    resolve(res.body);
  })
);

(async () => {
  const songs = await Pg.q`select * from "Songs" where "effectiveLength"::float / "length" < 0.75`;
  for (let song of songs) {
    let meta;
    if (song.directLinks.chart) {
      const chart = await download(song.directLinks.chart);
      meta = getMetaFromChart(chart);
    } else if (song.directLinks.archive) {
      const archive = await download(song.directLinks.archive);
      [meta] = await getMetaFromArchive(archive, "zip");
    } else continue;
    console.log(song.id, song.artist, song.name, meta.chartMeta);
    if (!meta.chartMeta || !meta.chartMeta.effectiveLength) continue;
    await Pg.q`update "Songs" set "effectiveLength" = ${meta.chartMeta.effectiveLength} where "id" = ${song.id}`;
  }
})();