const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // FreeSQLDatabase host
  user: process.env.DB_USER,       // FreeSQLDatabase username
  password: process.env.DB_PASSWORD, // FreeSQLDatabase password
  database: process.env.DB_NAME,   // FreeSQLDatabase database name
});

const promisePool = pool.promise();

module.exports = promisePool;
