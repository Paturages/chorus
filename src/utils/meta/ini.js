const Iconv = require('iconv-lite');
// To avoid people overwriting useful metadata
const fieldBlacklist = {
  link: true,
  source: true,
  lastModified: true
};

module.exports = ini => {
  try {
    const utf8 = Iconv.decode(ini, 'utf8');
    return (
      utf8.indexOf('�') >= 0 ?
        Iconv.decode(ini, 'latin-1') :
        utf8
    ).split('\n')
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
