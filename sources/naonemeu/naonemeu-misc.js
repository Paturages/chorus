module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0Bxt_bZMbHrqtaUpEZHpsR25rSVE',
  driveName: "Naonemeu's Miscellaneous",
  charterName: 'Naonemeu',
  nameParser: name => {
    // ...gotta respect wishes!
    if (name.indexOf('DO NOT DOWNLOAD') > -1) return {};
    const [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/\.(.+)$/, '');
    return { artist, song };
  }
};
