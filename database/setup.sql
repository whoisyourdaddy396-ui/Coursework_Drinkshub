-- Drinkshub Database Setup Script
-- Run this script to create the database and tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS drinkshub;
USE drinkshub;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  alcohol_content VARCHAR(50),
  volume VARCHAR(50),
  origin VARCHAR(255),
  image VARCHAR(255),
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  delivery_address TEXT NOT NULL,
  delivery_city VARCHAR(100),
  payment_method VARCHAR(50) DEFAULT 'cod',
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@drinkshub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample products
INSERT INTO products (name, category, price, description, alcohol_content, volume, origin, image, stock_quantity) VALUES
('Nepal Ice Beer', 'Beer', 180.00, 'Premium Nepali beer with smooth taste and refreshing finish.', '5%', '650ml', 'Nepal', '🍺', 100),
('Khukuri Rum', 'Rum', 850.00, 'Traditional Nepali rum with rich flavor and smooth finish.', '40%', '750ml', 'Nepal', '🥃', 50),
('Everest Vodka', 'Vodka', 1200.00, 'Premium vodka from the Himalayas. Clean, crisp, and smooth.', '40%', '750ml', 'Nepal', '🍸', 75),
('Gorkha Whiskey', 'Whiskey', 1500.00, 'Smooth Nepali whiskey with character and depth.', '43%', '750ml', 'Nepal', '🥃', 60),
('Carlsberg Beer', 'Beer', 220.00, 'International premium lager with crisp taste and golden color.', '5%', '500ml', 'Denmark', '🍺', 80),
('Tuborg Beer', 'Beer', 200.00, 'Refreshing Danish beer with balanced hop character.', '4.6%', '500ml', 'Denmark', '🍺', 90),
('Absolut Vodka', 'Vodka', 1800.00, 'Premium Swedish vodka with smooth, clean taste and subtle sweetness.', '40%', '750ml', 'Sweden', '🍸', 40),
('Jack Daniel\'s Whiskey', 'Whiskey', 2500.00, 'Tennessee whiskey with rich, smoky flavor and smooth finish.', '40%', '750ml', 'USA', '🥃', 30),
('Red Wine Merlot', 'Wine', 1200.00, 'Smooth red wine with notes of black cherry and plum.', '13.5%', '750ml', 'France', '🍷', 45),
('White Wine Chardonnay', 'Wine', 1100.00, 'Crisp white wine with citrus and apple notes.', '12.5%', '750ml', 'France', '🍷', 55),
('Bacardi Rum', 'Rum', 1400.00, 'Premium white rum with smooth, light taste and subtle vanilla notes.', '37.5%', '750ml', 'Puerto Rico', '🥃', 35),
('Heineken Beer', 'Beer', 240.00, 'Premium Dutch lager with balanced hop bitterness and clean finish.', '5%', '500ml', 'Netherlands', '🍺', 70)
ON DUPLICATE KEY UPDATE 
  price = VALUES(price),
  description = VALUES(description),
  stock_quantity = VALUES(stock_quantity);

-- Show tables
SHOW TABLES;

-- Show sample data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Orders' as table_name, COUNT(*) as count FROM orders; 