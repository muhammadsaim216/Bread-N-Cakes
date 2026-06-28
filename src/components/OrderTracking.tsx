import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Order, PageType } from '../types';

interface OrderTrackingProps {
  orderTrackingId: string | null;
  orders: Order[];
  setActivePage: (page: PageType) => void;
}

export default function OrderTracking({ orderTrackingId, orders, setActivePage }: OrderTrackingProps) {
  const [searchId, setSearchId] = useState(orderTrackingId || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!searchId) {
      setTrackedOrder(null);
      setErrorMsg(null);
      return;
    }

    const fetchTrackedOrder = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/orders/track/${searchId.trim()}`);
        if (res.ok) {
          const data = await res.json();
          setTrackedOrder(data.order);
        } else {
          // Fallback to local array
          const localMatch = orders.find(
            (o) => o.id.toUpperCase() === searchId.trim().toUpperCase()
          );
          if (localMatch) {
            setTrackedOrder(localMatch);
          } else {
            setTrackedOrder(null);
            setErrorMsg('No order ticket found matching this ticket number.');
          }
        }
      } catch (err) {
        console.error('Error fetching order tracking:', err);
        const localMatch = orders.find(
          (o) => o.id.toUpperCase() === searchId.trim().toUpperCase()
        );
        if (localMatch) {
          setTrackedOrder(localMatch);
        } else {
          setErrorMsg('Failed to connect to the tracking server.');
        }
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchTrackedOrder();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchId, orders]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8" id="order-tracking-view">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Live Baking Tracker</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
          Track Your Fresh Sourdough
        </h1>
        <p className="mt-2 font-sans text-xs sm:text-sm text-stone-500">
          Enter your order ticket number (e.g. BNC-48902 or your newly generated checkout ID) to view baking, decorating, and delivery status.
        </p>
      </div>

      {/* Tracker search bar */}
      <div className="bg-white rounded-3xl border border-stone-100 p-4 shadow-sm mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. BNC-48902 or your checkout ID)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pl-4 pr-12 font-mono text-xs sm:text-sm uppercase focus:border-orange-500 focus:bg-white focus:outline-none"
          />
          <Search size={18} className="absolute right-4 top-3.5 text-stone-400" />
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 font-sans text-stone-500 text-xs animate-pulse">
          Retrieving live bakehouse telemetry...
        </div>
      )}

      {/* TRACKING CONTENT */}
      {!loading && trackedOrder ? (
        <div className="space-y-8">
          {/* Order Header info */}
          <div className="rounded-3xl bg-stone-900 text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-widest">Order Ticket Found</span>
              <h2 className="font-serif text-2xl font-bold">{trackedOrder.id}</h2>
              <p className="font-sans text-xs text-stone-400">
                Placed on {trackedOrder.date} • Paid via {trackedOrder.paymentMethod}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-right">
              <span className="font-sans text-[10px] text-stone-300 block uppercase">Current State</span>
              <span className="font-serif text-base font-bold text-orange-400">{trackedOrder.status}</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white rounded-3xl border border-stone-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-50 pb-3">Fulfillment Journey</h3>
            <div className="relative pl-6 border-l border-stone-100 space-y-8">
              {trackedOrder.trackingSteps.map((step, idx) => {
                const isComplete = step.status === 'complete';
                const isCurrent = step.status === 'current';

                return (
                  <div key={idx} className="relative">
                    {/* Stepper node */}
                    <div
                      className={`absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                        isComplete
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-orange-600 animate-pulse'
                          : 'bg-stone-200'
                      }`}
                    >
                      {isComplete && <CheckCircle2 size={10} className="text-white fill-green-500" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-serif text-sm font-bold ${
                            isComplete || isCurrent ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.time && (
                          <span className="font-mono text-[10px] text-stone-400 flex items-center space-x-1">
                            <Clock size={10} />
                            <span>{step.time}</span>
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-stone-500 leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery destination card if available */}
          {trackedOrder.shippingAddress && (
            <div className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm flex items-start space-x-3 text-xs sm:text-sm">
              <MapPin size={18} className="text-orange-600 shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans">
                <h4 className="font-serif font-bold text-stone-900">Delivery Destination</h4>
                <p className="text-stone-700 font-semibold">{trackedOrder.shippingAddress.name}</p>
                <p className="text-stone-500">
                  {trackedOrder.shippingAddress.street}, {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.zipCode}
                </p>
                <p className="text-stone-400">Phone: {trackedOrder.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          {/* Live Kitchen Logs */}
          <div className="rounded-3xl border border-stone-100 bg-stone-50/50 p-6 shadow-sm">
            <h3 className="font-serif text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider">Live Bakehouse Telegraph</h3>
            <div className="rounded-2xl bg-stone-900 p-4 font-mono text-[11px] text-green-400 space-y-2 leading-relaxed">
              <p className="text-stone-400">[08:30 AM] - Order received. Grain weights validated.</p>
              <p className="text-stone-400">[09:00 AM] - Sourdough Gertrude starter feed cycle complete.</p>
              <p className="text-stone-400">[09:30 AM] - Autolyse stage active. Water-flour protein binding...</p>
              <p className="text-orange-400">[10:45 AM] - Sourdough shaped and scored. Entering stone-hearth oven deck 4.</p>
              <p className="animate-pulse">[SYSTEM] - Waiting for bake telemetry...</p>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-100 max-w-lg mx-auto">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-3">
              <AlertTriangle size={20} className="animate-bounce" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              {errorMsg || 'No active ticket tracked'}
            </h3>
            <p className="font-sans text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Ensure your order ticket begins with "BNC-" (e.g. Try searching **BNC-48902** which was pre-baked for demonstration, or complete checking out to get a live ticket).
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setSearchId('BNC-48902')}
                className="rounded-full bg-stone-900 px-5 py-2 font-sans text-xs font-bold text-white hover:bg-stone-800"
              >
                Demo Ticket BNC-48902
              </button>
              <button
                onClick={() => setActivePage('shop')}
                className="rounded-full border border-stone-200 px-5 py-2 font-sans text-xs font-bold text-stone-600 hover:border-orange-500 hover:text-orange-600 bg-white"
              >
                Place a New Order
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
