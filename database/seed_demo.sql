-- ============================================================
-- Seed Demo Data
-- Adds a demo user, ensures categories, and adds 24 rich products
-- ============================================================

-- Create a standard user (Password: User@123)
INSERT INTO users (name, email, password_hash, role) VALUES
('Demo User', 'user@shopwave.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewORk3c7FNq6V.6m', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Categories (Using UPSERT just in case)
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Gadgets, devices, and tech accessories'),
('Clothing', 'clothing', 'Fashion and apparel for all'),
('Books', 'books', 'Books, eBooks, and educational material'),
('Home & Kitchen', 'home-kitchen', 'Everything for your home'),
('Sports', 'sports', 'Sports equipment and fitness gear')
ON CONFLICT (slug) DO NOTHING;

-- Products
WITH cats AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, compare_price, stock, category_id, image_url, images, rating, review_count, sku) VALUES
-- Electronics
('Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'Industry leading noise cancellation, 30 hour battery life, premium sound quality.', 29990.00, 34990.00, 50, (SELECT id FROM cats WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80', '[]', 4.8, 125, 'EL-HDP-001'),
('Apple MacBook Pro 14" M3', 'The most advanced Mac ever. Powerful M3 chip, stunning Liquid Retina XDR display.', 169900.00, 0, 15, (SELECT id FROM cats WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', '[]', 4.9, 432, 'EL-MBP-M3'),
('Samsung Odyssey G9 49" Gaming Monitor', 'Ultra-wide curved gaming monitor with 240Hz refresh rate and 1ms response time.', 135000.00, 150000.00, 8, (SELECT id FROM cats WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', '[]', 4.7, 89, 'EL-MON-G9'),
('Mechanical Keyboard Keychron K2', 'Compact 75% layout wireless mechanical keyboard with tactile switches.', 8500.00, 9999.00, 120, (SELECT id FROM cats WHERE slug = 'electronics'), 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', '[]', 4.6, 312, 'EL-KBD-K2'),

-- Clothing
('Premium Cotton Minimalist T-Shirt', 'Ultra-soft 100% organic cotton t-shirt with a perfectly tailored modern fit.', 1299.00, 1999.00, 500, (SELECT id FROM cats WHERE slug = 'clothing'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', '[]', 4.5, 410, 'CL-TSH-01'),
('Classic Denim Jacket', 'Timeless indigo denim jacket with authentic distressing and copper hardware.', 3499.00, 4999.00, 85, (SELECT id FROM cats WHERE slug = 'clothing'), 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80', '[]', 4.7, 120, 'CL-JKT-01'),
('Urban Cargo Pants', 'Street-ready cargo pants featuring durable ripstop fabric and multiple utility pockets.', 2599.00, 0, 150, (SELECT id FROM cats WHERE slug = 'clothing'), 'https://images.unsplash.com/photo-1624378439575-d1ead6bb2463?auto=format&fit=crop&w=800&q=80', '[]', 4.4, 88, 'CL-PNT-01'),
('Minimalist Leather Sneakers', 'Handcrafted from premium Italian leather. The ultimate versatile everyday shoe.', 5999.00, 7999.00, 60, (SELECT id FROM cats WHERE slug = 'clothing'), 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', '[]', 4.8, 201, 'CL-SNK-01'),

-- Books
('The Creative Act: A Way of Being', 'Rick Rubin explores the principles of creativity and how to tap into your true potential.', 1499.00, 1899.00, 200, (SELECT id FROM cats WHERE slug = 'books'), 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80', '[]', 4.9, 850, 'BK-ART-01'),
('Atomic Habits by James Clear', 'No matter your goals, Atomic Habits offers a proven framework for improving every day.', 699.00, 999.00, 500, (SELECT id FROM cats WHERE slug = 'books'), 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', '[]', 4.8, 4200, 'BK-SLF-01'),
('Dune by Frank Herbert', 'The epic science fiction masterpiece, now a major motion picture.', 599.00, 0, 300, (SELECT id FROM cats WHERE slug = 'books'), 'https://images.unsplash.com/photo-1614544048536-0d28caf77f41?auto=format&fit=crop&w=800&q=80', '[]', 4.7, 1500, 'BK-FIC-01'),
('Sapiens: A Brief History of Humankind', 'Explore how biology and history have defined us and enhanced our understanding of what it means to be human.', 750.00, 1200.00, 150, (SELECT id FROM cats WHERE slug = 'books'), 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', '[]', 4.8, 2300, 'BK-HIS-01'),

-- Home & Kitchen
('Vitamix Professional Series Blender', 'Commercial-grade blending power for your home kitchen. Perfect for smoothies, soups, and more.', 45000.00, 55000.00, 30, (SELECT id FROM cats WHERE slug = 'home-kitchen'), 'https://images.unsplash.com/photo-1585237405232-09c313a48eec?auto=format&fit=crop&w=800&q=80', '[]', 4.9, 532, 'HK-BLD-01'),
('Premium Cast Iron Skillet', 'Pre-seasoned 12-inch cast iron skillet. Provides excellent heat distribution and retention.', 3500.00, 4500.00, 100, (SELECT id FROM cats WHERE slug = 'home-kitchen'), 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', '[]', 4.8, 892, 'HK-SKL-01'),
('Ceramic Coffee Mug Set', 'Set of 4 artisan-crafted matte ceramic mugs. Minimalist design for your morning brew.', 1200.00, 0, 150, (SELECT id FROM cats WHERE slug = 'home-kitchen'), 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80', '[]', 4.6, 214, 'HK-MUG-04'),
('Organic Cotton Bed Sheets', 'Luxurious 400-thread count organic cotton bed sheet set. Breathable and incredibly soft.', 4500.00, 5999.00, 80, (SELECT id FROM cats WHERE slug = 'home-kitchen'), 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', '[]', 4.7, 345, 'HK-BED-01'),

-- Sports
('Pro Yoga Mat with Alignment Lines', 'Non-slip, eco-friendly PU yoga mat offering excellent grip and cushioning.', 2499.00, 3499.00, 200, (SELECT id FROM cats WHERE slug = 'sports'), 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80', '[]', 4.8, 412, 'SP-YGM-01'),
('Adjustable Dumbbell Set (up to 24kg)', 'Space-saving adjustable dumbbells. Change weights with a simple turn of a dial.', 18500.00, 25000.00, 40, (SELECT id FROM cats WHERE slug = 'sports'), 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80', '[]', 4.7, 189, 'SP-DMB-01'),
('Carbon Fiber Tennis Racket', 'Lightweight and powerful tournament-grade tennis racket designed for maximum control.', 14999.00, 18999.00, 60, (SELECT id FROM cats WHERE slug = 'sports'), 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80', '[]', 4.6, 75, 'SP-TNS-01'),
('Smart Fitness Tracker Watch', 'Track heart rate, sleep, steps, and over 50 workout modes with 14-day battery life.', 8999.00, 11999.00, 150, (SELECT id FROM cats WHERE slug = 'sports'), 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?auto=format&fit=crop&w=800&q=80', '[]', 4.5, 630, 'SP-WTCH-01');
