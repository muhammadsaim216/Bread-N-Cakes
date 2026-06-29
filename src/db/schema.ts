import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real, boolean } from 'drizzle-orm/pg-core';

// Users table (mapped via Firebase UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  loyaltyPoints: integer('loyalty_points').default(0).notNull(),
  role: text('role').default('customer').notNull(), // 'customer' | 'admin' | 'baker' | 'decorator'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Profiles table (user requested separate profiles table)
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  loyaltyPoints: integer('loyalty_points').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User Roles table (user requested separate user_roles table)
export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  role: text('role').default('customer').notNull(), // 'customer' | 'admin' | 'baker' | 'decorator'
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(), // e.g. 'cakes', 'breads', 'pastries', 'custom-orders'
  name: text('name').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  count: integer('count').default(0).notNull(),
});

// Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(), // e.g. '1', '2', etc.
  name: text('name').notNull(),
  category: text('category').references(() => categories.id).notNull(),
  price: real('price').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  image: text('image').notNull(),
  images: text('images').notNull(), // JSON string representation of string[]
  dietary: text('dietary').notNull(), // JSON string representation of string[]
  rating: real('rating').default(5.0).notNull(),
  reviewsCount: integer('reviews_count').default(0).notNull(),
  sizes: text('sizes').notNull(), // JSON string representation of string[]
  flavors: text('flavors'), // JSON string representation of string[]
  ingredients: text('ingredients').notNull(), // JSON string representation of string[]
  nutritionalInfo: text('nutritional_info').notNull(), // JSON string representation of object
  featured: boolean('featured').default(false).notNull(),
  bestSeller: boolean('best_seller').default(false).notNull(),
  isNew: boolean('is_new').default(false).notNull(),
});

// Gallery Items table
export const galleryItems = pgTable('gallery_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // e.g. 'wedding', 'birthday', 'daily'
  image: text('image').notNull(),
});

// Blog Posts table
export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  date: text('date').notNull(),
  readTime: text('read_time').notNull(),
  image: text('image').notNull(),
  category: text('category').notNull(),
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderIdString: text('order_id_string').notNull().unique(), // e.g., BNC-48902
  userId: integer('user_id').references(() => users.id),
  custName: text('cust_name').notNull(),
  custEmail: text('cust_email').notNull(),
  custPhone: text('cust_phone').notNull(),
  deliveryType: text('delivery_type').notNull(), // 'delivery' | 'pickup'
  street: text('street'),
  city: text('city'),
  zipCode: text('zip_code'),
  notes: text('notes'),
  paymentMethod: text('payment_method').default('Credit Card').notNull(),
  total: real('total').notNull(),
  status: text('status').notNull(), // 'Received' | 'Baking' | 'Decorating' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Order items table
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: text('product_id').notNull(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  size: text('size').notNull(),
  flavor: text('flavor'),
  image: text('image').notNull(),
});

// Reviews table
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: text('product_id').notNull(),
  userName: text('user_name').notNull(),
  avatar: text('avatar'),
  rating: integer('rating').notNull(),
  title: text('title').notNull(),
  comment: text('comment').notNull(),
  verified: boolean('verified').default(true).notNull(),
  likes: integer('likes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define Relationships
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.category],
    references: [categories.id],
  }),
}));

