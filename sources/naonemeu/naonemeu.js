module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0Bxt_bZMbHrqtSlRaYVpDTWpjX2M',
  driveName: "Naonemeu's Cultural Exchange",
  charterName: 'Naonemeu',
  nameParser: name => {
    if (name.indexOf('.zip') < 0) return {};
    const [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/\.(.+)$/, '');
    return { artist, song };
  }
};
