import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Heart } from 'lucide-react';
import { PageType } from '../types';

interface FooterProps {
  setActivePage: (page: PageType) => void;
}

export default function Footer({ setActivePage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300" id="app-footer">
      {/* Newsletter Panel */}
      <div className="border-b border-stone-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-3xl bg-gradient-to-br from-orange-600 to-amber-600 px-6 py-10 shadow-xl sm:px-12 lg:flex lg:items-center lg:p-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Join our Fresh Bake Club
              </h2>
              <p className="mt-3 max-w-3xl font-sans text-sm text-orange-50/90">
                Receive secret recipes, baking masterclasses, exclusive discounts, and alerts when new seasonal treats go active!
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <form className="sm:flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full rounded-full border-none bg-white/20 px-5 py-3 font-sans text-sm text-white placeholder-orange-100/70 outline-none backdrop-blur-md focus:bg-white focus:text-stone-900 focus:placeholder-stone-400 sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-3 font-sans text-sm font-bold text-white shadow hover:bg-stone-850 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white font-serif text-xl font-bold">
                B
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                Bread <span className="italic text-orange-500">N</span> Cakes
              </span>
            </div>
            <p className="font-sans text-xs text-stone-400 leading-relaxed">
              We bake delicious, rustic sourdough loaves and decadent celebration cakes by hand every single day using 100% natural, pasture-sourced, organic ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-orange-500 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-stone-400 hover:text-orange-500 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-stone-400 hover:text-orange-500 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: 'Fresh Menu / Shop', value: 'shop' as PageType },
                { label: 'Categories', value: 'categories' as PageType },
                { label: 'Event Gallery', value: 'gallery' as PageType },
                { label: 'Our Story & Heritage', value: 'about' as PageType },
                { label: 'Customer Testimonials', value: 'reviews' as PageType },
                { label: 'The Baking Blog', value: 'blog' as PageType },
              ].map((link) => (
                <li key={link.value}>
                  <button
                    onClick={() => setActivePage(link.value)}
                    className="font-sans text-xs text-stone-400 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Bakehouse Hours</h3>
            <ul className="mt-4 space-y-2.5 font-sans text-xs text-stone-400">
              <li className="flex justify-between border-b border-stone-800 pb-1.5">
                <span>Monday - Friday</span>
                <span className="text-white font-mono">7:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-800 pb-1.5">
                <span>Saturday</span>
                <span className="text-white font-mono">8:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-800 pb-1.5">
                <span>Sunday</span>
                <span className="text-white font-mono">8:00 AM - 2:00 PM</span>
              </li>
              <li className="text-stone-500 italic text-[11px]">
                * Fresh warm loaves coming out of the stone oven daily at 7:30 AM & 1:00 PM.
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Contact & Location</h3>
            <ul className="mt-4 space-y-3 font-sans text-xs text-stone-400">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <span>842 Baker Street, Gourmet District, San Francisco, CA 94102</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-orange-500 shrink-0" />
                <span className="font-mono">(555) 124-9876</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-orange-500 shrink-0" />
                <span className="font-mono">hello@breadncakes.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-stone-500">
          <p>© {currentYear} Bread N Cakes Bakery. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 flex items-center space-x-1">
            <span>Made with</span>
            <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" />
            <span>& flour, salt, and water in San Francisco.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
