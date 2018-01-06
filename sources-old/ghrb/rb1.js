module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/157_yhiX62k_QF8D_22cFrOoN-5Qck4Nt',
  driveName: 'Rock Band 1',
  charterName: 'Harmonix',
  nameParser: name => {
    name = name.slice(name.indexOf('.') + 2);
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts || !songParts.length) return { artist: 'N/A', song: name.replace(/\.(zip|rar)$/, '') };
    const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
    return { artist, song };
  }
}
