const path = require('path');
const dotenv = require('dotenv');

// Explicitly load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ShopSphere Node.js + MySQL Backend is running smoothly!' });
});

// ----------------------------------------------------
// Products APIs
// ----------------------------------------------------
app.get('/api/products', async (req, res) => {
  const { category, search } = req.query;
  try {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND (category = ? OR category_id IN (SELECT id FROM categories WHERE name = ?))';
      params.push(category, category);
    }
    if (search) {
      sql += ' AND (name LIKE ? OR brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, brand, category, price, original_price, discount, image, description } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO products (name, brand, category, price, original_price, discount, image, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, category || 'Electronics', price, original_price || price, discount || 0, image, description]
    );
    res.status(201).json({ success: true, id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ----------------------------------------------------
// Categories API
// ----------------------------------------------------
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// ----------------------------------------------------
// Authentication APIs
// ----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name || 'Customer', email, password, role]
    );

    const user = { id: result.insertId, name: name || 'Customer', email, role };
    res.status(201).json({
      success: true,
      user,
      token: `token_${result.insertId}_${Date.now()}`
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      // Auto-create for friendly demo testing if not found
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const [insertRes] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [email.split('@')[0], email, password, role]
      );
      const user = { id: insertRes.insertId, name: email.split('@')[0], email, role };
      return res.json({ success: true, user, token: `token_${insertRes.insertId}_${Date.now()}` });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    delete user.password;
    res.json({
      success: true,
      user,
      token: `token_${user.id}_${Date.now()}`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ----------------------------------------------------
// Orders APIs
// ----------------------------------------------------
app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { userId, customerName, totalAmount, paymentMethod, shippingAddress, items } = req.body;
  try {
    const orderNumber = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
    const [orderResult] = await pool.query(
      `INSERT INTO orders (order_number, user_id, customer_name, total_amount, payment_method, shipping_address, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Processing')`,
      [orderNumber, userId || null, customerName || 'Ankit Patel', totalAmount, paymentMethod || 'upi', shippingAddress || 'Panipat, Haryana']
    );

    const orderId = orderResult.insertId;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, image)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, item.id || null, item.name, item.quantity || 1, item.price, item.image || '']
        );
      }
    }

    res.status(201).json({
      success: true,
      orderNumber,
      orderId,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ----------------------------------------------------
// Admin Dashboard Analytics API
// ----------------------------------------------------
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [[{ totalRevenue }]] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM orders');
    const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [recentOrders] = await pool.query('SELECT * FROM orders ORDER BY id DESC LIMIT 5');

    res.json({
      totalRevenue: Number(totalRevenue),
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 ShopSphere Node.js Backend is LIVE!`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`=================================================\n`);
});
