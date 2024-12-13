const mysql = require('mysql2');

// Create a MySQL connection using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Use the host from environment variable
  user: process.env.DB_USER,       // Use the user from environment variable
  database: process.env.DB_NAME,   // Use the database name from environment variable
  password: process.env.DB_PASSWORD, // Use the password from environment variable
});

// Get a promise-based query interface
const promisePool = pool.promise();

// Export the promise pool
module.exports = promisePool;
