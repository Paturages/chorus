module.exports = {
  driveUrl: 'https://drive.google.com/drive/folders/0Bxt_bZMbHrqtRkk4LW90ZktXUGc',
  driveName: "Massacration - Gates of Metal Fried Chicken of Death",
  charterName: 'Naonemeu',
  nameParser: name => ({ artist: 'Massacration', name: name.split(' - ')[1].slice(0, -4) })
};
