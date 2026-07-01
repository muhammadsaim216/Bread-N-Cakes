import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { adminAuth, adminDb } from './src/lib/firebase-admin.ts';
import { REVIEWS } from './src/data.ts';

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // --- API ROUTES ---

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected' });
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

      const userRef = adminDb.collection('users').doc(userUid);
      const userDoc = await userRef.get();
      
      let user;
      if (userDoc.exists) {
        await userRef.update({
          email: userEmail,
          name: userName,
          avatar: userAvatar,
        });
        user = { uid: userUid, ...userDoc.data(), email: userEmail, name: userName, avatar: userAvatar };
      } else {
        user = {
          uid: userUid,
          email: userEmail,
          name: userName,
          avatar: userAvatar,
          loyaltyPoints: points,
        };
        await userRef.set(user);
      }

      res.json({ success: true, user });
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
      const userDoc = await adminDb.collection('users').doc(req.user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not synchronized' });
      }
      res.json({ user: userDoc.data() });
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

      const userRef = adminDb.collection('users').doc(req.user.uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      await userRef.update({ loyaltyPoints: points });
      res.json({ success: true, user: { ...userDoc.data(), loyaltyPoints: points } });
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

      const ordersSnapshot = await adminDb.collection('orders')
        .where('userId', '==', req.user.uid)
        .orderBy('createdAt', 'desc')
        .get();

      if (ordersSnapshot.empty) {
        return res.json({ orders: [] });
      }

      const userOrders = ordersSnapshot.docs.map(doc => {
        const o = doc.data();
        return {
          id: o.orderIdString,
          date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
          items: o.items || [],
          trackingSteps: [
            { title: 'Received', description: 'Your order is recorded', status: 'complete' as const },
            { title: 'Baking', description: 'Freshly baking in active ovens', status: (o.status === 'Received' ? 'current' as const : 'complete' as const) },
            { title: 'Decorating', description: 'Applying rich chocolate & creams', status: (o.status === 'Baking' ? 'current' as const : o.status === 'Received' ? 'upcoming' as const : 'complete' as const) },
            { title: o.deliveryType === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery', description: o.deliveryType === 'pickup' ? 'Ready at store counter' : 'Dispatched with carrier', status: (['Received', 'Baking', 'Decorating'].includes(o.status) ? 'upcoming' as const : o.status === 'Delivered' ? 'complete' as const : 'current' as const) },
            { title: o.deliveryType === 'pickup' ? 'Picked Up' : 'Delivered', description: o.deliveryType === 'pickup' ? 'Enjoy your sourdough treats!' : 'Delivered straight to doorstep', status: (o.status === 'Delivered' ? 'complete' as const : 'upcoming' as const) }
          ]
        };
      });

      res.json({ orders: userOrders });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to retrieve orders history', details: error.message });
    }
  });

  // Track a specific order by ID (unauthenticated/guest lookup)
  app.get('/api/orders/track/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const ordersSnapshot = await adminDb.collection('orders').where('orderIdString', '==', orderId).limit(1).get();
      
      if (ordersSnapshot.empty) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const o = ordersSnapshot.docs[0].data();

      const responseOrder = {
        id: o.orderIdString,
        date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
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
        items: o.items || [],
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

      let matchedUserId: string | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
          const decodedToken = await adminAuth.verifyIdToken(token);
          const userRef = adminDb.collection('users').doc(decodedToken.uid);
          const userDoc = await userRef.get();
          
          if (userDoc.exists) {
            matchedUserId = decodedToken.uid;
            const addedPoints = Math.round(total * 10);
            await userRef.update({
              loyaltyPoints: (userDoc.data()?.loyaltyPoints || 0) + addedPoints
            });
          }
        } catch (err) {
          console.warn('Invalid token for order placement, ordering as guest:', err);
        }
      }

      const orderData = {
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
        createdAt: Date.now(),
        items: items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          flavor: item.flavor || null,
          image: item.image,
        })),
      };

      await adminDb.collection('orders').add(orderData);

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
      const reviewsSnapshot = await adminDb.collection('reviews')
        .where('productId', '==', productId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ reviews });
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
    }
  });

  // Get all reviews (with auto-seeding if empty)
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviewsSnapshot = await adminDb.collection('reviews').orderBy('createdAt', 'desc').get();
      
      let reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (reviews.length === 0) {
        // Seed default reviews
        const batch = adminDb.batch();
        REVIEWS.forEach(r => {
          const docRef = adminDb.collection('reviews').doc();
          batch.set(docRef, {
            productId: r.productId || 'all',
            userName: r.author,
            avatar: r.avatar || null,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            verified: r.verified !== undefined ? r.verified : true,
            likes: r.likes || 0,
            createdAt: Date.now(),
          });
        });
        await batch.commit();

        const newReviewsSnapshot = await adminDb.collection('reviews').orderBy('createdAt', 'desc').get();
        reviews = newReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      res.json({ reviews });
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

      const reviewData = {
        productId,
        userName,
        avatar: avatar || null,
        rating,
        title,
        comment,
        verified: true,
        likes: 0,
        createdAt: Date.now(),
      };

      const docRef = await adminDb.collection('reviews').add(reviewData);

      res.json({ success: true, review: { id: docRef.id, ...reviewData } });
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
