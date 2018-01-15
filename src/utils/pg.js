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

const pgConfig = require('../../conf/pg.json');

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
    new Promise((resolve, reject) => setTimeout(() => { reject('Connection timed out'); }, 20000)),
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
    // Do not transform SQL segments
    // and replace $$ by proper indexes
    if (typeof params[index] === 'object' && typeof params[index].sql != 'undefined') {
      if (params[index].params && params[index].params.length) {
        params[index].sql = params[index].sql.replace(/\$\$/g, () => `$${queryIndex++}`);
        queryArgs.push(...params[index].params);
      }
      return `${part}${params[index].sql}`;
    }
    // Special case: Table/column names are not parametrizable
    if (part.slice(-1) === '"') return `${part}${params[index]}`;
    // Unroll array of arrays into ($1, $2, $3), ($4, $5, $6), ...
    if (
      typeof params[index] === 'object' &&
      params[index].length &&
      typeof params[index][0] === 'object' &&
      params[index][0].length
    ) {
      params[index].forEach(row => row.forEach(x => (!x || !x.sql || x.param) && queryArgs.push((x || {}).param || x)));
      return `${part}${params[index].map(row => `(${row.map(x => {
        if (!(x || {}).sql) return `$${queryIndex++}`;
        if (x.param) return x.sql.replace(/\$\$/, () => `$${queryIndex++}`);
        return x.sql;
      }).join(',')})`)}`;
    }
    // Decompose arrays
    if (typeof params[index] === 'object' && params[index].length) {
      queryArgs.push(...params[index]);
      return `${part}${params[index].map(x => `$${queryIndex++}`)}`;
    }
    queryArgs.push(params[index]);
    return `${part}$${queryIndex++}`;
  }).join('');
  return query(queryString, queryArgs);
};

module.exports = { q, query };
