module.exports = {
  driveName: "JaysonTM's Rock charts",
  driveUrl: 'https://drive.google.com/drive/u/0/folders/0B6v9d_hMqZXReDVkRkNma0VMb0U',
  charterName: 'JaysonTM',
  nameParser: name => {
    if (name.indexOf('-') < 0) return { artist: 'N/A', song: name };
    const [artist, song] = name.split(' - ');
    return { artist, song };
  }
};
