const Iconv = require('iconv-lite');
// To avoid people overwriting useful metadata
const fieldBlacklist = {
  link: true,
  source: true,
  lastModified: true
};

module.exports = ini => {
  try {
    let source = Iconv.decode(ini, 'utf8');
    // Windows Notepad default encoding
    if (source.indexOf('�') > -1) source = Iconv.decode(ini, 'latin-1');
    // Unicode encoding is used to actually display weird characters in CH
    if (source.indexOf('\u0000') > -1) source = Iconv.decode(ini, 'utf16');
    return source.split('\n')
    .reduce((meta, line) => {
      let [param, value] = line.split('=');
      if (!value || !value.trim() || fieldBlacklist[param]) return meta;
      // Trim because of stupid Windows whitespace things
      param = param.trim();
      value = value.trim();
      return Object.assign(meta, { [param]: value });
    }, {})
  } catch (err) {
    console.error(err.stack);
    return {};
  }
};
