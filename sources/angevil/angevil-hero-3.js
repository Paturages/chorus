module.exports = {
  driveName: 'Angevil Hero III',
  driveUrl: 'https://drive.google.com/drive/folders/1Xcwem5doxLpNVrvgAuf2eWsWAODNfuY3',
  charterName: 'Angevil',
  nameParser: name => {
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/(\.\(chart\))?\.(zip|rar)$/, '');
    return { artist, song };
  }
};
