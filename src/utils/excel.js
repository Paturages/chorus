const Xlsx = require('xlsx');
const CSVParse = require('csv-parse');

const read = ({ name, data }) => {
  let csv;
  // Decode the file data
  if (name.slice(-4) === '.csv') {
    csv = data;
  } else {
    const workbook = Xlsx.read(data);
    csv = Xlsx.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
  }

  // Turn the csv into an array of arrays
  // First, try to parse with the default delimiter (',')
  // If it fails, try with the second most common (';')
  // Don't bother with other ones and just assume they're invalid files
  return new Promise((resolve, reject) => CSVParse(csv, (err, result) => {
    if (err) {
      return CSVParse(csv, { delimiter: ';' }, (err2, result2) => {
        if (err2) return reject(err2);
        return resolve(result2);
      });
    }
    return resolve(result);
  }));
};

module.exports = { read };
