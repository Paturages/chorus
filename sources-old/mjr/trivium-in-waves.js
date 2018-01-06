module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0Bxt_bZMbHrqtcWZaMmkzN2ptenM',
  driveName: "Trivium - In Waves (2011) (Full Album)",
  charterName: 'MJR',
  nameParser: name => {
    if (name.indexOf('.zip') < 0) return {};
    const [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'Trivium', song: name };
    const song = songParts.join(' - ').replace(/\.(.+)$/, '');
    return { artist, song };
  }
};
