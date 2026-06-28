import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, CreditCard, ArrowLeft, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { CartItem, PageType, Order } from '../types';
import { toast } from '../utils/toast';

interface CheckoutProps {
  cart: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  subtotal: number;
  discountPercentage: number;
  deliveryFee: number;
  tax: number;
  total: number;
  onClearCart: () => void;
  onAddOrder: (order: Order) => void;
  setActivePage: (page: PageType) => void;
  setOrderTrackingId: (id: string) => void;
  orderNote: string;
  user?: any;
}

export default function Checkout({
  cart,
  deliveryType,
  subtotal,
  discountPercentage,
  deliveryFee,
  tax,
  total,
  onClearCart,
  onAddOrder,
  setActivePage,
  setOrderTrackingId,
  orderNote,
  user,
}: CheckoutProps) {
  const [step, setStep] = useState<number>(1);

  // Form step 1: Shipping/Delivery
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // Form step 2: Payment
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      if (!custName || !custEmail || !custPhone) {
        toast.error('Please fill out all contact fields.');
        return;
      }
      if (deliveryType === 'delivery' && (!street || !city || !zip)) {
        toast.error('Please fill out all delivery address fields.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!cardName || !cardNumber || !cardExpiry || !cardCvc) {
      toast.error('Please fill out all mock credit card details.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `BNC-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderPayload = {
      orderIdString: orderId,
      custName,
      custEmail,
      custPhone,
      deliveryType,
      street: deliveryType === 'delivery' ? street : null,
      city: deliveryType === 'delivery' ? city : null,
      zipCode: deliveryType === 'delivery' ? zip : null,
      notes: orderNote || null,
      paymentMethod: `Visa ending in ${cardNumber.slice(-4) || '4242'}`,
      total,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        flavor: item.flavor || null,
        image: item.product.image,
      })),
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to save order to PostgreSQL.');
      }

      const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Received',
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          flavor: item.flavor,
          image: item.product.image,
        })),
        total: total,
        paymentMethod: `Visa ending in ${cardNumber.slice(-4) || '4242'}`,
        deliveryType: deliveryType,
        shippingAddress: deliveryType === 'delivery' ? {
          name: custName,
          street: street,
          city: city,
          zipCode: zip,
          phone: custPhone,
        } : undefined,
        trackingSteps: [
          { title: 'Order Received', description: 'Our team has accepted your baking ticket.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'complete' },
          { title: 'Baking', description: 'Our bakers are currently mixing, proofing, and baking fresh.', status: 'current' },
          { title: 'Decorating & Packing', description: 'Adding custom icing and packaging in sustainable boxes.', status: 'upcoming' },
          { title: 'Out for Delivery', description: 'Courier carrying warm treats directly to you.', status: 'upcoming' },
          { title: 'Delivered', description: 'Handed directly to you with a recipe journal.', status: 'upcoming' }
        ]
      };

      onAddOrder(newOrder);
      setOrderTrackingId(orderId);
      onClearCart();
      setIsSubmitting(false);
      setActivePage('order-tracking');
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while placing your order. Please retry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="checkout-view">
      {/* Checkout title */}
      <div className="text-center mb-10 max-w-xl mx-auto">
        <h1 className="font-serif text-3xl font-extrabold text-stone-900">Secure Bakehouse Checkout</h1>
        <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
          Only a couple of simple steps separate you from warm stone-oven treats. Complete details below.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="max-w-md mx-auto flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-100 z-0 -translate-y-1/2" />
        {[1, 2].map((s) => {
          const isDone = s < step;
          const isActive = s === step;
          return (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full font-sans text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-orange-600 text-white'
                    : isActive
                    ? 'bg-stone-900 text-white ring-4 ring-stone-100'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {isDone ? <Check size={14} /> : s}
              </div>
              <span className="mt-2 font-serif text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {s === 1 ? 'Information' : 'Payment'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
        {/* CHECKOUT STEP PANELS (cols 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-100 p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* STEP 1: CONTACT DETAILS & ADDRESS */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 font-sans text-xs"
              >
                <h2 className="font-serif text-lg font-bold text-stone-900">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-stone-700">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(555) 019-2834"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-4 pt-4 border-t border-stone-50">
                    <h2 className="font-serif text-lg font-bold text-stone-900">Local Delivery Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1 sm:col-span-3">
                        <label className="font-semibold text-stone-700">Street Address</label>
                        <input
                          type="text"
                          placeholder="e.g. 452 Elm Street, Apt 3B"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-stone-700">City</label>
                        <input
                          type="text"
                          placeholder="San Francisco"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-stone-700">ZIP / Postal Code</label>
                        <input
                          type="text"
                          placeholder="94102"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {deliveryType === 'pickup' && (
                  <div className="rounded-2xl bg-orange-50/30 p-4 border border-orange-100/50 text-stone-600 leading-relaxed">
                    <p className="font-serif font-bold text-orange-800">Ready for Store Pickup!</p>
                    <p className="mt-1 text-[11px]">
                      Your items will be baked and kept warm in our bakery drawers at **842 Baker Street, San Francisco, CA**. Pickup hours are from 7:30 AM to 6:00 PM daily. Just tell us your name when you arrive!
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-stone-100 flex justify-between">
                  <button
                    onClick={() => setActivePage('cart')}
                    className="inline-flex items-center space-x-1.5 font-sans text-xs font-bold text-stone-400 hover:text-stone-700"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to Cart</span>
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center space-x-1.5 rounded-full bg-stone-900 px-6 py-3 font-sans text-xs font-bold text-white hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* STEP 2: MOCK CREDIT CARD PAYMENT */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 font-sans text-xs"
              >
                <h2 className="font-serif text-lg font-bold text-stone-900">Credit Card Information</h2>

                {/* Golden Debit Card visual */}
                <div className="relative h-48 w-full rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden">
                  {/* Backdrop lights */}
                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/10 filter blur-2xl pointer-events-none" />
                  <div className="absolute left-0 bottom-0 h-28 w-28 rounded-full bg-amber-500/10 filter blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-center z-10">
                    <span className="font-serif font-extrabold italic text-sm tracking-tight">Bread N Cakes</span>
                    <CreditCard size={20} className="text-orange-500" />
                  </div>

                  <div className="space-y-1 z-10">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400">Card Number</span>
                    <p className="font-mono text-base tracking-[0.25em] font-semibold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center z-10">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-stone-400">Cardholder</span>
                      <p className="font-sans text-xs font-bold uppercase truncate max-w-[180px]">
                        {cardName || 'YOUR FULL NAME'}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-stone-400">Expires</span>
                      <p className="font-mono text-xs font-bold">{cardExpiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-stone-700">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-stone-700">Credit Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Expiration Date</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Security CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 flex items-start space-x-3 text-stone-500">
                  <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">
                    This is a **secure mock sandbox**. Your credit card number is processed entirely locally inside this safe browser instance and never transmitted to real servers.
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="inline-flex items-center space-x-1.5 font-sans text-xs font-bold text-stone-400 hover:text-stone-700"
                  >
                    <ArrowLeft size={13} />
                    <span>Back to Info</span>
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className={`inline-flex items-center justify-center space-x-2 rounded-full bg-orange-600 px-8 py-3.5 font-sans text-xs font-bold text-white shadow-lg shadow-orange-100 hover:bg-orange-500 transition-colors ${
                      isSubmitting ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span>{isSubmitting ? 'Baking Order Ticket...' : `Place Order $${total.toFixed(2)}`}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ORDER SUMMARY PANEL (cols 5) */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-100 bg-stone-50/50 p-6 sm:p-8 space-y-6">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Order Items</h2>

          {/* Items list list */}
          <div className="space-y-3.5 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center text-xs">
                <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-stone-950 truncate">{item.product.name}</p>
                  <p className="font-sans text-[10px] text-stone-500">
                    Qty: {item.quantity} • {item.size}
                  </p>
                </div>
                <span className="font-mono font-semibold text-stone-850">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="space-y-3 pt-4 border-t border-stone-150 font-sans text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono font-semibold text-stone-850">${subtotal.toFixed(2)}</span>
            </div>

            {discountPercentage > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount ({discountPercentage}%)</span>
                <span className="font-mono">-${((subtotal * discountPercentage) / 100).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>{deliveryType === 'delivery' ? 'Delivery Fee' : 'Store Pickup'}</span>
              <span className="font-mono font-semibold text-stone-850">
                {deliveryType === 'delivery' ? (deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'FREE') : 'FREE'}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Sales Tax (8.25%)</span>
              <span className="font-mono font-semibold text-stone-850">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-stone-900 pt-3 border-t border-stone-100">
              <span>Grand Total</span>
              <span className="font-mono text-base font-extrabold text-orange-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
