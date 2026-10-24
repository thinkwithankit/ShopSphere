const path = require('path');
const dotenv = require('dotenv');

// Explicitly load .env from the server folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mysql = require('mysql2/promise');

async function initDatabase() {
  console.log('🔄 Initializing ShopSphere MySQL Database...');
  console.log(`Connecting with user "${process.env.DB_USER}" to host "${process.env.DB_HOST}"...`);
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    // 1. Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS shopsphere;');
    console.log('✅ Database "shopsphere" ensured');

    await connection.query('USE shopsphere;');

    // 2. Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT 'LayoutGrid'
      );

      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100),
        category_id INT,
        category VARCHAR(100) DEFAULT 'Electronics',
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2),
        discount INT DEFAULT 0,
        rating DECIMAL(2, 1) DEFAULT 4.5,
        reviews INT DEFAULT 0,
        image VARCHAR(500),
        description TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE,
        user_id INT,
        customer_name VARCHAR(100),
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'upi',
        shipping_address TEXT NOT NULL,
        status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT,
        product_name VARCHAR(255),
        quantity INT DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(500),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      );
    `);
    console.log('✅ All tables verified & created');

    // 3. Seed initial categories
    await connection.query(`
      INSERT IGNORE INTO categories (id, name, icon) VALUES
      (1, 'Electronics', 'Monitor'),
      (2, 'Fashion', 'Shirt'),
      (3, 'Home & Living', 'Home'),
      (4, 'Beauty', 'Sparkles'),
      (5, 'Sports', 'Dumbbell'),
      (6, 'Books', 'BookOpen'),
      (7, 'Toys', 'Gamepad2'),
      (8, 'More', 'LayoutGrid');
    `);

    // 4. Seed initial products
    await connection.query(`
      INSERT IGNORE INTO products (id, name, brand, category_id, category, price, original_price, discount, rating, reviews, image, description) VALUES
      (1, 'iPhone 15 (128GB)', 'Apple', 1, 'Electronics', 69999, 79900, 12, 4.8, 1234, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', 'The iPhone 15 features a stunning 6.1-inch Super Retina XDR display with Dynamic Island.'),
      (2, 'Nike Running Shoes', 'Nike', 2, 'Fashion', 4499, 6999, 36, 4.6, 856, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Lightweight and responsive Nike running shoes designed for comfort and speed.'),
      (3, 'Wireless Headphones', 'Sony', 1, 'Electronics', 8999, 13999, 31, 4.7, 932, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'Premium wireless headphones with industry-leading noise cancellation.'),
      (4, 'Smart Watch', 'boAt', 1, 'Electronics', 3499, 5999, 42, 4.5, 1156, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'Feature-packed smartwatch with AMOLED display and fitness tracking.'),
      (5, 'MacBook Air M2', 'Apple', 1, 'Electronics', 99999, 119900, 17, 4.9, 2341, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 'The incredibly thin MacBook Air with M2 chip.'),
      (6, 'Leather Crossbody Bag', 'Hidesign', 2, 'Fashion', 3299, 5499, 40, 4.4, 445, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 'Genuine leather crossbody bag with adjustable strap.'),
      (7, 'Ceramic Dinner Set', 'Clay Craft', 3, 'Home & Living', 2499, 3999, 38, 4.3, 312, 'https://images.unsplash.com/photo-1603199506016-5d54afc4fbd0?w=400&h=400&fit=crop', 'Elegant 21-piece ceramic dinner set with floral patterns.'),
      (8, 'Yoga Mat Premium', 'Boldfit', 5, 'Sports', 999, 1999, 50, 4.6, 678, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', 'Extra thick 6mm yoga mat with anti-slip surface.');
    `);

    // 5. Seed default admin and user
    await connection.query(`
      INSERT IGNORE INTO users (id, name, email, password, role) VALUES
      (1, 'Admin ShopSphere', 'admin@shopsphere.com', 'admin123', 'admin'),
      (2, 'Ankit Patel', 'ankit@example.com', 'user123', 'user');
    `);

    // 6. Seed sample orders
    await connection.query(`
      INSERT IGNORE INTO orders (id, order_number, user_id, customer_name, total_amount, payment_method, shipping_address, status) VALUES
      (1, '#ORD-1001', 2, 'Ankit Patel', 69999, 'upi', '123, Green Park, Panipat, Haryana - 132103', 'Delivered'),
      (2, '#ORD-1002', 2, 'Ankit Patel', 4499, 'card', '123, Green Park, Panipat, Haryana - 132103', 'Delivered'),
      (3, '#ORD-1003', 2, 'Ankit Patel', 8999, 'upi', '123, Green Park, Panipat, Haryana - 132103', 'Shipped');
    `);

    console.log('✅ Seed data inserted successfully');
    console.log('🚀 ShopSphere MySQL Database setup complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
