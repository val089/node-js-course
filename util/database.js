const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost', // Replace with your database host
  user: 'root', // Replace with your MySQL username
  password: 'Baza123!', // Replace with your MySQL password
  database: 'node-complete' // Replace with your database name
  //   waitForConnections: true,
  //   connectionLimit: 10, // Maximum number of connections in the pool
  //   queueLimit: 0 // Unlimited queue length
});

module.exports = pool.promise();
