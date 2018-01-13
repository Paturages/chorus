const Request = require('request');
const getMetaFromChart = require('../meta/chart');
const getMetaFromMidi = require('../meta/midi');
const getMetaFromIni = require('../meta/ini');
const download = url => new Promise((resolve, reject) =>
  Request.get(url, { encoding: null }, (err, res) => {
    if (err) reject(err);
    else resolve(res.body);
  })
);

module.exports = async ({ ini: iniItem, chart: chartItem, mid: midItem, rhythm: rhythmItem, video: videoItem }) => {
  if (
    !iniItem &&
    !chartItem &&
    !midItem
  ) return null;
  let ini, chart, mid;
  if (iniItem) ini = await download(iniItem.webContentLink);
  if (chartItem) chart = await download(chartItem.webContentLink);
  else if (midItem) mid = await download(midItem.webContentLink);
  const meta = {};
  if (ini) Object.assign(meta, getMetaFromIni(ini));
  if (chart) Object.assign(meta, getMetaFromChart(chart));
  else if (mid) Object.assign(meta, getMetaFromMidi(mid));
  return Object.assign(meta, {
    hasVideo: !!videoItem,
    hasStems: !!rhythmItem,
  });
};
