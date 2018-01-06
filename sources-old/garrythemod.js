module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0By6Bhg7s6NEUUEhUdGZON3ZWYUE',
  driveName: "GarryTheMod's songs",
  charterName: 'GarryTheMod',
  nameParser: name => ({
    song: name.slice(0, -4), artist: 'GarryTheMod',
  })
}
