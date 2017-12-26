module.exports = {
  driveName: 'Angevil Hero II',
  driveUrl: 'https://drive.google.com/drive/folders/1L1wrVYZX1l2VoyOZsikqA-e78ssuM-HV',
  charterName: 'Angevil',
  nameParser: name => {
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/(\.\(chart\))?\.(zip|rar)$/, '');
    return { artist, song };
  }
};
