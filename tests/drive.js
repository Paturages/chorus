const Drive = require('../src/utils/drive');

Drive.init()
.then(() =>
  Drive.get('1c2IbytYpFx9y35sqciHBOA4Ahzze1p7L')
)
.then(x => console.log(x));
