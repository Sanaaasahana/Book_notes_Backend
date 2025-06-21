const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    const sql = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
    const client = await pool.connect();
    try {
        console.log('Executing database setup script...');
        await client.query(sql);
        console.log('Database tables created successfully!');
    } catch (err) {
        console.error('Error executing database setup script:', err);
        process.exit(1); // Exit with error
    } finally {
        client.release();
        pool.end();
    }
}

setupDatabase(); 