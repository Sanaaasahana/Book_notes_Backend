const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Reads the connection string from environment variables
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('PostgreSQL connected successfully');
  client.release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 