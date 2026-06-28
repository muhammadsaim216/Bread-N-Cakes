import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown, LogOut, Sparkles, Clock } from 'lucide-react';
import { PageType, UserSession } from '../types';
import { PRODUCTS } from '../data';

interface HeaderProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  cartCount: number;
  wishlistCount: number;
  user: UserSession['user'];
  onLogout: () => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
}

export default function Header({
  activePage,
  setActivePage,
  cartCount,
  wishlistCount,
  user,
  onLogout,
  setSelectedProductId,
  setSelectedCategoryId,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Tracks scroll to update navbar visual styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: 'Home', value: 'home' as PageType },
    { label: 'Shop', value: 'shop' as PageType },
    { label: 'Categories', value: 'categories' as PageType },
    { label: 'Gallery', value: 'gallery' as PageType },
    { label: 'Reviews', value: 'reviews' as PageType },
    { label: 'Blog', value: 'blog' as PageType },
    { label: 'About', value: 'about' as PageType },
    { label: 'Contact', value: 'contact' as PageType },
  ];

  // Filter products for suggestions
  const searchSuggestions = searchQuery
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSuggestionClick = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('shop');
      setIsSearchFocused(false);
    }
  };

  const navigateToPage = (page: PageType) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <div className="w-full" id="header-container">
      {/* Premium Announcement Bar / Baking Ticker */}
      <div className="bg-stone-950 text-[10px] sm:text-[11px] text-stone-300 py-2.5 px-4 font-sans font-medium tracking-widest uppercase text-center border-b border-stone-900 z-50 relative">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-stone-300 font-semibold">Live Artisanal Ovens Active</span>
          </div>
          <p className="font-sans font-semibold tracking-wide text-orange-100 hidden md:block">
            🥐 FREE DELIVERY on standard orders above $55 • Use code <span className="text-orange-400 font-bold bg-white/10 px-1.5 py-0.5 rounded">BAKE10</span> for 10% Off
          </p>
          <div className="flex items-center gap-1 text-stone-300 mx-auto sm:mx-0 font-semibold">
            <Clock size={12} className="text-orange-400 animate-pulse" />
            <span>Next Bread Batch: 11 mins</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-stone-100/80 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.015)]'
            : 'bg-white/95 border-b border-orange-50 py-4.5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Handcrafted Brand Crest & Logo */}
          <div
            onClick={() => navigateToPage('home')}
            className="flex cursor-pointer items-center space-x-3 group"
            id="header-logo"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-100/50 ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all duration-300"
            >
              <span className="font-serif text-2xl font-black italic tracking-tighter">B</span>
            </motion.div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-extrabold tracking-tight text-stone-900 block leading-tight group-hover:text-orange-600 transition-colors">
                Bread <span className="italic text-orange-600 font-medium">N</span> Cakes
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 font-bold block mt-0.5">
                Artisanal Patisserie
              </span>
            </div>
          </div>

          {/* Desktop Luxury Rounded Navigation Bar */}
          <nav className="hidden md:flex items-center bg-stone-100/60 p-1.5 rounded-full border border-stone-200/40 shadow-inner" id="desktop-nav">
            {navigationItems.map((item) => {
              const isActive = activePage === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => navigateToPage(item.value)}
                  className={`relative px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                    isActive ? 'text-orange-600' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Dynamic Interactive Action Elements */}
          <div className="flex items-center space-x-3">
            {/* Smooth Expanding Search Bar */}
            <div
              className={`relative hidden lg:block transition-all duration-300 ${
                isSearchFocused || searchQuery ? 'w-64' : 'w-44'
              }`}
              id="desktop-search"
            >
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search sourdough, pastries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full rounded-full border border-stone-200/80 bg-stone-50/50 py-2 pl-4 pr-10 font-sans text-xs transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 placeholder-stone-400 font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-2.5 text-stone-400 hover:text-orange-600 transition-colors"
                >
                  <Search size={14} />
                </button>
              </form>

              {/* Suggestions Dropdown Card */}
              <AnimatePresence>
                {isSearchFocused && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-stone-100 bg-white/95 backdrop-blur-md p-2 shadow-2xl shadow-stone-200/60 ring-1 ring-black/5"
                  >
                    <div className="px-3 py-1.5 border-b border-stone-50 flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest">Suggestions</span>
                      <span className="font-mono text-[9px] text-orange-500 font-semibold">{searchSuggestions.length} found</span>
                    </div>
                    <div className="mt-1 space-y-0.5 max-h-64 overflow-y-auto">
                      {searchSuggestions.length > 0 ? (
                        searchSuggestions.map((product) => (
                          <button
                            key={product.id}
                            onMouseDown={() => handleSuggestionClick(product.id)}
                            className="flex w-full items-center space-x-3 rounded-xl p-2 text-left hover:bg-orange-50/40 hover:translate-x-0.5 transition-all duration-200"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover bg-stone-50 ring-1 ring-stone-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-sans text-xs font-bold text-stone-800 truncate">{product.name}</p>
                              <p className="font-mono text-[10px] text-orange-600 font-bold">${product.price.toFixed(2)}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center">
                          <p className="font-sans text-xs font-semibold text-stone-400">No artisanal treats found</p>
                          <p className="font-sans text-[10px] text-stone-400/80 mt-0.5">Try searching 'sourdough' or 'cake'</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToPage('wishlist')}
              className={`relative rounded-full p-2.5 text-stone-600 hover:bg-orange-50/60 hover:text-orange-600 transition-all border border-transparent ${
                activePage === 'wishlist' ? 'bg-orange-50/80 text-orange-600 border-orange-100/30' : ''
              }`}
              id="wishlist-btn"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm shadow-rose-200 ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </motion.button>

            {/* Cart Icon Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateToPage('cart')}
              className={`relative rounded-full p-2.5 text-stone-600 hover:bg-orange-50/60 hover:text-orange-600 transition-all border border-transparent ${
                activePage === 'cart' ? 'bg-orange-50/80 text-orange-600 border-orange-100/30' : ''
              }`}
              id="cart-btn"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-stone-900 text-[9px] font-bold text-white shadow-sm shadow-stone-400 ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </motion.button>

            <span className="h-4 w-px bg-stone-200" />

            {/* User Profile / Loyalty Status Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-1.5 rounded-full border border-stone-200/80 bg-stone-50/60 p-1 pr-2.5 hover:bg-orange-50 hover:border-orange-100 transition-all duration-300"
                    id="profile-dropdown-btn"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-orange-200"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-sans text-xs font-bold text-stone-700 max-w-[80px] truncate hidden sm:inline-block">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={12}
                      className="text-stone-400 transition-transform duration-300"
                      style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl border border-stone-100 bg-white/95 backdrop-blur-md p-2.5 shadow-2xl ring-1 ring-black/5"
                      >
                        <div className="px-3 py-2.5 border-b border-stone-50">
                          <p className="font-sans text-xs font-bold text-stone-800">{user.name}</p>
                          <p className="font-mono text-[9px] text-stone-400 truncate mt-0.5">{user.email}</p>
                          <div className="mt-2.5 flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100/50 px-2 py-1 text-[10px] font-bold text-orange-700 w-fit">
                            <Sparkles size={11} className="text-orange-500 animate-pulse" />
                            <span>{user.loyaltyPoints} Loyalty Points</span>
                          </div>
                        </div>
                        <div className="mt-1.5 space-y-0.5">
                          <button
                            onClick={() => navigateToPage('dashboard')}
                            className="flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-left font-sans text-xs font-semibold text-stone-600 hover:bg-orange-50/50 hover:text-orange-600 transition-all"
                          >
                            <User size={13} />
                            <span>My Dashboard</span>
                          </button>
                          <button
                            onClick={() => {
                              onLogout();
                              navigateToPage('home');
                            }}
                            className="flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 text-left font-sans text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
                          >
                            <LogOut size={13} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigateToPage('login')}
                  className="flex items-center space-x-1.5 rounded-full bg-stone-900 px-4 py-2 font-sans text-xs font-bold text-white shadow-md hover:bg-stone-800 hover:shadow-lg transition-all"
                  id="login-btn"
                >
                  <User size={12} />
                  <span>Log In</span>
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Hamburg Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full p-2 text-stone-600 hover:bg-orange-50/60 md:hidden border border-transparent active:border-stone-100"
              id="mobile-menu-btn"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Overlay / Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-stone-100 bg-white md:hidden overflow-hidden"
            >
              <div className="space-y-2 px-4 py-5 max-h-[80vh] overflow-y-auto">
                {/* Search box inside mobile menu */}
                <div className="pb-3 border-b border-stone-50">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search fresh sourdough & pastry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pl-4 pr-10 font-sans text-xs focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                    <button type="submit" className="absolute right-3.5 top-3.5 text-stone-400">
                      <Search size={15} />
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  {navigationItems.map((item) => {
                    const isActive = activePage === item.value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => navigateToPage(item.value)}
                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-100'
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && <Sparkles size={11} className="text-orange-200" />}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Bottom Info Section */}
                {user ? (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-white">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-500"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-sans text-xs font-bold">{user.name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-orange-400 font-semibold mt-0.5">
                          <Sparkles size={10} />
                          <span>{user.loyaltyPoints} Loyalty Points</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3.5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigateToPage('dashboard')}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 text-white font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-white/20"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          navigateToPage('home');
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-600/20 text-orange-400 font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-orange-600/30"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-between">
                    <div>
                      <p className="font-serif text-sm font-bold text-stone-900">Unlock Loyalty Club</p>
                      <p className="font-sans text-[10px] text-stone-500 mt-0.5">Earn points, track live bake timers, free recipes!</p>
                    </div>
                    <button
                      onClick={() => navigateToPage('login')}
                      className="bg-stone-900 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-stone-800"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
