const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '21259',
  database: process.env.DB_NAME || 'expense_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

module.exports = db;