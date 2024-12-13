// lib/db.js
const mysql = require('mysql2');

// Create a MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'school_management', // Replace with your database name
  password: 'Kay@1234', // Replace with your actual password
});

// Get a promise-based query interface
const promisePool = pool.promise();

// Export the promise pool
module.exports = promisePool;
