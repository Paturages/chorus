const fs = require('fs');
const glob = require('glob');
const path = require('path');
const drive = require('./src/drivers/google-drive');
const init = require('./src/utils/init');
const exit = require('./src/utils/exit');
const { checkIfSourceExistsInNew } = require('./src/utils/db');
const ls = (folder, pattern) => new Promise((resolve, reject) =>
  glob(pattern, {
    absolute: true,
    realpath: true,
    cwd: folder
  }, (err, res) => err ? reject(err) : resolve(res))
);

process.on('uncaughtException', err => {
  console.error('Uncaught exception!')
  console.error(err.stack);
});

process.on("unhandledRejection", (err, promise) => {
  console.error('Unhandled promise rejection!', promise);
  console.error(err.stack);
});

(async () => {
  await init();
  try {
    const sources = [
      fs.readFileSync(path.resolve(__dirname, 'sources', 'sources.txt'), 'utf8')
    ].join('\n')
      .split('\n')
      .map(line => {
        if (!line.trim() || line.trim()[0] == '#') return;
        const isSetlist = line[0] == "$";
        let hideSingleDownloads = false;
        if (isSetlist) {
          hideSingleDownloads = line[1] == '!';
          line = line.slice(hideSingleDownloads ? 3 : 2);
        }
        const [name, link, script] = line.split('::');
        if (!name || !link) return;
        return { name: name.trim(), link: link.trim(), script: (script || '').trim(), isSetlist, hideSingleDownloads };
      });
    const failed = [];
    for (let i = 0; i < sources.length; i++) {
      if (!sources[i]) continue;
      const proxy = sources[i].script && sources[i].script.indexOf('proxy:') > -1 ? sources[i].script.slice(
        sources[i].script.indexOf(':') + 1
      ) : null;
      if (
        !sources[i] ||
        (process.argv[2] && sources[i].name.toLowerCase().indexOf(process.argv[2].toLowerCase()) < 0) ||
        (process.env.RECOVER && (await checkIfSourceExistsInNew(proxy ? { link: proxy } : sources[i])))
      ) continue;
      try {
        if (sources[i].txt) await txt(sources[i].path);
        else if (sources[i].script) {
          if (proxy) await require(`./src/drivers/${
              sources[i].script.split('/', 1)[0]
            }`)(Object.assign(sources[i], { proxy }));
          else await require(`./src/drivers/${sources[i].script}`)(sources[i]);
        } else await drive(sources[i]);
      } catch (err) {
        console.error(err.stack);
        console.log(sources[i].name, 'failed!');
        failed.push(sources[i].name);
      }
    }
    console.log('Done!');
    if (failed.length) console.log(`The following imports failed:
    ${failed.join('\n    ')}`);
    await exit();
  } catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
})();
