import React, { useState, useMemo } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Ticket, FileText, CheckCircle2 } from 'lucide-react';
import { CartItem, PageType } from '../types';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size: string, flavor?: string) => void;
  onRemoveFromCart: (productId: string, size: string, flavor?: string) => void;
  setActivePage: (page: PageType) => void;
  setSelectedProductId: (id: string | null) => void;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  discountPercentage: number;
  setDiscountPercentage: (pct: number) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
}

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  setActivePage,
  setSelectedProductId,
  deliveryType,
  setDeliveryType,
  couponCode,
  setCouponCode,
  discountPercentage,
  setDiscountPercentage,
  orderNote,
  setOrderNote,
}: CartProps) {
  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const handleProductClick = (id: string) => {
    setSelectedProductId(id);
    setActivePage('product-details');
  };

  // Subtotal
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  // Discount
  const discountAmount = useMemo(() => {
    return (subtotal * discountPercentage) / 100;
  }, [subtotal, discountPercentage]);

  // Delivery fee
  const deliveryFee = useMemo(() => {
    if (deliveryType === 'pickup') return 0;
    return subtotal > 40 ? 0 : 5.00;
  }, [subtotal, deliveryType]);

  // Tax (8.25%)
  const tax = useMemo(() => {
    return (subtotal - discountAmount) * 0.0825;
  }, [subtotal, discountAmount]);

  // Total
  const total = useMemo(() => {
    return subtotal - discountAmount + deliveryFee + tax;
  }, [subtotal, discountAmount, deliveryFee, tax]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'FRESH10') {
      setDiscountPercentage(10);
      setCouponCode('FRESH10');
      setCouponMessage('FRESH10 promo applied successfully: 10% Off!');
    } else if (code === 'BREADLOVE') {
      setDiscountPercentage(15);
      setCouponCode('BREADLOVE');
      setCouponMessage('BREADLOVE promo applied successfully: 15% Off!');
    } else {
      setCouponMessage('Invalid coupon code. Try FRESH10 or BREADLOVE');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="cart-view">
      {/* Title */}
      <div className="border-b border-stone-100 pb-6 mb-10">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900">Your Baking Cart</h1>
        <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
          Review your delicious selections before checking out. All fresh baked items are packed carefully in eco-friendly packaging.
        </p>
      </div>

      {cart.length > 0 ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* CART ITEMS LIST (cols 7) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item, idx) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={`${item.product.id}-${item.size}-${item.flavor || ''}`}
                  className="flex items-center gap-4 rounded-3xl border border-stone-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  {/* Image */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onClick={() => handleProductClick(item.product.id)}
                    className="h-20 w-20 rounded-2xl object-cover shrink-0 cursor-pointer ring-1 ring-stone-100"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3
                      onClick={() => handleProductClick(item.product.id)}
                      className="font-serif text-sm font-bold text-stone-900 hover:text-orange-600 cursor-pointer truncate"
                    >
                      {item.product.name}
                    </h3>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[9px] text-stone-400 font-semibold uppercase">
                      <span>Size: {item.size}</span>
                      {item.flavor && <span>Flavor: {item.flavor}</span>}
                    </div>

                    <div className="flex items-center space-x-2 text-stone-400 font-sans text-xs pt-1">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-stone-200 rounded-full px-2 py-0.5 bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.size, item.flavor)}
                          className="font-bold text-stone-500 hover:text-stone-900 px-1"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-bold text-stone-800 px-2">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.size, item.flavor)}
                          className="font-bold text-stone-500 hover:text-stone-900 px-1"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-stone-300">|</span>
                      <span className="font-mono font-semibold text-stone-600">${item.product.price.toFixed(2)} each</span>
                    </div>
                  </div>

                  {/* Right side: total & delete */}
                  <div className="text-right flex flex-col items-end justify-between self-stretch">
                    <button
                      onClick={() => onRemoveFromCart(item.product.id, item.size, item.flavor)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                    <span className="font-mono text-sm font-bold text-stone-900">${itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}

            {/* Note and Delivery type selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              {/* Delivery type */}
              <div className="space-y-2 rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
                <span className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Fulfillment Method</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`rounded-xl py-2.5 font-sans text-xs font-semibold border transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-orange-500 bg-white text-orange-600 ring-2 ring-orange-50'
                        : 'border-stone-200 bg-transparent text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    Local Delivery
                  </button>
                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`rounded-xl py-2.5 font-sans text-xs font-semibold border transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-orange-500 bg-white text-orange-600 ring-2 ring-orange-50'
                        : 'border-stone-200 bg-transparent text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    Store Pickup
                  </button>
                </div>
                <p className="font-sans text-[10px] text-stone-400 italic leading-tight pt-1">
                  {deliveryType === 'delivery'
                    ? 'Contactless courier delivery within 15 miles. Free over $40!'
                    : 'Pick up warm at our stone oven starting from 7:30 AM.'}
                </p>
              </div>

              {/* Order note */}
              <div className="space-y-2 rounded-2xl border border-stone-100 bg-stone-50/40 p-4">
                <label className="flex items-center space-x-1.5 font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">
                  <FileText size={13} />
                  <span>Custom Baking Instructions</span>
                </label>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Please leave at the door, or add 'Happy Birthday Mark' on the chocolate cake..."
                  className="w-full rounded-xl border border-stone-200 bg-white p-2 text-xs focus:border-orange-500 focus:outline-none resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* SUMMARY SIDEBAR (cols 5) */}
          <div className="lg:col-span-5 rounded-3xl border border-stone-100 bg-stone-50/50 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Order Summary</h2>

            {/* Price lines */}
            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-stone-800">${subtotal.toFixed(2)}</span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Promo Code Discount ({discountPercentage}%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>{deliveryType === 'delivery' ? 'Delivery Fee' : 'Store Pickup'}</span>
                <span className="font-mono font-semibold text-stone-800">
                  {deliveryType === 'delivery'
                    ? deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'FREE'
                    : 'FREE'}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono font-semibold text-stone-800">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-4 border-t border-stone-100">
                <span>Grand Total</span>
                <span className="font-mono text-lg font-black text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-stone-100">
              <label className="flex items-center space-x-1 font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">
                <Ticket size={12} />
                <span>Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Try FRESH10 or BREADLOVE"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 font-mono text-xs uppercase outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-stone-900 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-stone-800"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`font-sans text-[10px] font-semibold ${discountPercentage > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMessage}
                </p>
              )}
            </form>

            {/* Checkout CTA */}
            <button
              onClick={() => setActivePage('checkout')}
              className="w-full flex items-center justify-center space-x-2 rounded-full bg-orange-600 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-orange-100 hover:bg-orange-500 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            {/* Back button */}
            <button
              onClick={() => setActivePage('shop')}
              className="w-full flex items-center justify-center space-x-1.5 font-sans text-xs font-bold text-stone-400 hover:text-stone-600 py-1"
            >
              <ArrowLeft size={12} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-100 max-w-lg mx-auto">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-4">
            <ShoppingBag size={26} className="animate-bounce" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">Your baking cart is empty</h2>
          <p className="font-sans text-xs text-stone-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Smells like something is missing. Explore our fresh daily breads, French butter pastries, and decadent layered celebration cakes to fill your box!
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="mt-6 inline-flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 font-sans text-xs font-bold text-white hover:bg-orange-600 transition-all"
          >
            <span>Browse Fresh Menu</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
