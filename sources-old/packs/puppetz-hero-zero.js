module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/1o6QeDc0CO9Kjb03BoEI8iiKpbK-oVoKK',
  driveName: 'Puppetz Hero Zero',
  nameParser: name => {
    if (['.png', '.ini', '.mid', '.ogg'].indexOf(name.slice(-4)) > -1) return {};
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts || !songParts.length) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ');
    return { artist, song };
  }
};
