/*
  Example usage (variables between ${} are automatically parametrized) (npm install --save pg):
  const Db = require('./Db');
  const doStuff = async args => await Db.q`
    SELECT * FROM "${schemaId}"."Table"
    WHERE "id" = ${entity.id} AND "id" IN ${args.params}
  `;
  const doOtherStuff = async args => await Db.query(`
    INSERT INTO "Somewhere"
    VALUES
    (...)
  `, params);
  async () => {
    const results = await doStuff();
    const results2 = await doOtherStuff();
    res.json([results, results2]);
  }
*/

const Pg = require('pg');

let pgConfig;
if (process.env.NODE_ENV === 'production') {
  pgConfig = {
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    max: process.env.PG_MAX || 10,
    idleTimeoutMillis: process.env.PG_IDLE_TIMEOUT_MILLIS || 5000,
  };
} else {
  pgConfig = require('../../conf/pg.json');
}

const pool = new Pg.Pool(pgConfig);
Promise.race([
  new Promise((resolve, reject) => pool.on('error', err => reject(err))),
  new Promise((resolve, reject) => setTimeout(() => { reject('Connection timed out'); }, 5000)),
  pool.query('SELECT 1'),
])
.then(() => console.log('Postgres: Successfully initiated.'))
.catch(err => console.error('Postgres:', err.stack));

const query = (query, queryArgs) => {
  const dbErr = new Error('STACK');
  if (!pgConfig) return Promise.reject('No config');
  if (!pool) return Promise.reject('No pool');
  return Promise.race([
    new Promise((resolve, reject) => setTimeout(() => { reject('Connection timed out'); }, 5000)),
    pool.query(query, queryArgs).then(result => result.rows),
  ])
  .catch((err) => {
    throw new Error([
      '\nQUERY:', query.replace(/[\s\t\r\n ]+/gm, ' '),
      '\nPARAMS:', queryArgs,
      `\n${err.toString()}`,
      `\n${dbErr.stack}`,
    ].join(' '));
  });
}

const q = (queryArr, ...params) => {
  let queryIndex = 1;
  let queryArgs = [];
  const queryString = queryArr.map((part, index) => {
    // The last part is not followed by a parameter
    if (index === queryArr.length - 1) return part;
    // Special case: Table/column names are not parametrizable
    if (part.slice(-1) === '"') return `${part}${params[index]}`;
    // Unroll array of arrays into ($1, $2, $3), ($4, $5, $6), ...
    if (
      typeof params[index] === 'object' &&
      params[index].length &&
      typeof params[index][0] === 'object' &&
      params[index][0].length
    ) {
      params[index].forEach(row => row.forEach(x => queryArgs.push(x)));
      return `${part}${params[index].map(row => `(${row.map(x => `$${queryIndex++}`)})`).join(',')}`;
    }
    // Decompose arrays
    if (typeof params[index] === 'object' && params[index].length) {
      queryArgs = queryArgs.push(...params[index]);
      return `${part}${params[index].map(x => `$${queryIndex++}::${typeof x == 'string' ? 'text' : 'integer'}`)}`;
    }
    queryArgs.push(params[index]);
    return `${part}$${queryIndex++}`;
  }).join('');
  return query(queryString, queryArgs);
};

module.exports = { q, query };
