import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType, CartItem, Product, Order } from './types';
import { PRODUCTS, CATEGORIES, MOCK_ORDERS } from './data';
import { toast, ToastEventDetail } from './utils/toast';

// Component imports
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Shop from './components/Shop';
import Categories from './components/Categories';
import ProductDetails from './components/ProductDetails';
import About from './components/About';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import Contact from './components/Contact';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activePage, setActivePage] = useState<PageType>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>('1');
  const [orderTrackingId, setOrderTrackingId] = useState<string | null>('BNC-48902');

  const [dbProducts, setDbProducts] = useState<Product[]>(PRODUCTS);
  const [dbCategories, setDbCategories] = useState<typeof CATEGORIES>(CATEGORIES);

  useEffect(() => {
    async function fetchDbData() {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.products && prodData.products.length > 0) {
            setDbProducts(prodData.products);
          }
        }
      } catch (err) {
        console.error('Failed to fetch products from DB:', err);
      }

      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories && catData.categories.length > 0) {
            setDbCategories(catData.categories);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories from DB:', err);
      }
    }
    fetchDbData();
  }, []);

  // Toast notifications state
  interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastNotification = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      if (customEvent.detail) {
        const { message, type } = customEvent.detail;
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
      }
    };

    window.addEventListener('toast-notification', handleToastNotification as EventListener);
    return () => {
      window.removeEventListener('toast-notification', handleToastNotification as EventListener);
    };
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Cart and Wishlist states
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // pre-populate with sourdough
      quantity: 1,
      size: 'Standard Loaf (800g)',
      flavor: 'Classic Country',
    },
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[1], PRODUCTS[5]]);

  // User Session (Initialized as logged-in by default for excellent UX)
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
    loyaltyPoints: number;
    savedAddresses: {
      id: string;
      label: string;
      street: string;
      city: string;
      zipCode: string;
    }[];
  } | null>({
    name: 'Samantha Reyes',
    email: 'samantha.reyes@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    loyaltyPoints: 350,
    savedAddresses: [
      { id: 'addr-1', label: 'Home Address', street: '452 Elm Street, Apt 3B', city: 'San Francisco', zipCode: '94102' },
    ],
  });

  // Orders State (Prepopulated with mock data)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // Cart configuration states
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [orderNote, setOrderNote] = useState<string>('');

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, size: string, flavor?: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.size === size && item.flavor === flavor
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity, size, flavor }]);
    }
    triggerToast(`Successfully added ${quantity}x ${product.name} to your baking box!`, 'success');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, size: string, flavor?: string) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId, size, flavor);
      return;
    }
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.size === size && item.flavor === flavor) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updated);
  };

  const handleRemoveFromCart = (productId: string, size: string, flavor?: string) => {
    const itemToRemove = cart.find(
      (item) => item.product.id === productId && item.size === size && item.flavor === flavor
    );
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.size === size && item.flavor === flavor)
    );
    setCart(updated);
    if (itemToRemove) {
      triggerToast(`Removed ${itemToRemove.product.name} from your baking box.`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercentage(0);
    setOrderNote('');
    triggerToast('Baking box cleared.', 'info');
  };

  // Wishlist operations
  const handleAddToWishlist = (product: Product) => {
    const isSaved = wishlist.some((item) => item.id === product.id);
    if (isSaved) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      triggerToast(`Removed ${product.name} from your wishlist.`, 'info');
    } else {
      setWishlist([...wishlist, product]);
      triggerToast(`Saved ${product.name} to your sourdough wishlist!`, 'success');
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist(wishlist.filter((item) => item.id !== product.id));
    triggerToast(`Removed ${product.name} from your wishlist.`, 'info');
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    // Award loyalty points: 10 points for every $1 spent
    if (user) {
      const addedPoints = Math.round(newOrder.total * 10);
      setUser({
        ...user,
        loyaltyPoints: user.loyaltyPoints + addedPoints,
      });
      triggerToast(`Order placed successfully! Gained +${addedPoints} loyalty points.`, 'success');
    } else {
      triggerToast(`Order placed successfully!`, 'success');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLogin = (userData: typeof user) => {
    setUser(userData);
  };

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const deliveryFee = deliveryType === 'pickup' ? 0 : subtotal > 40 ? 0 : 5.0;
  const tax = (subtotal - discountAmount) * 0.0825;
  const grandTotal = subtotal - discountAmount + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-stone-50/30 flex flex-col justify-between selection:bg-orange-100 selection:text-orange-900 text-stone-850">
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        onLogout={handleLogout}
        setSelectedProductId={setSelectedProductId}
        setSelectedCategoryId={setSelectedCategoryId}
      />

      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activePage === 'home' && (
              <Home
                setActivePage={setActivePage}
                setSelectedProductId={setSelectedProductId}
                setSelectedCategoryId={setSelectedCategoryId}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                products={dbProducts}
                categories={dbCategories}
              />
            )}
            {activePage === 'shop' && (
              <Shop
                setActivePage={setActivePage}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                setSelectedProductId={setSelectedProductId}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                products={dbProducts}
                categories={dbCategories}
              />
            )}
            {activePage === 'categories' && (
              <Categories
                setActivePage={setActivePage}
                setSelectedCategoryId={setSelectedCategoryId}
                categories={dbCategories}
                products={dbProducts}
              />
            )}
            {activePage === 'product-details' && (
              <ProductDetails
                productId={selectedProductId}
                setActivePage={setActivePage}
                setSelectedProductId={setSelectedProductId}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                wishlist={wishlist}
                products={dbProducts}
              />
            )}
            {activePage === 'about' && <About />}
            {activePage === 'gallery' && <Gallery />}
            {activePage === 'reviews' && <Reviews />}
            {activePage === 'blog' && <Blog />}
            {activePage === 'faq' && <FAQ />}
            {activePage === 'wishlist' && (
              <Wishlist
                wishlist={wishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onAddToCart={handleAddToCart}
                setActivePage={setActivePage}
                setSelectedProductId={setSelectedProductId}
              />
            )}
            {activePage === 'cart' && (
              <Cart
                cart={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                setActivePage={setActivePage}
                setSelectedProductId={setSelectedProductId}
                deliveryType={deliveryType}
                setDeliveryType={setDeliveryType}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                discountPercentage={discountPercentage}
                setDiscountPercentage={setDiscountPercentage}
                orderNote={orderNote}
                setOrderNote={setOrderNote}
              />
            )}
            {activePage === 'checkout' && (
              <Checkout
                cart={cart}
                deliveryType={deliveryType}
                subtotal={subtotal}
                discountPercentage={discountPercentage}
                deliveryFee={deliveryFee}
                tax={tax}
                total={grandTotal}
                onClearCart={handleClearCart}
                onAddOrder={handleAddOrder}
                setActivePage={setActivePage}
                setOrderTrackingId={setOrderTrackingId}
                orderNote={orderNote}
                user={user}
              />
            )}
            {activePage === 'order-tracking' && (
              <OrderTracking
                orderTrackingId={orderTrackingId}
                orders={orders}
                setActivePage={setActivePage}
              />
            )}
            {activePage === 'contact' && <Contact />}
            {activePage === 'login' && <Auth onLogin={handleLogin} setActivePage={setActivePage} />}
            {activePage === 'register' && <Auth onLogin={handleLogin} setActivePage={setActivePage} />}
            {activePage === 'dashboard' && (
              <Dashboard
                user={user}
                orders={orders}
                onAddToCart={handleAddToCart}
                setActivePage={setActivePage}
                setOrderTrackingId={setOrderTrackingId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setActivePage={setActivePage} />

      {/* Toast notifications rendering */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100%-3rem)] sm:w-80 pointer-events-none" id="toasts-portal">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all ${
                t.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-100 text-emerald-800 shadow-emerald-100/30'
                  : t.type === 'error'
                  ? 'bg-rose-50/95 border-rose-100 text-rose-800 shadow-rose-100/30'
                  : 'bg-orange-50/95 border-orange-100 text-orange-800 shadow-orange-100/30'
              }`}
            >
              <div className="flex-1 font-sans text-xs font-semibold leading-relaxed">
                {t.message}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="text-stone-400 hover:text-stone-600 font-bold font-sans text-xs flex h-4 w-4 items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
