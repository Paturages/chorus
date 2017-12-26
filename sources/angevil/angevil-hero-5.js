module.exports = {
  driveName: 'Angevil Hero V',
  driveUrl: 'https://drive.google.com/drive/folders/15wyb6NACchW_n6mHFp5yA6i0wkP0mG-S',
  charterName: 'Angevil',
  nameParser: name => {
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/(\.\(chart\))?\.(zip|rar)$/, '');
    return { artist, song };
  }
};
