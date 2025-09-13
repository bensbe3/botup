const mysql = require('mysql2/promise');

// Create connection pool with environment variables that are set in server.js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
    console.error('Please check your database settings in .env file or make sure MySQL server is running');
    // Don't exit process - let the server handle this gracefully
  }
};

// Run the test when this module is imported
testConnection();

// Export the connection pool
module.exports = pool;