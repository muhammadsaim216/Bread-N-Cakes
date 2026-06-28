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
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
