module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/111-eq6IdjKkvQXv0dkNsg_umsqMziPDU',
  driveName: 'bill wurtz',
  charterName: 'RobGHH',
  nameParser: name => (name.slice(-4) == '.ini' ? {} : { song: name, artist: 'bill wurtz' })
}
