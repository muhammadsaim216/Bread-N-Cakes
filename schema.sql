-- Bread & Cakes - PostgreSQL Database Schema
-- Compatible with Cloud SQL (PostgreSQL)
-- Includes Table Definitions, Indexes, and Row Level Security (RLS) policies

-- ============================================================================
-- 1. EXTENSIONS & SETUP
-- ============================================================================
-- Enable uuid-ossp extension in case UUIDs are needed later
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLE CREATION
-- ============================================================================

-- Users table (mapped via Firebase UID)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid TEXT NOT NULL UNIQUE, -- Firebase Auth UID
    email TEXT NOT NULL,
    name TEXT,
    avatar TEXT,
    loyalty_points INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id_string TEXT NOT NULL UNIQUE, -- e.g., BNC-48902
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    cust_name TEXT NOT NULL,
    cust_email TEXT NOT NULL,
    cust_phone TEXT NOT NULL,
    delivery_type TEXT NOT NULL, -- 'delivery' | 'pickup'
    street TEXT,
    city TEXT,
    zip_code TEXT,
    notes TEXT,
    payment_method TEXT DEFAULT 'Credit Card' NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL, -- 'Received' | 'Baking' | 'Decorating' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    size TEXT NOT NULL,
    flavor TEXT,
    image TEXT NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER NOT NULL,
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_id_string ON orders(order_id_string);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Note on RLS with Backend Connections:
-- Since the Node.js backend connects to Cloud SQL via a single database user, 
-- we use a session-level configuration variable `app.current_user_uid` to identify
-- the currently authenticated user in PostgreSQL.
-- The backend must run: SET LOCAL app.current_user_uid = 'firebase-uid-here';
-- in a transaction before executing user-specific operations.

-- ---- USERS TABLE POLICIES ----

-- 1. Users can read their own profile
CREATE POLICY user_read_own_profile ON users
    FOR SELECT
    USING (uid = current_setting('app.current_user_uid', true));

-- 2. Users can update their own profile
CREATE POLICY user_update_own_profile ON users
    FOR UPDATE
    USING (uid = current_setting('app.current_user_uid', true))
    WITH CHECK (uid = current_setting('app.current_user_uid', true));

-- 3. Backend service role (or Admin user) bypass/insert policies
-- Note: If you want the backend to be able to create new users during registration/sync:
CREATE POLICY backend_insert_users ON users
    FOR INSERT
    WITH CHECK (true); -- Backend validates registration logic

-- ---- ORDERS TABLE POLICIES ----

-- 1. Users can view their own orders
CREATE POLICY user_read_own_orders ON orders
    FOR SELECT
    USING (
        user_id = (SELECT id FROM users WHERE uid = current_setting('app.current_user_uid', true))
    );

-- 2. Anyone can look up a specific order by order_id_string for guest tracking
-- (Allows app/guest to view a specific order for tracking without auth)
CREATE POLICY public_track_order ON orders
    FOR SELECT
    USING (true);

-- 3. Anyone can insert an order (Guest checkout or logged-in users)
CREATE POLICY create_order ON orders
    FOR INSERT
    WITH CHECK (true);

-- ---- ORDER ITEMS TABLE POLICIES ----

-- 1. Users can view order items belonging to their own orders
CREATE POLICY user_read_own_order_items ON order_items
    FOR SELECT
    USING (
        order_id IN (
            SELECT o.id FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE u.uid = current_setting('app.current_user_uid', true)
        )
    );

-- 2. Anyone can view order items for guest tracking
CREATE POLICY public_read_order_items ON order_items
    FOR SELECT
    USING (true);

-- 3. Anyone can insert order items during checkout
CREATE POLICY create_order_items ON order_items
    FOR INSERT
    WITH CHECK (true);

-- ---- REVIEWS TABLE POLICIES ----

-- 1. Anyone can read reviews
CREATE POLICY public_read_reviews ON reviews
    FOR SELECT
    USING (true);

-- 2. Anyone can insert reviews
CREATE POLICY create_reviews ON reviews
    FOR INSERT
    WITH CHECK (true);
