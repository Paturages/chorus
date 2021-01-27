const Drive = require('../drive');
const Request = require('request');
const getMetaFromChart = require('../meta/chart');
const getMetaFromMidi = require('../meta/midi');
const getMetaFromIni = require('../meta/ini');

const download = url =>
  new Promise(async (resolve, reject) => {
    const [, fileId] =
      url.match(/id=([^&]+)&?/) || url.match(/folders\/([^?]+)/) || [];

    if (!fileId) {
      Request.get(url, { encoding: null }, (err, res) => {
        if (err) return reject(err);
        // Bypass the download warning page if there's one
        if (res.body.toString('utf8', 0, 15) == '<!DOCTYPE html>') {
          return Drive.get(
            url.slice(prefixLength, url.indexOf('&', prefixLength))
          )
            .then(body => resolve(body))
            .catch(err => console.error(err) || resolve(res.body));
        }
        resolve(res.body);
      });
    } else {
      resolve(await Drive.get(fileId).catch(() => null));
    }
  });

module.exports = async ({ ini: iniItem, chart: chartItems = [], mid: midItems = [], audio, video, album, background = [] }) => {
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
  }
  if (chart) {
    Object.assign(meta, getMetaFromChart(chart));
  } else if (mid) {
    Object.assign(meta, getMetaFromMidi(mid));
  }
  // Store direct download links
  const directLinks = {};
  if (album) directLinks.album = album.webContentLink;
  if (iniItem) directLinks.ini = iniItem.webContentLink;
  if (chartItem) directLinks.chart = chartItem.webContentLink;
  if (midItem) directLinks.mid = midItem.webContentLink;
  if (video) directLinks.video = video.webContentLink;
  if (audio && audio.length) audio.forEach(file => Object.assign(directLinks, { [file.name]: file.webContentLink }));
  if (background && background.length) background.forEach(file => Object.assign(directLinks, { [file.name]: file.webContentLink }));
  return Object.assign(meta, {
    hasVideo: !!video,
    hasStems: audio && audio.filter(
      ({ name }) =>
        name.match(/^(guitar|bass|rhythm|drums_?.|vocals|keys|song)\.(ogg|mp3|wav)$/i)
    ).length > 1,
    hasNoAudio: !audio || !audio.length,
    hasBackground: background && background.length,
    needsRenaming: (chartItem && (chartItem.name || '').toLowerCase() != 'notes.chart') || (midItem && (midItem.name || '').toLowerCase() != 'notes.mid'),
    directLinks
  });
};
