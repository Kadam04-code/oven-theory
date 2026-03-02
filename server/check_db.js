
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bakery_db'
};

async function check() {
    try {
        const pool = mysql.createPool(dbConfig);
        const [rows] = await pool.query("SHOW TABLES LIKE 'categories'");
        console.log('Categories table check:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
