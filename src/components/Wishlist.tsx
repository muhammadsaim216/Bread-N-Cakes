import { Heart, Trash2, ShoppingBag, ArrowRight, Star, Share2 } from 'lucide-react';
import { Product, PageType } from '../types';
import { toast } from '../utils/toast';

interface WishlistProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, size: string, flavor?: string) => void;
  setActivePage: (page: PageType) => void;
  setSelectedProductId: (id: string | null) => void;
}

export default function Wishlist({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  setActivePage,
  setSelectedProductId,
}: WishlistProps) {
  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('product-details');
  };

  const handleShareWishlist = () => {
    toast.success('Wishlist shared link copied! Your baking dream list is ready for family.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="wishlist-view">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-100 pb-6 mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900">My Sourdough Wishlist</h1>
          <p className="mt-1 font-sans text-xs sm:text-sm text-stone-500">
            Keep track of your favorite cakes, artisanal breads, and croissants for your next special occasion.
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={handleShareWishlist}
            className="inline-flex items-center space-x-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 font-sans text-xs font-semibold text-stone-600 hover:text-orange-600 hover:border-orange-500 transition-all"
          >
            <Share2 size={13} />
            <span>Share Wishlist</span>
          </button>
        )}
      </div>

      {/* Grid List */}
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-3xl border border-stone-100 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden rounded-2xl bg-stone-50">
                <img
                  src={product.image}
                  alt={product.name}
                  onClick={() => handleProductClick(product.id)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103 cursor-pointer"
                  referrerPolicy="no-referrer"
                />
                {/* Delete button */}
                <button
                  onClick={() => onRemoveFromWishlist(product)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-red-50 hover:text-red-600 transition-colors text-stone-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                  <span>{product.category.replace('-', ' ')}</span>
                  <div className="flex items-center space-x-0.5 text-amber-500">
                    <Star size={11} className="fill-amber-500" />
                    <span className="font-sans text-[11px] font-semibold text-stone-600">{product.rating}</span>
                  </div>
                </div>

                <h3
                  onClick={() => handleProductClick(product.id)}
                  className="font-serif text-base font-bold text-stone-900 hover:text-orange-600 transition-colors cursor-pointer truncate"
                >
                  {product.name}
                </h3>
                <p className="font-sans text-xs text-stone-500 line-clamp-1">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-stone-50">
                  <span className="font-mono text-base font-extrabold text-stone-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => onAddToCart(product, 1, product.sizes[0], product.flavors?.[0])}
                    className="flex items-center space-x-1 rounded-full bg-orange-600 px-3.5 py-2 font-sans text-xs font-bold text-white hover:bg-orange-500 transition-colors"
                  >
                    <ShoppingBag size={12} />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-100 max-w-lg mx-auto">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-4">
            <Heart size={26} className="animate-pulse" />
          </div>
          <h2 className="font-serif text-lg font-bold text-stone-900">Your wishlist is empty</h2>
          <p className="font-sans text-xs text-stone-500 max-w-xs mx-auto mt-2 leading-relaxed">
            Whenever you browse our sourdough menu or birthday cakes, click the small heart icon to save them here for easy planning!
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="mt-6 inline-flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 font-sans text-xs font-bold text-white hover:bg-orange-600 transition-all"
          >
            <span>Explore Fresh Menu</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
