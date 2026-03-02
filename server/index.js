import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '../.env' }); // Load .env from root (local dev)
dotenv.config(); // Also try loading from current dir (Railway)

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection configuration (Railway + local compatible)
// Prioritize MYSQL_URL or MYSQLURL which is Railway's standard for full connection strings
const pool = process.env.MYSQL_URL || process.env.MYSQLURL
    ? mysql.createPool(process.env.MYSQL_URL || process.env.MYSQLURL)
    : mysql.createPool({
        host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
        port: process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
        database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'bakery_db'
    });

// Helper to handle DB errors
const tryQuery = async (query, params) => {
    try {
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (err) {
        console.error('DB Query Error:', err);
        throw err;
    }
};

// API Endpoints

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await tryQuery('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    const { id, name, price, category, image_url } = req.body;
    try {
        await tryQuery('INSERT INTO products (id, name, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [id, name, price, category, image_url]);
        res.json({ success: true, message: 'Product added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, image_url } = req.body;
    try {
        await tryQuery('UPDATE products SET name = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
            [name, price, category, image_url, id]);
        res.json({ success: true, message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await tryQuery('DELETE FROM products WHERE id = ?', [id]);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Staff
app.get('/api/staff', async (req, res) => {
    try {
        const staff = await tryQuery('SELECT * FROM staff');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/staff', async (req, res) => {
    const { id, name, role, contact, date_joined } = req.body;
    try {
        await tryQuery('INSERT INTO staff (id, name, role, contact, date_joined) VALUES (?, ?, ?, ?, ?)',
            [id, name, role, contact, date_joined]);
        res.json({ success: true, message: 'Staff member added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/staff/:id', async (req, res) => {
    const { id } = req.params;
    const { name, role, contact, date_joined } = req.body;
    try {
        await tryQuery('UPDATE staff SET name = ?, role = ?, contact = ?, date_joined = ? WHERE id = ?',
            [name, role, contact, date_joined, id]);
        res.json({ success: true, message: 'Staff member updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await tryQuery('DELETE FROM staff WHERE id = ?', [id]);
        res.json({ success: true, message: 'Staff member deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Orders
app.get('/api/orders', async (req, res) => {
    const { user_id } = req.query;
    try {
        let query = 'SELECT * FROM orders';
        let params = [];
        if (user_id) {
            query += ' WHERE user_id = ?';
            params.push(user_id);
        }
        query += ' ORDER BY created_at DESC';

        const orders = await tryQuery(query, params);

        // Fetch items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await tryQuery('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            return { ...order, items };
        }));

        res.json(ordersWithItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const { id, user_id, customer_email, customer_address, subtotal, gst, delivery_fee, total_price, payment_method, status, items } = req.body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await connection.query('INSERT INTO orders (id, user_id, customer_email, customer_address, subtotal, gst, delivery_fee, total_price, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, user_id, customer_email, customer_address, subtotal, gst, delivery_fee, total_price, payment_method, status]);

        for (const item of items) {
            await connection.query('INSERT INTO order_items (id, order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
                [crypto.randomUUID ? crypto.randomUUID() : (Math.random() * 1e16).toString(36), id, item.productId || null, item.name, item.price, item.quantity]);
        }

        await connection.commit();
        res.json({ success: true, message: 'Order placed' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.patch('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await tryQuery('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await tryQuery('SELECT * FROM categories ORDER BY name ASC');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    const { id, name } = req.body;
    try {
        await tryQuery('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name]);
        res.json({ success: true, message: 'Category added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await tryQuery('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth & User Management
app.get('/api/users', async (req, res) => {
    try {
        const users = await tryQuery('SELECT id, email, display_name, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { display_name, role } = req.body;
    try {
        await tryQuery('UPDATE users SET display_name = ?, role = ? WHERE id = ?',
            [display_name, role, id]);
        res.json({ success: true, message: 'User updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await tryQuery('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await tryQuery('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (users.length > 0) {
            const user = users[0];
            res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, display_name: user.display_name } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    const { id, email, password, display_name } = req.body;
    try {
        await tryQuery('INSERT INTO users (id, email, password, display_name, role) VALUES (?, ?, ?, ?, ?)',
            [id, email, password, display_name, 'customer']);
        res.json({ success: true, message: 'User signed up', user: { id, email, display_name, role: 'customer' } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Contact Messages
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        await tryQuery('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]);
        res.json({ success: true, message: 'Your message has been received! Our team will contact you shortly.' });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

app.get('/api/contact', async (req, res) => {
    try {
        const messages = await tryQuery('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/contact/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await tryQuery('DELETE FROM contact_messages WHERE id = ?', [id]);
        res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

