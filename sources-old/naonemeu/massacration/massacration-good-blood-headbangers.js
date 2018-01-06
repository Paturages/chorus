module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0Bxt_bZMbHrqtNkRVYmVEUGlfclE',
  driveName: "Massacration - Good Blood Headbangers",
  charterName: 'Naonemeu',
  nameParser: name => ({ artist: 'Massacration', song: name.split(' ').slice(1).join(' ').slice(0, -4) })
};
