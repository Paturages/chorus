module.exports = {
  driveName: "JaysonTM's hip-hop charts",
  driveUrl: 'https://drive.google.com/drive/u/0/folders/0B6v9d_hMqZXRR0s5YzJ2clBLSkU',
  charterName: 'JaysonTM',
  nameParser: name => {
    if (name.indexOf('-') < 0) return { artist: 'N/A', song: name };
    const [artist, song] = name.split(' - ');
    return { artist, song };
  }
};
