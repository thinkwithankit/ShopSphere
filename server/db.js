const path = require('path');
const dotenv = require('dotenv');

// Explicitly load .env from the server folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mysql = require('mysql2/promise');

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shopsphere',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test connection
  pool.getConnection()
    .then(conn => {
      console.log('✅ Connected to MySQL Database "shopsphere" successfully!');
      conn.release();
    })
    .catch(err => {
      console.warn('⚠️  MySQL Database connection failed:', err.message);
    });
} catch (error) {
  console.warn('⚠️ MySQL pool initialization notice:', error.message);
}

module.exports = pool;
