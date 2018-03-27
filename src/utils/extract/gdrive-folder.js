const Request = require('request');
const fs = require('fs');
const { promisify } = require('util');
const getMetaFromChart = require('../meta/chart');
const getMetaFromMidi = require('../meta/midi');
const getMetaFromIni = require('../meta/ini');
const download = url => new Promise((resolve, reject) =>
  Request.get(url, { encoding: null }, (err, res) => {
    if (err) reject(err);
    else resolve(res.body);
  })
);

module.exports = async ({ ini: iniItem, chart: chartItems = [], mid: midItems = [], audio, video, album }) => {
  if (
    !iniItem &&
    !chartItems.length &&
    !midItems.length
  ) return null;
  // Order of priority: "notes.chart" > files with "[Y]" in it > first one we can find
  const chartItem = chartItems.find(item => item.name == "notes.chart") ||
    chartItems.find(item => item.name.indexOf('[Y]') > -1) ||
    chartItems[0];
  // Order of priority: "notes.mid" > first one we can find
  const midItem = midItems.find(item => item.name == "notes.mid") || midItems[0];
  let ini, chart, mid;
  if (iniItem) ini = await download(iniItem.webContentLink);
  if (chartItem) chart = await download(chartItem.webContentLink);
  else if (midItem) mid = await download(midItem.webContentLink);
  const meta = {};
  if (ini) {
    Object.assign(meta, getMetaFromIni(ini));
    meta.lastModified = (await promisify(fs.stat)(ini)).mtime.toISOString().slice(0, 19);
  }
  if (chart) {
    Object.assign(meta, getMetaFromChart(chart));
    const mtime = (await promisify(fs.stat)(chart)).mtime.toISOString().slice(0, 19);
    if (!meta || meta.lastModified < mtime) meta.lastModified = mtime;
  } else if (mid) {
    Object.assign(meta, getMetaFromMidi(mid));
    const mtime = (await promisify(fs.stat)(mid)).mtime.toISOString().slice(0, 19);
    if (!meta || meta.lastModified < mtime) meta.lastModified = mtime;
  }
  // Store direct download links
  const directLinks = {};
  if (album) directLinks.album = album.webContentLink;
  if (iniItem) directLinks.ini = iniItem.webContentLink;
  if (chartItem) directLinks.chart = chartItem.webContentLink;
  if (midItem) directLinks.mid = midItem.webContentLink;
  if (video) directLinks.video = video.webContentLink;
  if (audio && audio.length) audio.forEach(file => Object.assign(directLinks, { [file.name]: file.webContentLink }));
  return Object.assign(meta, {
    hasVideo: !!video,
    hasStems: audio && audio.length > 1,
    directLinks
  });
};
