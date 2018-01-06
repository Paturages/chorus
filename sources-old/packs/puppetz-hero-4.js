module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/1Ah8PJL2URuaNu_uOu__LgaiJ7pnvk8uK',
  driveName: 'Puppetz Hero IV',
  nameParser: name => {
    if (['.png', '.ini'].indexOf(name.slice(-4)) > -1) return {};
    let [artist, ...songParts] = name.split(' - ');
    artist = artist.replace(/^\d+\.. /, '');
    if (!songParts || !songParts.length) return { artist: 'N/A', song: name.replace(/^\d+\.. /, '') };
    const song = songParts.join(' - ');
    return { artist, song };
  }
}
