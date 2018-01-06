module.exports = ini => ini.split('\n')
  .reduce((meta, line) => {
    let [param, value] = line.split('=');
    if (!value || !value.trim()) return meta;
    // Trim because of stupid Windows whitespace things
    param = param.trim();
    value = value.trim();
    return Object.assign(meta, { [param]: value });
  }, {});
