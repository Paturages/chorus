const Fs = require('fs');
const Path = require('path');
const Readline = require('readline');
const Google = require('googleapis');
const Auth = require('google-auth-library');

const CLIENT = require('../../conf/client_id.json');

// Auth to Google APIs
const auth = new Auth();
const oAuth2 = new auth.OAuth2(CLIENT.web.client_id, CLIENT.web.client_secret, 'https://fightthe.pw');
let Drive;

const init = async () => {
  try {
    const token = require('../../conf/token.json');
    oAuth2.credentials = token;
  } catch (err) {
    try {
      // Get a new OAuth token if none found
      const authUrl = oAuth2.generateAuthUrl({ access_type: 'offline', scope: ['https://www.googleapis.com/auth/drive.metadata.readonly'] });
      const readline = Readline.createInterface({ input: process.stdin, output: process.stdout });
  
      console.log('Authorize this app by visiting', authUrl);
      const token = await new Promise((resolve, reject) => readline.question('and enter the code below:', input => {
        readline.close();
        oAuth2.getToken(input, (err, token) => {
          if (err) reject(err);
          Fs.writeFileSync(Path.resolve(__dirname, '..', '..', 'conf', 'token.json'), JSON.stringify(token));
          resolve(token);
        });
      }));
      oAuth2.credentials = token;
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
  } finally {
    console.log('Google Drive API initiated');
    Drive = Google.drive('v3');
    return Drive;
  }
};

// The quota for free users is 1000 queries / 100 seconds
// (i.e. 10 queries / second)
// We'll play it safe with a delay of 200 ms between requests
const queue = [];
let timeout;
const DELAY = 200;
const processQueue = () => {
  if (!queue.length) return timeout = null;
  const { method, args, callback } = queue.shift();
  timeout = setTimeout(() => processQueue(), DELAY);
  Drive.files[method](args, callback);
};
const throttle = (method, args, callback) => {
  queue.push({ method, args, callback });
  if (!timeout) timeout = setTimeout(() => processQueue(), DELAY);
};

const list = (args, files) => new Promise((resolve, reject) => throttle('list', Object.assign({
  auth: oAuth2,
  pageSize: 1000,
  fields: 'nextPageToken, files(id, name)'
}, args), async (err, payload) => {
  if (err) return reject(err);
  resolve(
    payload.nextPageToken ?
    (
      await get(
        Object.assign(args, { pageToken: payload.nextPageToken }),
        (files || []).concat(payload.files)
      )
    ) :
    (files || []).concat(payload.files)
  );
}));

const get = fileId => new Promise((resolve, reject) => throttle('get', { auth: oAuth2, fileId }, async (err, payload) => {
  if (err) return reject(err);
  resolve(payload);
}));

module.exports = { init, list, get };
