module.exports = {
  driveName: "CaptainToasty's charts",
  driveUrl: 'https://drive.google.com/drive/folders/0B7sLCPWoM-w3aDVLdUV2YmZ5ejg',
  charterName: 'CaptainToasty',
  nameParser: name => {
    const [artist, song] = name.split('_');
    return { artist, song: song.slice(0, song.indexOf('.zip')) }
  }
};
