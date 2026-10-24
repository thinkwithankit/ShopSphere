-- ShopSphere E-Commerce MySQL Database Schema

CREATE DATABASE IF NOT EXISTS shopsphere;
USE shopsphere;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'LayoutGrid'
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category_id INT,
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

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'upi',
  shipping_address TEXT NOT NULL,
  status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Processing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  quantity INT DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Initial Categories Seed
INSERT IGNORE INTO categories (id, name, icon) VALUES
(1, 'Electronics', 'Monitor'),
(2, 'Fashion', 'Shirt'),
(3, 'Home & Living', 'Home'),
(4, 'Beauty', 'Sparkles'),
(5, 'Sports', 'Dumbbell'),
(6, 'Books', 'BookOpen'),
(7, 'Toys', 'Gamepad2'),
(8, 'More', 'LayoutGrid');

-- Initial Products Seed
INSERT IGNORE INTO products (id, name, brand, category_id, price, original_price, discount, rating, reviews, image, description) VALUES
(1, 'iPhone 15 (128GB)', 'Apple', 1, 69999, 79900, 12, 4.8, 1234, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', 'The iPhone 15 features a stunning 6.1-inch Super Retina XDR display with Dynamic Island.'),
(2, 'Nike Running Shoes', 'Nike', 2, 4499, 6999, 36, 4.6, 856, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Lightweight and responsive Nike running shoes designed for comfort and speed.'),
(3, 'Wireless Headphones', 'Sony', 1, 8999, 13999, 31, 4.7, 932, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 'Premium wireless headphones with industry-leading noise cancellation.'),
(4, 'Smart Watch', 'boAt', 1, 3499, 5999, 42, 4.5, 1156, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 'Feature-packed smartwatch with AMOLED display and fitness tracking.');
