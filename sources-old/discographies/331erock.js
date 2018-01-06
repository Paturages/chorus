module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/1nS8e3XE-2eew57pzn0N648xeF4MPqiEo',
  driveName: '331ERock',
  nameParser: name => {
    let [artist, ...songParts] = name.split(' - ');
    if (!songParts || !songParts.length) return { artist: '331ERock', song: name.replace(/\.(zip|rar)$/, '') };
    const song = songParts.join(' - ').replace(/\.(zip|rar)$/, '');
    return { artist, song };
  }
}
