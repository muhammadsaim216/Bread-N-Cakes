import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Star, ArrowLeft, Check, Sparkles, Scale, Info, Share2, Plus, Minus } from 'lucide-react';
import { Product, PageType } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS, REVIEWS } from '../data';

interface ProductDetailsProps {
  productId: string | null;
  setActivePage: (page: PageType) => void;
  setSelectedProductId: (id: string | null) => void;
  onAddToCart: (product: Product, quantity: number, size: string, flavor?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlist: Product[];
  products?: Product[];
}

export default function ProductDetails({
  productId,
  setActivePage,
  setSelectedProductId,
  onAddToCart,
  onAddToWishlist,
  wishlist,
  products = FALLBACK_PRODUCTS,
}: ProductDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');
  const [quantity, setQuantity] = useState<number>(1);

  // Retrieve product
  const product = useMemo(() => {
    return products.find((p) => p.id === productId) || products[0];
  }, [productId, products]);

  const [mainImage, setMainImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product.flavors?.[0] || '');
  const [isShareCopied, setIsShareCopied] = useState(false);

  // Sync image if product changes
  useMemo(() => {
    setMainImage(product.image);
    setSelectedSize(product.sizes[0]);
    setSelectedFlavor(product.flavors?.[0] || '');
    setQuantity(1);
  }, [product]);

  const hasWishlist = wishlist.some((item) => item.id === product.id);

  // Filter related bakes
  const relatedProducts = useMemo(() => {
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  }, [product, products]);

  // Filter reviews for this product
  const productReviews = useMemo(() => {
    return REVIEWS.filter((r) => r.productId === product.id);
  }, [product]);

  const handleShareClick = () => {
    setIsShareCopied(true);
    setTimeout(() => setIsShareCopied(false), 2000);
  };

  const handleRelatedClick = (id: string) => {
    setSelectedProductId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="product-details-view">
      {/* Back Button */}
      <button
        onClick={() => setActivePage('shop')}
        className="inline-flex items-center space-x-2 font-sans text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        <span>Back to Fresh Menu</span>
      </button>

      {/* Main product columns */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left column: gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-50 border border-stone-100 shadow-sm">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Absolute Badges */}
            <div className="absolute left-4 top-4 flex flex-col space-y-2">
              {product.bestSeller && (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-[9px] font-bold text-white uppercase tracking-wider shadow-sm w-fit">
                  Bestseller
                </span>
              )}
              {product.dietary.map((diet) => (
                <span
                  key={diet}
                  className="rounded-full bg-green-600/90 backdrop-blur-md px-3 py-1 text-[8px] font-bold text-white uppercase tracking-wider shadow-sm w-fit capitalize"
                >
                  {diet.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-stone-50 transition-all ${
                    mainImage === img ? 'border-orange-500 ring-2 ring-orange-50' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: product details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Rating & Category header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">
                {product.category.replace('-', ' ')} Kitchen
              </span>
              <div className="flex items-center space-x-1.5">
                <div className="flex items-center text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <span className="ml-1 font-sans text-xs font-bold text-stone-700">{product.rating}</span>
                </div>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="font-sans text-xs text-stone-500 hover:text-orange-600 underline"
                >
                  {product.reviewsCount} verified reviews
                </button>
              </div>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
              <span className="font-sans text-xs text-stone-400">Fresh baked premium selection</span>
            </div>

            <p className="font-sans text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* SIZES */}
            <div className="space-y-2 pt-2">
              <span className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl px-4 py-2.5 font-sans text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-100'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* FLAVORS */}
            {product.flavors && product.flavors.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-serif text-xs font-bold text-stone-700 uppercase tracking-wider">Select Blend / Flavor</span>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((flavor) => (
                    <button
                      key={flavor}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`rounded-xl px-4 py-2.5 font-sans text-xs font-semibold border transition-all ${
                        selectedFlavor === flavor
                          ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-100'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stepper counter & buttons */}
          <div className="border-t border-stone-100 pt-6 space-y-4">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-stone-200 rounded-full p-1 bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-white hover:text-stone-800 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="font-mono text-sm font-bold text-stone-800 w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-white hover:text-stone-800 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => onAddToCart(product, quantity, selectedSize, selectedFlavor)}
                className="flex-1 flex items-center justify-center space-x-2 rounded-full bg-orange-600 px-8 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-orange-100 hover:bg-orange-500 transition-all cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Add ${ (product.price * quantity).toFixed(2) } to Cart</span>
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex gap-4">
              <button
                onClick={() => onAddToWishlist(product)}
                className={`flex-1 flex items-center justify-center space-x-2 rounded-xl border border-stone-200 py-2.5 font-sans text-xs font-semibold transition-all ${
                  hasWishlist ? 'text-red-600 bg-red-50/50 border-red-200' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Heart size={14} className={hasWishlist ? 'fill-red-500 text-red-500' : ''} />
                <span>{hasWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button
                onClick={handleShareClick}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors relative"
              >
                <Share2 size={16} />
                <AnimatePresence>
                  {isShareCopied && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -25 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-full mb-1 bg-stone-900 text-white font-sans text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap"
                    >
                      Copied Link!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs area */}
      <div className="mt-16 border-t border-stone-100 pt-10">
        <div className="flex border-b border-stone-100 space-x-8" id="product-details-tabs">
          {[
            { id: 'details', label: 'Baking & Ingredients' },
            { id: 'nutrition', label: 'Nutrition Facts' },
            { id: 'reviews', label: `Reviews (${productReviews.length + 1})` },
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
                <motion.div
                  layoutId="productTabLine"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-orange-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="py-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-xs sm:text-sm">
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900">The Story behind the Bake</h3>
                <p className="text-stone-600 leading-relaxed">
                  {product.longDescription || product.description}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-stone-900">100% Honest Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center rounded-lg bg-stone-100 px-3 py-1.5 font-medium text-stone-700 font-mono text-xs"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="max-w-md border-2 border-stone-900 bg-white p-6 font-mono text-stone-900">
              <h3 className="text-xl font-black uppercase tracking-tight border-b-8 border-stone-900 pb-1">
                Nutrition Facts
              </h3>
              <div className="flex justify-between border-b border-stone-900 py-1.5 text-xs font-semibold">
                <span>Serving Size</span>
                <span>1 slice (100g)</span>
              </div>
              <div className="flex justify-between border-b-4 border-stone-900 py-2.5 font-black text-lg">
                <span>Calories</span>
                <span>{product.nutritionalInfo.calories}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-1.5 text-xs">
                <span className="font-bold">Total Fat</span>
                <span className="font-bold">{product.nutritionalInfo.fat}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 py-1.5 text-xs">
                <span className="font-bold">Total Carbohydrates</span>
                <span className="font-bold">{product.nutritionalInfo.carbs}</span>
              </div>
              <div className="flex justify-between border-b border-stone-900 py-1.5 text-xs">
                <span className="font-bold">Protein</span>
                <span className="font-bold">{product.nutritionalInfo.protein}</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-2 italic font-sans leading-tight">
                * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h3 className="font-serif text-base font-bold text-stone-900">Customer Feedbacks</h3>
              <div className="space-y-4">
                {/* Standard general review */}
                <div className="rounded-2xl border border-stone-100 bg-orange-50/20 p-4 font-sans">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center font-serif text-white font-bold text-xs">
                        M
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-800">Maria Henderson</p>
                        <p className="text-[10px] text-stone-400">Verified Buyer • Jun 24, 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={11} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-stone-900">Absolute perfection, soft crumb!</p>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    This is by far the finest bakery item I have purchased in years. Smells of fresh yeast and butter. We toast this slightly in the oven and it comes out like newly baked! Highly recommend.
                  </p>
                </div>

                {productReviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-stone-100 p-4 font-sans">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={rev.avatar} alt={rev.author} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-xs font-bold text-stone-800">{rev.author}</p>
                          <p className="text-[10px] text-stone-400">
                            {rev.verified ? 'Verified Buyer' : 'Visitor'} • {rev.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-stone-900">{rev.title}</p>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products recommendations */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-stone-100 pt-16">
          <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8">Related Bakehouse Treats</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="group relative rounded-2xl border border-stone-100 bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden rounded-xl bg-stone-50">
                  <img
                    src={p.image}
                    alt={p.name}
                    onClick={() => handleRelatedClick(p.id)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-3">
                  <h3
                    onClick={() => handleRelatedClick(p.id)}
                    className="font-serif text-sm font-bold text-stone-900 hover:text-orange-600 transition-colors cursor-pointer truncate"
                  >
                    {p.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-stone-50">
                    <span className="font-mono text-sm font-bold text-stone-900">${p.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleRelatedClick(p.id)}
                      className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
