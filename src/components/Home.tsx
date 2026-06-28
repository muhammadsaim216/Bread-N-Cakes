import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Heart, Sparkles, Star, Calendar, ShieldCheck, Flame, Leaf } from 'lucide-react';
import { Product, PageType } from '../types';
import { PRODUCTS, CATEGORIES } from '../data';

interface HomeProps {
  setActivePage: (page: PageType) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
  onAddToCart: (product: Product, quantity: number, size: string, flavor?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function Home({
  setActivePage,
  setSelectedProductId,
  setSelectedCategoryId,
  onAddToCart,
  onAddToWishlist,
  wishlist,
}: HomeProps) {
  // Filter bestsellers and featured
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller).slice(0, 3);
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  const isItemInWishlist = (id: string) => wishlist.some((item) => item.id === id);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActivePage('shop');
  };

  const processStages = [
    {
      num: '01',
      title: 'Milling & Mixing',
      desc: 'We mix organic stone-ground heritage flour, water, and our 50-year-old sourdough culture Gertrude.',
      icon: <Leaf className="h-5 w-5 text-orange-600" />
    },
    {
      num: '02',
      title: '36-Hour Cold Proof',
      desc: 'Dough undergoes slow, cold lactic fermentation, building intense complex flavor and breaking down gluten molecules.',
      icon: <Calendar className="h-5 w-5 text-orange-600" />
    },
    {
      num: '03',
      title: 'Artisanal Shaping',
      desc: 'Every single loaf, croissant, and custom bun is hand-laminated and shaped with precise craftsman touch.',
      icon: <ShieldCheck className="h-5 w-5 text-orange-600" />
    },
    {
      num: '04',
      title: 'Stone Hearth Bake',
      desc: 'Baked at extremely high temperatures in steam-injected stone deck ovens for that signature crackling blistered crust.',
      icon: <Flame className="h-5 w-5 text-orange-600" />
    }
  ];

  return (
    <div className="space-y-20 pb-20" id="home-view">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-50 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Hero Left Info */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left flex flex-col justify-center">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-orange-100/70 px-3 py-1 text-xs font-semibold text-orange-800 w-fit sm:mx-auto lg:mx-0">
              <Sparkles size={12} className="text-orange-600 animate-spin" />
              <span>Baked Fresh Every Day Since 1976</span>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
              Where Flour Meets <span className="italic text-orange-600">Pure Passion</span>
            </h1>
            <p className="mt-4 font-sans text-base text-stone-600 sm:text-lg">
              Experience the unmatched magic of 36-hour slow-fermented wild sourdough and delicate hand-rolled French butter pastries, baked to crispy perfection in stone ovens.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <button
                onClick={() => setActivePage('shop')}
                className="flex items-center justify-center space-x-2 rounded-full bg-orange-600 px-8 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-500 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Browse Fresh Menu</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleCategoryClick('festive-specials')}
                className="flex items-center justify-center space-x-2 rounded-full border border-stone-200 bg-white px-8 py-3.5 font-sans text-sm font-bold text-stone-700 hover:border-orange-500 hover:bg-orange-50/20 hover:text-orange-600 hover:-translate-y-0.5 transition-all"
              >
                <span>Festive Specials</span>
              </button>
            </div>
          </div>

          {/* Hero Right Images */}
          <div className="mt-12 sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 flex items-center justify-center">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=400"
                  alt="Sourdough"
                  className="rounded-2xl object-cover h-64 w-full shadow-md hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400"
                  alt="Pastries"
                  className="rounded-2xl object-cover h-48 w-full shadow-md hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400"
                  alt="Cakes"
                  className="rounded-2xl object-cover h-48 w-full shadow-md hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400"
                  alt="Breads"
                  className="rounded-2xl object-cover h-64 w-full shadow-md hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Abs decoration */}
              <div className="absolute -left-6 -bottom-6 flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xl rotate-12 p-3 font-serif">
                <span className="text-2xl font-bold">100%</span>
                <span className="font-sans text-[10px] uppercase font-bold text-amber-100">Natural</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Explore our Cozy Collections
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm text-stone-500">
            From natural wild ferments to decadent layered celebration cakes, find your perfect sweet or savory indulgence.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.slice(0, 3).map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-550 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-widest">{cat.count} Treats</span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">{cat.name}</h3>
                <p className="font-sans text-xs text-stone-200 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center space-x-1 font-sans text-xs font-semibold text-orange-400">
                  <span>Shop Collection</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CATEGORIES.slice(3, 5).map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-550 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-widest">{cat.count} Treats</span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">{cat.name}</h3>
                <p className="font-sans text-xs text-stone-200 mt-2 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center space-x-1 font-sans text-xs font-semibold text-orange-400">
                  <span>Shop Collection</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Heritage Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-stone-950 text-white overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <span className="font-mono text-xs font-bold text-orange-500 uppercase tracking-widest">Natural Heritage</span>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl">
              Crafted with time, water, salt, and true skill.
            </h2>
            <p className="font-sans text-sm text-stone-400 leading-relaxed">
              We reject modern commercial baking chemicals and rapid yeasts. Our signature sourdough loaves rise slowly over 36 hours, naturally fermenting to unlock pristine depth, crispy blisters, and highly gut-friendly acids. It is baking the way it was meant to be.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <span className="font-serif text-3xl font-extrabold text-orange-500">36 Hrs</span>
                <p className="font-sans text-xs text-stone-400 mt-1">Slow cold proofing fermentation</p>
              </div>
              <div>
                <span className="font-serif text-3xl font-extrabold text-orange-500">50 Yrs</span>
                <p className="font-sans text-xs text-stone-400 mt-1">Our sourdough wild yeast culture age</p>
              </div>
            </div>
          </div>
          <div className="relative h-64 lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
              alt="Baker dusting loaf"
              className="absolute inset-0 h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Freshly Baked Best Sellers
            </h2>
            <p className="mt-3 max-w-2xl font-sans text-sm text-stone-500">
              The daily sweet and savory treats our local community lines up for every morning.
            </p>
          </div>
          <button
            onClick={() => setActivePage('shop')}
            className="mt-4 sm:mt-0 flex items-center space-x-1 font-sans text-sm font-bold text-orange-600 hover:text-orange-500"
          >
            <span>See Entire Menu</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bestSellers.map((product) => {
            const hasWishlist = isItemInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group relative rounded-3xl border border-stone-100 bg-white p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-60 overflow-hidden rounded-2xl bg-stone-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() => handleProductClick(product.id)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                  {/* Absolute Badge */}
                  <div className="absolute left-3 top-3 flex space-x-1.5">
                    {product.bestSeller && (
                      <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        Bestseller
                      </span>
                    )}
                  </div>
                  {/* Wishlist Button */}
                  <button
                    onClick={() => onAddToWishlist(product)}
                    className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition-transform ${
                      hasWishlist ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} className={hasWishlist ? 'fill-red-500' : ''} />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-4">
                  <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                    <span>{product.category.replace('-', ' ')}</span>
                    <div className="flex items-center space-x-0.5 text-amber-500">
                      <Star size={11} className="fill-amber-500" />
                      <span className="font-sans text-[11px] font-semibold text-stone-600">{product.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => handleProductClick(product.id)}
                    className="mt-1 font-serif text-base font-bold text-stone-900 hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="mt-1.5 font-sans text-xs text-stone-500 line-clamp-2 min-h-[32px]">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-stone-50">
                    <span className="font-mono text-base font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => onAddToCart(product, 1, product.sizes[0], product.flavors?.[0])}
                      className="flex items-center space-x-1 rounded-full bg-orange-600 px-3.5 py-2 font-sans text-xs font-bold text-white hover:bg-orange-500 transition-colors"
                    >
                      <ShoppingBag size={12} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sourdough Process Timeline */}
      <section className="bg-stone-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Slow Bread Masterclass</span>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
              The Art of the 36-Hour Sourdough
            </h2>
            <p className="mt-3 font-sans text-sm text-stone-500">
              True bread is a living, breathing thing. Here is how we transform simple flour, water, and salt into a golden masterpiece of flavor.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Horizontal Line decorations */}
            <div className="hidden md:block absolute top-[44px] left-[12.5%] right-[12.5%] h-0.5 bg-orange-100" />
            {processStages.map((stage, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-orange-200 group-hover:border-orange-500 shadow-sm z-10 transition-colors">
                  {stage.icon}
                </div>
                <span className="mt-3 font-mono text-xs font-bold text-orange-600">{stage.num}</span>
                <h3 className="mt-1.5 font-serif text-base font-bold text-stone-900">{stage.title}</h3>
                <p className="mt-2 font-sans text-xs text-stone-500 leading-relaxed max-w-[220px]">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Our Selection</span>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
            Handcrafted Signature Menus
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => {
            const hasWishlist = isItemInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-stone-100 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden rounded-xl bg-stone-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    onClick={() => handleProductClick(product.id)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                  {/* Wishlist Button */}
                  <button
                    onClick={() => onAddToWishlist(product)}
                    className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:scale-110 transition-transform ${
                      hasWishlist ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={14} className={hasWishlist ? 'fill-red-500' : ''} />
                  </button>
                </div>

                {/* Info */}
                <div className="mt-3">
                  <span className="font-mono text-[9px] text-stone-400 uppercase tracking-wider">{product.category.replace('-', ' ')}</span>
                  <h3
                    onClick={() => handleProductClick(product.id)}
                    className="mt-0.5 font-serif text-sm font-bold text-stone-900 hover:text-orange-600 transition-colors cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-stone-50">
                    <span className="font-mono text-sm font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => onAddToCart(product, 1, product.sizes[0], product.flavors?.[0])}
                      className="rounded-full bg-orange-50 p-2 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <ShoppingBag size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
