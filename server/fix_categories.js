
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bakery_db'
};

async function setup() {
    try {
        const pool = mysql.createPool(dbConfig);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Categories table created successfully');

        // Also check if we should add preliminary categories based on existing products
        const [products] = await pool.query('SELECT DISTINCT category FROM products');
        for (const p of products) {
            const id = (Math.random() * 1e16).toString(36);
            try {
                await pool.query('INSERT IGNORE INTO categories (id, name) VALUES (?, ?)', [id, p.category]);
            } catch (e) { }
        }
        console.log('Synchronized categories from existing products');

        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

setup();
