module.exports = {
  driveName: "JaysonTM's Metal charts",
  driveUrl: 'https://drive.google.com/drive/u/0/folders/1EXgWm91m4bxSPup_3l1Sp9yDlMMfSdX5',
  charterName: 'JaysonTM',
  nameParser: name => {
    if (name.indexOf('-') < 0) return { artist: 'N/A', song: name };
    const [artist, song] = name.split(' - ');
    return { artist, song };
  }
};
