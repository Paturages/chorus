module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/1haH5YEMCHMz8k_XGJtLJF-POLw77QOzL',
  driveName: 'Angevil Hero II (old FoF version)',
  charterName: 'Angevil',
  nameParser: name => {
    if (['.png', '.ini'].indexOf(name.slice(-4)) > -1) return {};
    let [artist, ...songParts] = name.split(' - ');
    artist = artist.replace(/^\d+\.(\d|E|F)+ /, '');
    if (!songParts || !songParts.length) return { artist: ARTIST || 'N/A', song: name };
    let song = songParts.join(' - ');
    return { artist, song };
  }
}
