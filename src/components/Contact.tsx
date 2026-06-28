import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enquiryType, setEnquiryType] = useState('catering');
  const [message, setMessage] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitSuccess(true);
    setName('');
    setEmail('');
    setMessage('');

    setTimeout(() => setIsSubmitSuccess(false), 3500);
  };

  const locatorDetails = [
    { title: 'The Flagship Bakehouse', address: '842 Baker Street, Gourmet District, San Francisco, CA 94102', phone: '(555) 124-9876' },
    { title: 'The Mission Cart', address: '129 Guerrero Street, Mission District, San Francisco, CA 94110', phone: '(555) 762-0912' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="contact-view">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Connect with Us</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
          Let’s Bake Something Sweet Together
        </h1>
        <p className="mt-3 font-sans text-xs sm:text-sm text-stone-500">
          Have an inquiry about wedding cake tastings, catering sourdough bundles for a local corporate lunch, or simply want to share your morning pastry feedback? We are all ears!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* CONTACT INFO (cols 5) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="rounded-3xl border border-stone-100 bg-stone-50/50 p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900">Our Bakehouses</h2>

            <div className="space-y-6 font-sans text-xs sm:text-sm">
              {locatorDetails.map((store, idx) => (
                <div key={idx} className="space-y-2 border-b border-stone-150 pb-5 last:border-b-0 last:pb-0">
                  <h3 className="font-serif font-bold text-stone-900 flex items-center space-x-1.5">
                    <MapPin size={15} className="text-orange-600 shrink-0" />
                    <span>{store.title}</span>
                  </h3>
                  <p className="text-stone-500 leading-relaxed pl-5">{store.address}</p>
                  <p className="text-stone-400 pl-5">Tel: <span className="font-mono text-stone-600 font-semibold">{store.phone}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Opening Hours Widget */}
          <div className="rounded-3xl border border-stone-100 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Clock size={18} className="text-orange-600" />
              <span>Visiting Hours</span>
            </h2>
            <ul className="space-y-2.5 font-sans text-xs text-stone-600">
              <li className="flex justify-between border-b border-stone-100 pb-1.5">
                <span>Monday - Friday</span>
                <span className="font-mono font-bold text-stone-900">7:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-100 pb-1.5">
                <span>Saturday</span>
                <span className="font-mono font-bold text-stone-900">8:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-100 pb-1.5">
                <span>Sunday</span>
                <span className="font-mono font-bold text-stone-900">8:00 AM - 2:00 PM</span>
              </li>
              <li className="text-orange-600 italic text-[10px] pt-1">
                * Note: Sourdough loaves come fresh and warm out of the brick oven daily at 7:30 AM & 1:00 PM.
              </li>
            </ul>
          </div>
        </div>

        {/* FEEDBACK FORM (cols 7) */}
        <div className="lg:col-span-7 rounded-3xl border border-stone-100 p-6 sm:p-8 bg-white shadow-sm relative">
          <AnimatePresence>
            {isSubmitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 rounded-3xl bg-white flex flex-col items-center justify-center p-6 text-center z-10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Message Dispatched!</h3>
                <p className="font-sans text-xs text-stone-500 max-w-sm mt-1">
                  Thank you for writing. Our pastry managers will read your inquiry and follow up within 24 working hours!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="font-serif text-lg font-bold text-stone-900 mb-6">Send Us a Direct Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Enquiry Type</label>
              <select
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white font-sans font-medium text-stone-700"
              >
                <option value="catering">Corporate Event Sourdough Catering</option>
                <option value="wedding">Custom Multi-Layer Wedding Cake Planning</option>
                <option value="allergy">Ingredient / Allergen Inquiries</option>
                <option value="feedback">General Bakery Feedback</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Your Message</label>
              <textarea
                required
                rows={5}
                placeholder="Type your questions or details here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-orange-500 bg-stone-50/50 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-full bg-stone-900 py-3.5 font-sans text-xs font-bold text-white hover:bg-orange-600 transition-colors cursor-pointer"
            >
              <Send size={13} />
              <span>Dispatch Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic Styled Map Placeholder */}
      <div className="mt-16 rounded-3xl overflow-hidden border border-stone-100 shadow-sm relative h-80 bg-stone-50">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 p-4 gap-2 opacity-15 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-stone-400 rounded-lg" />
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 shadow animate-pulse">
            <MapPin size={22} className="fill-orange-600/25" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-base font-bold text-stone-900">Interactive Map Looming</h3>
            <p className="font-sans text-xs text-stone-500 max-w-sm">
              We are located at **842 Baker Street, San Francisco, CA 94102**, directly opposite Gourmet Park. Parking is available in the cellar!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
