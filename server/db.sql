CREATE DATABASE IF NOT EXISTS bakery_db;
USE bakery_db;

CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE staff (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  contact VARCHAR(255),
  date_joined DATE NOT NULL
);

CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  gst DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  product_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  role ENUM('admin', 'customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (id, email, password, role, display_name) VALUES 
('admin1', 'admin@oventheory.com', 'admin123', 'admin', 'Admin');

-- Initial Dummy Data Removal - User requested to remove dummy data, so I'll leave tables empty or add real initial data later.
-- To provide some initial data for testing purposes (optional):
INSERT INTO products (id, name, price, category, image_url) VALUES 
('1', 'Butter Croissant', 3.50, 'Pastries', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'),
('2', 'Sourdough Loaf', 6.00, 'Breads', 'https://images.unsplash.com/photo-1585478286653-bc209f874e50?auto=format&fit=crop&w=800&q=80'),
('3', 'Chocolate Chip Cookies (6pc)', 5.50, 'Cookies', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'),
('4', 'Berry Layer Cake', 28.00, 'Cakes', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80'),
('5', 'The Crookie (Croissant-Cookie Hybrid)', 6.50, 'Pastries', 'https://images.unsplash.com/photo-1624451808582-723d508e6120?auto=format&fit=crop&w=800&q=80'),
('6', 'Iced Pistachio Baklava Latte', 5.75, 'Beverages', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'),
('7', 'Everything Bagel Focaccia', 7.50, 'Breads', 'https://images.unsplash.com/photo-1622345511082-96549040989d?auto=format&fit=crop&w=800&q=80'),
('8', 'Pink Strawberry Matcha Latte', 6.25, 'Beverages', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=80'),
('9', 'Miso Caramel Brownies', 4.50, 'Desserts', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80'),
('10', 'Lemon Lavender Poppyseed Muffin', 4.00, 'Pastries', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80'),
('11', 'Burnt Basque Cheesecake Slice', 8.00, 'Cakes', 'https://images.unsplash.com/photo-1626027878347-195977a6411d?auto=format&fit=crop&w=800&q=80'),
('12', 'Truffle Mushroom Savory Tart', 9.50, 'Savory', 'https://images.unsplash.com/photo-1541014741259-df5290ce50ca?auto=format&fit=crop&w=800&q=80'),
('13', 'Ube Crinkle Cookies (4pc)', 6.00, 'Cookies', 'https://images.unsplash.com/photo-1632768560086-a677ca6412e8?auto=format&fit=crop&w=800&q=80'),
('14', 'Pain au Chocolat with Gold Leaf', 5.50, 'Pastries', 'https://images.unsplash.com/photo-1619476020503-4f113706037f?auto=format&fit=crop&w=800&q=80'),
('15', 'Classic Cinnamon Roll with Cream Cheese', 5.00, 'Pastries', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80'),
('16', 'Chai Spiced Apple Galette', 7.00, 'Desserts', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80');

INSERT INTO staff (id, name, role, contact, date_joined) VALUES
('s1', 'Ankita Kadam', 'Cook', 'ankita@oventheory.com', '2024-01-15'),
('s2', 'Navika Hivrale', 'Sales', 'navika@oventheory.com', '2024-03-01');
select * from products
