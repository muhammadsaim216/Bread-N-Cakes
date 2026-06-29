import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { users, orders, orderItems, reviews, categories, products, galleryItems, blogPosts, profiles, userRoles } from './src/db/schema.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { eq, desc, inArray } from 'drizzle-orm';
import { adminAuth } from './src/lib/firebase-admin.ts';
import { CATEGORIES, PRODUCTS, GALLERY_ITEMS, BLOG_POSTS, REVIEWS } from './src/data.ts';

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // --- DATABASE AUTO-SEEDING ---
  async function seedDatabase() {
    try {
      // 1. Seed Categories
      const existingCategories = await db.select().from(categories);
      if (existingCategories.length === 0) {
        console.log('Seeding categories into PostgreSQL...');
        await db.insert(categories).values(
          CATEGORIES.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image: c.image,
            count: c.count,
          }))
        );
      }

      // 2. Seed Products
      const existingProducts = await db.select().from(products);
      if (existingProducts.length === 0) {
        console.log('Seeding products into PostgreSQL...');
        const productsToInsert = PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          description: p.description,
          longDescription: p.longDescription || null,
          image: p.image,
          images: JSON.stringify(p.images || []),
          dietary: JSON.stringify(p.dietary || []),
          rating: p.rating || 5.0,
          reviewsCount: p.reviewsCount || 0,
          sizes: JSON.stringify(p.sizes || []),
          flavors: JSON.stringify(p.flavors || []),
          ingredients: JSON.stringify(p.ingredients || []),
          nutritionalInfo: JSON.stringify(p.nutritionalInfo || {}),
          featured: p.featured || false,
          bestSeller: p.bestSeller || false,
          isNew: p.isNew || false,
        }));
        await db.insert(products).values(productsToInsert);
      }

      // 3. Seed Gallery Items
      const existingGallery = await db.select().from(galleryItems);
      if (existingGallery.length === 0) {
        console.log('Seeding gallery items into PostgreSQL...');
        await db.insert(galleryItems).values(
          GALLERY_ITEMS.map((g) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            image: g.image,
          }))
        );
      }

      // 4. Seed Blog Posts
      const existingBlogs = await db.select().from(blogPosts);
      if (existingBlogs.length === 0) {
        console.log('Seeding blog posts into PostgreSQL...');
        await db.insert(blogPosts).values(
          BLOG_POSTS.map((b) => ({
            id: b.id,
            title: b.title,
            excerpt: b.excerpt,
            content: b.content,
            author: b.author,
            date: b.date,
            readTime: b.readTime,
            image: b.image,
            category: b.category,
          }))
        );
      }

      // 5. Seed Reviews
      const existingReviews = await db.select().from(reviews);
      if (existingReviews.length === 0) {
        console.log('Seeding reviews into PostgreSQL...');
        const seedReviews = REVIEWS.map((r) => ({
          productId: r.productId || 'all',
          userName: r.author,
          avatar: r.avatar || null,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verified: r.verified !== undefined ? r.verified : true,
          likes: r.likes || 0,
        }));
        await db.insert(reviews).values(seedReviews);
      }

      console.log('Database auto-seeding check complete!');
    } catch (err) {
      console.error('Error during database auto-seeding:', err);
    }
  }

  // Run seeding
  await seedDatabase();

  // --- API ROUTES ---

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
  });

  // Get all categories from DB
  app.get('/api/categories', async (req, res) => {
    try {
      const results = await db.select().from(categories);
      res.json({ categories: results });
    } catch (error: any) {
      console.error('Error fetching categories from DB:', error);
      res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
    }
  });

  // Get all products from DB (with fields parsed back to JSON objects)
  app.get('/api/products', async (req, res) => {
    try {
      const results = await db.select().from(products);
      
      const parsedProducts = results.map((p) => ({
        ...p,
        images: JSON.parse(p.images),
        dietary: JSON.parse(p.dietary),
        sizes: JSON.parse(p.sizes),
        flavors: p.flavors ? JSON.parse(p.flavors) : [],
        ingredients: JSON.parse(p.ingredients),
        nutritionalInfo: JSON.parse(p.nutritionalInfo),
      }));

      res.json({ products: parsedProducts });
    } catch (error: any) {
      console.error('Error fetching products from DB:', error);
      res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
  });

  // Get all gallery items from DB
  app.get('/api/gallery', async (req, res) => {
    try {
      const results = await db.select().from(galleryItems);
      res.json({ gallery: results });
    } catch (error: any) {
      console.error('Error fetching gallery from DB:', error);
      res.status(500).json({ error: 'Failed to fetch gallery items', details: error.message });
    }
  });

  // Get all blog posts from DB
  app.get('/api/blogs', async (req, res) => {
    try {
      const results = await db.select().from(blogPosts);
      res.json({ blogs: results });
    } catch (error: any) {
      console.error('Error fetching blogs from DB:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message });
    }
  });

  // Update current user role (for testing purposes, allow direct update)
  app.post('/api/users/me/role', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { role } = req.body;
      if (!['customer', 'admin', 'baker', 'decorator'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const result = await db
        .update(users)
        .set({ role })
        .where(eq(users.uid, req.user.uid))
        .returning();

      // Upsert in userRoles table
      await db
        .insert(userRoles)
        .values({
          uid: req.user.uid,
          role: role,
        })
        .onConflictDoUpdate({
          target: userRoles.uid,
          set: {
            role: role,
          },
        });

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user: { ...result[0], role } });
    } catch (error: any) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
  });

  // Sync user profiles on login / registration
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: No token payload' });
      }

      const userUid = req.user.uid;
      const userEmail = req.user.email || '';
      const userName = req.body.name || req.user.name || '';
      const userAvatar = req.body.avatar || req.user.picture || '';
      const points = req.body.loyaltyPoints !== undefined ? req.body.loyaltyPoints : 0;

      // 1. Sync users table (backward-compatible)
      const result = await db
        .insert(users)
        .values({
          uid: userUid,
          email: userEmail,
          name: userName,
          avatar: userAvatar,
          loyaltyPoints: points,
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email: userEmail,
            name: userName,
            avatar: userAvatar,
          },
        })
        .returning();

      // 2. Sync profiles table
      await db
        .insert(profiles)
        .values({
          uid: userUid,
          email: userEmail,
          name: userName,
          avatar: userAvatar,
          loyaltyPoints: points,
        })
        .onConflictDoUpdate({
          target: profiles.uid,
          set: {
            email: userEmail,
            name: userName,
            avatar: userAvatar,
          },
        });

      // 3. Sync userRoles table
      await db
        .insert(userRoles)
        .values({
          uid: userUid,
          role: 'customer',
        })
        .onConflictDoNothing();

      const userRoleResult = await db.select().from(userRoles).where(eq(userRoles.uid, userUid)).limit(1);
      const userRole = userRoleResult.length > 0 ? userRoleResult[0].role : 'customer';

      res.json({ success: true, user: { ...result[0], role: userRole } });
    } catch (error: any) {
      console.error('Error in /api/users/sync:', error);
      res.status(500).json({ error: 'Database synchronization failed', details: error.message });
    }
  });

  // Get current user details and loyalty points
  app.get('/api/users/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Fetch from profiles
      const profileResult = await db.select().from(profiles).where(eq(profiles.uid, req.user.uid)).limit(1);
      // Fetch from userRoles
      const roleResult = await db.select().from(userRoles).where(eq(userRoles.uid, req.user.uid)).limit(1);

      const userRole = roleResult.length > 0 ? roleResult[0].role : 'customer';

      if (profileResult.length === 0) {
        // Fallback to legacy users table
        const result = await db.select().from(users).where(eq(users.uid, req.user.uid)).limit(1);
        if (result.length === 0) {
          return res.status(404).json({ error: 'User profile not synchronized' });
        }
        res.json({ user: result[0] });
        return;
      }

      res.json({
        user: {
          id: profileResult[0].id,
          uid: profileResult[0].uid,
          email: profileResult[0].email,
          name: profileResult[0].name,
          avatar: profileResult[0].avatar,
          loyaltyPoints: profileResult[0].loyaltyPoints,
          createdAt: profileResult[0].createdAt,
          role: userRole,
        },
      });
    } catch (error: any) {
      console.error('Error in /api/users/me:', error);
      res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
    }
  });

  // Award or deduct loyalty points
  app.post('/api/users/loyalty', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { points } = req.body;
      if (typeof points !== 'number') {
        return res.status(400).json({ error: 'Points must be a number' });
      }

      const result = await db
        .update(users)
        .set({ loyaltyPoints: points })
        .where(eq(users.uid, req.user.uid))
        .returning();

      // Also update profiles table
      await db
        .update(profiles)
        .set({ loyaltyPoints: points })
        .where(eq(profiles.uid, req.user.uid));

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, user: result[0] });
    } catch (error: any) {
      console.error('Error in /api/users/loyalty:', error);
      res.status(500).json({ error: 'Failed to update loyalty points', details: error.message });
    }
  });

  // Get logged-in user orders history
  app.get('/api/orders', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find user first
      const dbUser = await db.select().from(users).where(eq(users.uid, req.user.uid)).limit(1);
      if (dbUser.length === 0) {
        return res.json({ orders: [] });
      }

      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, dbUser[0].id))
        .orderBy(desc(orders.id));

      if (userOrders.length === 0) {
        return res.json({ orders: [] });
      }

      // Get items for these orders
      const orderIds = userOrders.map((o) => o.id);
      const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));

      // Group items under each order
      const ordersWithItems = userOrders.map((o) => {
        return {
          id: o.orderIdString,
          date: o.createdAt.toISOString().split('T')[0],
          status: o.status,
          deliveryType: o.deliveryType,
          total: o.total,
          paymentMethod: o.paymentMethod,
          shippingAddress: o.street ? {
            name: o.custName,
            street: o.street,
            city: o.city || '',
            zipCode: o.zipCode || '',
            phone: o.custPhone,
          } : undefined,
          items: items
            .filter((item) => item.orderId === o.id)
            .map((item) => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              flavor: item.flavor || undefined,
              image: item.image,
            })),
          trackingSteps: [
            { title: 'Received', description: 'Your order is recorded', status: 'complete' as const },
            { title: 'Baking', description: 'Freshly baking in active ovens', status: (o.status === 'Received' ? 'current' as const : 'complete' as const) },
            { title: 'Decorating', description: 'Applying rich chocolate & creams', status: (o.status === 'Baking' ? 'current' as const : o.status === 'Received' ? 'upcoming' as const : 'complete' as const) },
            { title: o.deliveryType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', description: o.deliveryType === 'pickup' ? 'Ready at store counter' : 'Dispatched with carrier', status: (['Received', 'Baking', 'Decorating'].includes(o.status) ? 'upcoming' as const : o.status === 'Delivered' ? 'complete' as const : 'current' as const) },
            { title: o.deliveryType === 'pickup' ? 'Picked Up' : 'Delivered', description: o.deliveryType === 'pickup' ? 'Enjoy your sourdough treats!' : 'Delivered straight to doorstep', status: (o.status === 'Delivered' ? 'complete' as const : 'upcoming' as const) }
          ]
        };
      });

      res.json({ orders: ordersWithItems });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to retrieve orders history', details: error.message });
    }
  });

  // Track a specific order by ID (unauthenticated/guest lookup)
  app.get('/api/orders/track/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const orderResults = await db.select().from(orders).where(eq(orders.orderIdString, orderId)).limit(1);
      
      if (orderResults.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const o = orderResults[0];
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));

      const responseOrder = {
        id: o.orderIdString,
        date: o.createdAt.toISOString().split('T')[0],
        status: o.status,
        deliveryType: o.deliveryType,
        total: o.total,
        paymentMethod: o.paymentMethod,
        shippingAddress: o.street ? {
          name: o.custName,
          street: o.street,
          city: o.city || '',
          zipCode: o.zipCode || '',
          phone: o.custPhone,
        } : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          flavor: item.flavor || undefined,
          image: item.image,
        })),
        trackingSteps: [
          { title: 'Received', description: 'Your order is recorded', status: 'complete' as const },
          { title: 'Baking', description: 'Freshly baking in active ovens', status: (o.status === 'Received' ? 'current' as const : 'complete' as const) },
          { title: 'Decorating', description: 'Applying rich chocolate & creams', status: (o.status === 'Baking' ? 'current' as const : o.status === 'Received' ? 'upcoming' as const : 'complete' as const) },
          { title: o.deliveryType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', description: o.deliveryType === 'pickup' ? 'Ready at store counter' : 'Dispatched with carrier', status: (['Received', 'Baking', 'Decorating'].includes(o.status) ? 'upcoming' as const : o.status === 'Delivered' ? 'complete' as const : 'current' as const) },
          { title: o.deliveryType === 'pickup' ? 'Picked Up' : 'Delivered', description: o.deliveryType === 'pickup' ? 'Enjoy your sourdough treats!' : 'Delivered straight to doorstep', status: (o.status === 'Delivered' ? 'complete' as const : 'upcoming' as const) }
        ]
      };

      res.json({ order: responseOrder });
    } catch (error: any) {
      console.error('Error tracking order:', error);
      res.status(500).json({ error: 'Failed to track order', details: error.message });
    }
  });

  // Place a new order
  app.post('/api/orders', async (req, res) => {
    try {
      const {
        orderIdString,
        custName,
        custEmail,
        custPhone,
        deliveryType,
        street,
        city,
        zipCode,
        notes,
        paymentMethod,
        total,
        items,
      } = req.body;

      if (!orderIdString || !custName || !custEmail || !custPhone || !items || !items.length) {
        return res.status(400).json({ error: 'Missing required order fields' });
      }

      // Check if user is authenticated (optional)
      let matchedUserId: number | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
          const decodedToken = await adminAuth.verifyIdToken(token);
          const dbUser = await db.select().from(users).where(eq(users.uid, decodedToken.uid)).limit(1);
          if (dbUser.length > 0) {
            matchedUserId = dbUser[0].id;
            
            // Increment user loyalty points on order completion: 10 points per dollar
            const addedPoints = Math.round(total * 10);
            await db
              .update(users)
              .set({ loyaltyPoints: dbUser[0].loyaltyPoints + addedPoints })
              .where(eq(users.id, dbUser[0].id));
          }
        } catch (err) {
          console.warn('Invalid token for order placement, ordering as guest:', err);
        }
      }

      // 1. Create Order
      const newOrderResult = await db
        .insert(orders)
        .values({
          orderIdString,
          userId: matchedUserId,
          custName,
          custEmail,
          custPhone,
          deliveryType,
          street: street || null,
          city: city || null,
          zipCode: zipCode || null,
          notes: notes || null,
          paymentMethod: paymentMethod || 'Credit Card',
          total,
          status: 'Received',
        })
        .returning();

      const createdOrder = newOrderResult[0];

      // 2. Insert Order Items
      const itemsToInsert = items.map((item: any) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        flavor: item.flavor || null,
        image: item.image,
      }));

      await db.insert(orderItems).values(itemsToInsert);

      res.json({ success: true, orderId: orderIdString });
    } catch (error: any) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to place order', details: error.message });
    }
  });

  // Get product reviews
  app.get('/api/reviews/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const results = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(desc(reviews.id));
      res.json({ reviews: results });
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
    }
  });

  // Get all reviews (with auto-seeding if empty)
  app.get('/api/reviews', async (req, res) => {
    try {
      let results = await db.select().from(reviews).orderBy(desc(reviews.id));
      if (results.length === 0) {
        // Seed default reviews
        const seedData = REVIEWS.map((r) => ({
          productId: r.productId || 'all',
          userName: r.author,
          avatar: r.avatar || null,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verified: r.verified !== undefined ? r.verified : true,
          likes: r.likes || 0,
        }));
        await db.insert(reviews).values(seedData);
        results = await db.select().from(reviews).orderBy(desc(reviews.id));
      }
      res.json({ reviews: results });
    } catch (error: any) {
      console.error('Error fetching all reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
    }
  });

  // Post a review
  app.post('/api/reviews', async (req, res) => {
    try {
      const { productId, userName, avatar, rating, title, comment } = req.body;
      if (!productId || !userName || !rating || !title || !comment) {
        return res.status(400).json({ error: 'Missing review fields' });
      }

      const results = await db
        .insert(reviews)
        .values({
          productId,
          userName,
          avatar: avatar || null,
          rating,
          title,
          comment,
          verified: true,
          likes: 0,
        })
        .returning();

      res.json({ success: true, review: results[0] });
    } catch (error: any) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Failed to post review', details: error.message });
    }
  });

  // --- VITE DEV / PRODUCTION STATIC BUILD SERVING ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bread N Cakes full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
