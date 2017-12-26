module.exports = {
  driveName: 'Angevil Hero IV',
  driveUrl: 'https://drive.google.com/drive/folders/1CHyvkuMdmTs3EbUwv2S4HL743wgBjK0P',
  charterName: 'Angevil',
  nameParser: name => {
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts) return { artist: 'N/A', song: name };
    const song = songParts.join(' - ').replace(/(\.\(chart\))?\.(zip|rar)$/, '');
    return { artist, song };
  }
};
