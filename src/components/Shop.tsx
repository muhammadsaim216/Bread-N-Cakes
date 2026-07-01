import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpDown, Check, RotateCcw, Heart, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { Product, PageType } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES } from '../data';

interface ShopProps {
  setActivePage: (page: PageType) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedProductId: (id: string | null) => void;
  onAddToCart: (product: Product, quantity: number, size: string, flavor?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
  products?: Product[];
  categories?: typeof FALLBACK_CATEGORIES;
}

export default function Shop({
  setActivePage,
  selectedCategoryId,
  setSelectedCategoryId,
  setSelectedProductId,
  onAddToCart,
  onAddToWishlist,
  wishlist,
  products = FALLBACK_PRODUCTS,
  categories = FALLBACK_CATEGORIES,
}: ShopProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync state if selectedCategoryId updates externally
  const handleCategorySelect = (id: string | null) => {
    setSelectedCategoryId(id);
  };

  const isItemInWishlist = (id: string) => wishlist.some((item) => item.id === id);

  const toggleDietaryFilter = (diet: string) => {
    if (dietaryFilters.includes(diet)) {
      setDietaryFilters(dietaryFilters.filter((d) => d !== diet));
    } else {
      setDietaryFilters([...dietaryFilters, diet]);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setDietaryFilters([]);
    setMaxPrice(60);
    setSortBy('popular');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory = selectedCategoryId ? product.category === selectedCategoryId : true;

      // Price
      const matchesPrice = product.price <= maxPrice;

      // Dietary
      const matchesDietary =
        dietaryFilters.length > 0
          ? dietaryFilters.every((diet) => product.dietary.includes(diet as any))
          : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesDietary;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular
      return b.reviewsCount - a.reviewsCount;
    });
  }, [searchQuery, selectedCategoryId, maxPrice, dietaryFilters, sortBy]);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="shop-view">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">Our Freshly Baked Menu</h1>
        <p className="mx-auto mt-2 max-w-xl font-sans text-xs sm:text-sm text-stone-500">
          Filter by category, price, or dietary needs to find your perfect breakfast bread, sweet afternoon tea pastry, or celebratory custom layer cake.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* SIDEBAR FILTERS - DESKTOP */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="flex items-center space-x-2 font-serif text-base font-bold text-stone-900">
              <SlidersHorizontal size={16} className="text-orange-600" />
              <span>Filters</span>
            </h2>
            <button
              onClick={resetAllFilters}
              className="flex items-center space-x-1 font-mono text-[10px] font-bold text-stone-400 hover:text-orange-600 transition-colors"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search bar inside filters */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Search</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search sourdough, cakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-2 pl-3 pr-8 font-sans text-xs focus:border-orange-500 focus:bg-white focus:outline-none"
              />
              <Search size={14} className="absolute right-3 top-3 text-stone-400" />
            </div>
          </div>

          {/* Categories list */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 font-sans text-xs font-semibold text-left transition-colors ${
                  selectedCategoryId === null
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-stone-600 hover:bg-stone-50/50 hover:text-stone-900'
                }`}
              >
                <span>All Categories</span>
                <span className="font-mono text-[10px] text-stone-400">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 font-sans text-xs font-semibold text-left transition-colors ${
                      selectedCategoryId === cat.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-stone-600 hover:bg-stone-50/50 hover:text-stone-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="font-mono text-[10px] text-stone-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Max Price</h3>
              <span className="font-mono text-xs font-bold text-orange-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer h-1 bg-stone-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between font-mono text-[9px] text-stone-400">
              <span>$5</span>
              <span>$60</span>
            </div>
          </div>

          {/* Dietary filters */}
          <div className="space-y-2">
            <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Dietary Preferences</h3>
            <div className="space-y-1.5">
              {['vegan', 'gluten-free', 'eggless', 'organic'].map((diet) => {
                const isSelected = dietaryFilters.includes(diet);
                return (
                  <button
                    key={diet}
                    onClick={() => toggleDietaryFilter(diet)}
                    className="flex w-full items-center space-x-2.5 py-1 text-stone-600 hover:text-orange-600 transition-colors text-left"
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all ${
                        isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className="font-sans text-xs font-medium capitalize">{diet.replace('-', ' ')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting / Controls bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-4 gap-4">
            <div className="font-sans text-xs text-stone-500">
              Showing <span className="font-bold text-stone-800">{filteredProducts.length}</span> of{' '}
              <span className="font-bold text-stone-800">{products.length}</span> signature bakes
            </div>

            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3">
              {/* Mobile Filter toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex lg:hidden items-center space-x-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 font-sans text-xs font-semibold text-stone-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              {/* Sorting */}
              <div className="flex items-center space-x-2 font-sans text-xs">
                <span className="text-stone-400 flex items-center space-x-1">
                  <ArrowUpDown size={12} />
                  <span className="hidden sm:inline">Sort by:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 font-sans font-medium text-stone-700 outline-none focus:border-orange-500"
                >
                  <option value="popular">Popularity</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIVE FILTER BADGES */}
          {(selectedCategoryId || dietaryFilters.length > 0 || maxPrice < 60 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Active:</span>
              {searchQuery && (
                <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
                  "{searchQuery}"
                </span>
              )}
              {selectedCategoryId && (
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                  {categories.find((c) => c.id === selectedCategoryId)?.name}
                </span>
              )}
              {maxPrice < 60 && (
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                  Under ${maxPrice}
                </span>
              )}
              {dietaryFilters.map((diet) => (
                <span
                  key={diet}
                  className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 capitalize"
                >
                  {diet.replace('-', ' ')}
                </span>
              ))}
              <button
                onClick={resetAllFilters}
                className="font-sans text-xs font-bold text-stone-400 hover:text-orange-600 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* MAIN PRODUCT GRID */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const hasWishlist = isItemInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="group relative rounded-3xl border border-stone-100 bg-white p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden rounded-2xl bg-stone-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => handleProductClick(product.id)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                      {/* Dietary Badges */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                        {product.dietary.slice(0, 2).map((diet) => (
                          <span
                            key={diet}
                            className="rounded-full bg-stone-900/80 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider"
                          >
                            {diet === 'gluten-free' ? 'GF' : diet}
                          </span>
                        ))}
                      </div>
                      {/* Best Seller or New Badges */}
                      <div className="absolute left-3 bottom-3 flex flex-wrap gap-1">
                        {product.bestSeller && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-stone-950 uppercase tracking-wider shadow-sm">
                            <Sparkles size={8} className="fill-stone-950 text-stone-950" />
                            <span>Best Seller</span>
                          </span>
                        )}
                        {product.isNew && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-600/95 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider shadow-sm">
                            <span>New</span>
                          </span>
                        )}
                      </div>
                      {/* Wishlist Icon */}
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
                          <Star size={11} className="fill-amber-500 animate-pulse" />
                          <span className="font-sans text-[11px] font-semibold text-stone-600">{product.rating}</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleProductClick(product.id)}
                        className="mt-1 font-serif text-base font-bold text-stone-900 hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <p className="mt-1 font-sans text-xs text-stone-500 line-clamp-2 min-h-[32px]">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-stone-50">
                        <span className="font-mono text-base font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => onAddToCart(product, 1, product.sizes[0], product.flavors?.[0])}
                          className="flex items-center space-x-1.5 rounded-full bg-orange-600 px-3.5 py-2 font-sans text-xs font-bold text-white hover:bg-orange-500 transition-colors"
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
          ) : (
            <div className="text-center py-16 bg-stone-50/50 rounded-3xl border border-stone-100">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 mb-3">
                <Search size={20} />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">No delicious treats found</h3>
              <p className="font-sans text-xs text-stone-500 max-w-sm mx-auto mt-1">
                Try widening your search or clearing filters to locate other mouth-watering baked items.
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-4 rounded-full bg-stone-900 px-5 py-2 font-sans text-xs font-bold text-white hover:bg-stone-800"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTERS MODAL */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-lg font-bold text-stone-900">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
                  >
                    X
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Category</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleCategorySelect(null);
                        setShowMobileFilters(false);
                      }}
                      className={`rounded-lg px-3 py-2 font-sans text-xs font-semibold text-center transition-colors ${
                        selectedCategoryId === null ? 'bg-orange-50 text-orange-600' : 'bg-stone-50 text-stone-600'
                      }`}
                    >
                      All ({products.length})
                    </button>
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            handleCategorySelect(cat.id);
                            setShowMobileFilters(false);
                          }}
                          className={`rounded-lg px-3 py-2 font-sans text-xs font-semibold text-center transition-colors truncate ${
                            selectedCategoryId === cat.id ? 'bg-orange-50 text-orange-600' : 'bg-stone-50 text-stone-600'
                          }`}
                        >
                          {cat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Max Price</h3>
                    <span className="font-mono text-xs font-bold text-orange-600">${maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer h-1"
                  />
                </div>

                {/* Dietary */}
                <div className="space-y-2">
                  <h3 className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Dietary Needs</h3>
                  <div className="space-y-2">
                    {['vegan', 'gluten-free', 'eggless', 'organic'].map((diet) => {
                      const isSelected = dietaryFilters.includes(diet);
                      return (
                        <button
                          key={diet}
                          onClick={() => toggleDietaryFilter(diet)}
                          className="flex w-full items-center space-x-3 py-1 text-stone-600 text-left"
                        >
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-md border ${
                              isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-stone-300'
                            }`}
                          >
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span className="font-sans text-xs font-medium capitalize">{diet.replace('-', ' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex gap-4">
                <button
                  onClick={() => {
                    resetAllFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-1/2 rounded-full border border-stone-200 py-2.5 font-sans text-xs font-bold text-stone-600"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-1/2 rounded-full bg-orange-600 py-2.5 font-sans text-xs font-bold text-white shadow-md shadow-orange-100"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
