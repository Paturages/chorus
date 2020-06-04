const Fs = require('fs');
const Path = require('path');
const Readline = require('readline');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const CLIENT = require('../../conf/client_id.json');

// Auth to Google APIs
const oAuth2 = new OAuth2Client(
  CLIENT.web.client_id,
  CLIENT.web.client_secret,
  'https://chorus.fightthe.pw'
);
let Drive;

const init = async () => {
  try {
    const token = require('../../conf/token.json');
    oAuth2.credentials = token;
  } catch (err) {
    try {
      // Get a new OAuth token if none found
      const authUrl = oAuth2.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/drive']
      });
      const readline = Readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      console.log('Authorize this app by visiting', authUrl);
      const token = await new Promise((resolve, reject) =>
        readline.question('and enter the code below:', input => {
          readline.close();
          oAuth2.getToken(input, (err, token) => {
            if (err) reject(err);
            Fs.writeFileSync(
              Path.resolve(__dirname, '..', '..', 'conf', 'token.json'),
              JSON.stringify(token)
            );
            resolve(token);
          });
        })
      );
      oAuth2.credentials = token;
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
  } finally {
    console.log('Google Drive API initiated');
    Drive = google.drive('v3');
    return Drive;
  }
};

// The quota for free users is 1000 queries / 100 seconds
// (i.e. 10 queries / second)
// We'll play it safe with a delay of 200 ms between requests
const queue = [];
let timeout;
const DELAY = 200;
const processQueue = async () => {
  if (!queue.length) return (timeout = null);
  const { method, args, callback, responseType } = queue.shift();
  timeout = setTimeout(() => processQueue(), DELAY);
  if (responseType == 'buffer') {
    try {
      const res = await Drive.files.get(args, {
        responseType: 'arraybuffer',
        onDownloadProgress: $event => process.env.CLI && console.log($event)
      });
      callback(null, res);
    } catch (err) {
      console.error(err.stack);
    }
  } else Drive.files[method](args, callback);
};
const throttle = (method, args, callback, responseType) => {
  queue.push({ method, args, callback, responseType });
  if (!timeout) timeout = setTimeout(() => processQueue(), DELAY);
};

const list = (args, files, retry) =>
  new Promise((resolve, reject) =>
    throttle(
      'list',
      Object.assign(
        {
          auth: oAuth2,
          pageSize: 1000,
          fields:
            'nextPageToken, files(id, name, mimeType, shortcutDetails, fileExtension, size, webContentLink, modifiedTime, webViewLink)'
        },
        args
      ),
      async (err, res) => {
        const { data: payload } = res || {};
        if (err) {
          // If Google Drive fails (e.g. 500 Internal Error),
          // try 5 more times before giving up and yielding nothing.
          // This should be rare enough, I hope.
          console.error(err.stack);
          console.log(`> Retry n°${(retry || 0) + 1}`);
          if (retry >= 5) return resolve(files || []);
          return resolve(await list(args, files, (retry || 0) + 1));
        }
        try {
          resolve(
            payload.nextPageToken
              ? await list(
                  Object.assign(args, { pageToken: payload.nextPageToken }),
                  (files || []).concat(payload.files)
                )
              : (files || []).concat(payload.files)
          );
        } catch (err) {
          console.error(err.stack);
          console.log(`> Retry n°${(retry || 0) + 1}`);
          if (retry >= 5) return resolve(files || []);
          return resolve(await list(args, files, (retry || 0) + 1));
        }
      }
    )
  );

const get = fileId =>
  new Promise((resolve, reject) =>
    throttle(
      'get',
      { auth: oAuth2, fileId, alt: 'media' },
      async (err, res) => {
        const { data: payload } = res || {};
        if (err) return reject(err);
        resolve(payload);
      },
      'buffer'
    )
  );

const info = fileId =>
  new Promise((resolve, reject) =>
    throttle(
      'get',
      {
        auth: oAuth2,
        fileId,
        fields:
          'id, name, mimeType, fileExtension, size, webContentLink, modifiedTime, webViewLink'
      },
      async (err, res) => {
        const { data: payload } = res || {};
        if (err) return reject(err);
        resolve(payload);
      }
    )
  );

module.exports = { init, list, get, info };
