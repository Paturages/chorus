module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0Bxt_bZMbHrqtcVkyTF9LUV9aZFU',
  driveName: "MJR's charts",
  charterName: 'MJR',
  nameParser: name => {
    if (name.indexOf('.rar') < 0) return {};
    const [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/\.(.+)$/, '');
    return { artist, song };
  }
};
