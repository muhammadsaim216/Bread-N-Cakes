import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, MapPin, ClipboardList, RefreshCw, FileDown, Plus, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Order, PageType, Product } from '../types';
import { PRODUCTS } from '../data';
import { toast } from '../utils/toast';

interface DashboardProps {
  user: {
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
  } | null;
  orders: Order[];
  onAddToCart: (product: Product, quantity: number, size: string, flavor?: string) => void;
  setActivePage: (page: PageType) => void;
  setOrderTrackingId: (id: string) => void;
}

export default function Dashboard({
  user,
  orders,
  onAddToCart,
  setActivePage,
  setOrderTrackingId,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses'>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);

  // If user is null, show a redirect or login callout
  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-3">
          <ClipboardList size={20} />
        </div>
        <h3 className="font-serif text-lg font-bold text-stone-900">Sign in to view your dashboard</h3>
        <p className="font-sans text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          Keep track of your loyalty points, order receipts, active baking timers, and saved shipping configurations.
        </p>
        <button
          onClick={() => setActivePage('login')}
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 font-sans text-xs font-bold text-white hover:bg-orange-600 transition-colors"
        >
          Access My Account
        </button>
      </div>
    );
  }

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const match = PRODUCTS.find((p) => p.id === item.productId);
      if (match) {
        onAddToCart(match, item.quantity, item.size, item.flavor);
      }
    });
    setActivePage('cart');
  };

  const handleTrackOrderClick = (id: string) => {
    setOrderTrackingId(id);
    setActivePage('order-tracking');
  };

  // Split orders into active vs historic
  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status !== 'Delivered');
  }, [orders]);

  const pastOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'Delivered');
  }, [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="dashboard-view">
      {/* Header bar with user profile */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-stone-100 pb-8 mb-10 text-center md:text-left">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
          alt={user.name}
          className="h-20 w-20 rounded-full object-cover ring-2 ring-orange-200 shadow"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-1.5 flex-1">
          <span className="font-mono text-[10px] font-bold text-orange-600 uppercase tracking-widest">Customer Club member</span>
          <h1 className="font-serif text-3xl font-extrabold text-stone-900">{user.name}</h1>
          <p className="font-sans text-xs text-stone-500">{user.email}</p>
        </div>

        {/* Loyalty points banner */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 p-5 text-white shadow-lg shadow-orange-100 flex items-center space-x-4 max-w-xs w-full">
          <Sparkles className="text-amber-300 animate-pulse shrink-0" size={24} />
          <div className="space-y-0.5">
            <span className="font-sans text-[10px] text-orange-100 block uppercase tracking-wider font-semibold">Your Loyalty Points</span>
            <span className="font-mono text-2xl font-black">{user.loyaltyPoints} Fresh Points</span>
            <p className="font-sans text-[9px] text-orange-100 leading-none pt-0.5">
              150 pts away from a FREE double chocolate pastry!
            </p>
          </div>
        </div>
      </div>

      {/* Main dashboard navigation tabs */}
      <div className="flex border-b border-stone-100 space-x-8 mb-8" id="dashboard-tabs">
        {[
          { id: 'overview', label: 'Bakehouse Overview' },
          { id: 'orders', label: `My Orders & History (${orders.length})` },
          { id: 'addresses', label: 'Saved Addresses' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative pb-4 font-sans text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'text-orange-600' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="dashboardTabLine" className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-600" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="py-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans text-xs sm:text-sm">
            {/* Left side: Active orders queue (cols 8) */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
                <RefreshCw size={16} className="text-orange-600 animate-spin" />
                <span>Active Baking Queue</span>
              </h2>

              {activeOrders.length > 0 ? (
                <div className="space-y-4">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-stone-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 font-mono text-[10px] font-bold">
                          <span className="text-stone-900">{order.id}</span>
                          <span className="text-stone-300">|</span>
                          <span className="text-orange-600">{order.status}</span>
                        </div>
                        <p className="font-serif font-bold text-sm text-stone-900">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                        <p className="font-sans text-[11px] text-stone-500">
                          Scheduled for {order.deliveryType === 'delivery' ? 'Local Courier' : 'In-Store Pickup'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleTrackOrderClick(order.id)}
                        className="rounded-full bg-stone-900 px-5 py-2.5 font-sans font-bold text-white text-xs hover:bg-orange-600 flex items-center justify-center space-x-1"
                      >
                        <span>Track Baker Timer</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-stone-50 rounded-3xl border border-stone-100">
                  <p className="font-serif font-bold text-stone-850 text-sm">No active orders cooking</p>
                  <p className="font-sans text-[11px] text-stone-500 mt-1">
                    Your bakers are currently clean. Explore our sourdough menus to trigger a ticket!
                  </p>
                </div>
              )}
            </div>

            {/* Right side: Loyalty Perks status (cols 4) */}
            <div className="lg:col-span-4 rounded-3xl border border-stone-100 bg-stone-50/50 p-6 space-y-4 text-xs">
              <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider">Bakehouse Perks</h3>
              <ul className="space-y-3.5">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-800">Free Daily Espresso</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Redeemable in-store before 10:00 AM daily.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-800">Birthday Treat Box</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Complimentary box of 4 almond croissants on your month.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-stone-800">Priority Sourdough Reservations</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Skip morning queues—reserve your country loaves 24 hrs early.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE PAST ORDERS & HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900">Your Baking History</h2>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isDelivered = order.status === 'Delivered';
                  return (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-stone-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Top metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-stone-400 font-bold border-b border-stone-50 pb-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-stone-900 text-xs font-black">{order.id}</span>
                          <span>•</span>
                          <span>{order.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full uppercase text-[9px] ${
                            isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        {/* Left: items images & details */}
                        <div className="flex-1 space-y-3">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex gap-3 items-center text-xs">
                              <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover ring-1 ring-stone-100" />
                              <div>
                                <p className="font-serif font-bold text-stone-900">{item.name}</p>
                                <p className="font-sans text-[10px] text-stone-500">
                                  Qty: {item.quantity} • {item.size} {item.flavor ? `• Flavor: ${item.flavor}` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Right: pricing & direct actions */}
                        <div className="text-right flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end gap-4 self-stretch border-t sm:border-t-0 border-stone-50 pt-4 sm:pt-0">
                          <div className="text-left sm:text-right font-sans text-xs">
                            <span className="text-stone-400 block">Total Paid</span>
                            <span className="font-mono text-sm font-extrabold text-stone-900">${order.total.toFixed(2)}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedReceipt(order)}
                              className="rounded-xl border border-stone-200 p-2.5 text-stone-500 hover:text-stone-850 hover:border-stone-400 transition-colors"
                              title="Download Receipt Invoice"
                            >
                              <FileDown size={14} />
                            </button>
                            <button
                              onClick={() => handleReorder(order)}
                              className="rounded-xl bg-orange-50 px-4 py-2 font-sans font-bold text-orange-600 text-xs hover:bg-orange-600 hover:text-white transition-all flex items-center gap-1.5"
                            >
                              <RefreshCw size={12} />
                              <span>Reorder items</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-100">
                <p className="font-serif font-bold text-stone-850">Your order index is clear</p>
                <p className="font-sans text-xs text-stone-500 mt-1">Explore our bakery shop to start buying.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-stone-900">Saved Shipping Profiles</h2>
              <button
                onClick={() => toast.info('New shipping address feature is a placeholder in this demo!')}
                className="inline-flex items-center space-x-1 rounded-full bg-stone-900 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-orange-600"
              >
                <Plus size={13} />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-3xl border-2 border-orange-100/60 bg-orange-50/10 p-5 shadow-sm space-y-2 relative font-sans text-xs"
                >
                  <div className="flex items-center space-x-1.5 text-orange-600">
                    <MapPin size={15} />
                    <span className="font-serif font-bold text-stone-900 text-sm">{addr.label}</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed pl-5">
                    {addr.street}, {addr.city}, {addr.zipCode}
                  </p>
                  <span className="absolute right-4 bottom-4 font-mono text-[9px] text-green-600 font-bold uppercase">
                    Primary Delivery Card
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL INVOICE */}
      <AnimatePresence>
        {selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReceipt(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-stone-900 border border-stone-100 font-mono text-xs relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedReceipt(null)}
                className="absolute right-4 top-4 rounded-full bg-stone-100 p-2 hover:bg-stone-200"
              >
                X
              </button>

              <div className="text-center space-y-1">
                <span className="font-serif text-lg font-black tracking-tight text-stone-900">Bread N Cakes</span>
                <p className="font-sans text-[9px] text-stone-400 uppercase tracking-widest">Artesian Sourdough & Confectionery</p>
                <p className="text-[10px] text-stone-500">842 Baker Street, San Francisco, CA</p>
              </div>

              <div className="border-t border-b border-dashed border-stone-300 py-3 space-y-1">
                <p>INVOICE NO: {selectedReceipt.id}</p>
                <p>DATE: {selectedReceipt.date}</p>
                <p>PAYMENT: {selectedReceipt.paymentMethod}</p>
                <p>FULFILLMENT: {selectedReceipt.deliveryType.toUpperCase()}</p>
              </div>

              {/* Items listing */}
              <div className="space-y-2 border-b border-dashed border-stone-300 pb-3">
                {selectedReceipt.items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>{item.quantity}x {item.name.slice(0, 20)}..</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-right">
                <p>SUBTOTAL: ${(selectedReceipt.total * 0.9).toFixed(2)}</p>
                <p>TAX (8.25%): ${(selectedReceipt.total * 0.0825).toFixed(2)}</p>
                <p className="font-black text-sm pt-2">GRAND TOTAL: ${selectedReceipt.total.toFixed(2)}</p>
              </div>

              <div className="text-center text-[10px] text-stone-400 font-sans italic pt-4">
                Thank you for your loyalty! Bakehouse dreams are rise slowly.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
