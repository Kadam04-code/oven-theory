import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '../.env' });

const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'bakery_db',
    port: process.env.MYSQLPORT || 3306
};

async function seed() {
    try {
        const pool = mysql.createPool(dbConfig);
        const categories = ['Breads', 'Pastries', 'Cakes', 'Cookies'];

        console.log('🌱 Seeding categories...');

        for (const name of categories) {
            const id = crypto.randomUUID ? crypto.randomUUID() : (Math.random() * 1e16).toString(36);
            await pool.query('INSERT IGNORE INTO categories (id, name) VALUES (?, ?)', [id, name]);
            console.log(`✅ Added category: ${name}`);
        }

        console.log('✨ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
