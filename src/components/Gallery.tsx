import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Camera, Heart, Sparkles, SlidersHorizontal } from 'lucide-react';
import { GALLERY_ITEMS } from '../data';

export default function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filters = [
    { label: 'All Creations', value: 'all' },
    { label: 'Royal Wedding Cakes', value: 'wedding' },
    { label: 'Fun Birthday Cakes', value: 'birthday' },
    { label: 'Daily Hearth Pastries', value: 'daily' },
  ];

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="gallery-view">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Creations Gallery</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
          Our Sweet & Savory Masterpieces
        </h1>
        <p className="mt-2 font-sans text-xs sm:text-sm text-stone-500 leading-relaxed">
          Take a look at some of our customized wedding towers, quirky celebration cakes, and crispy stone-oven sourdough loaves. Each treat is customized, baked, and finished entirely by hand.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={`rounded-full px-5 py-2 font-sans text-xs font-bold border transition-all ${
              selectedFilter === filter.value
                ? 'border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-100'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Masonry-like layout */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              onClick={() => setSelectedImage(item.image)}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer aspect-[3/4]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-550 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover overlay content */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="font-mono text-[9px] font-bold text-orange-400 uppercase tracking-widest">{item.category}</span>
                <h3 className="font-serif text-sm font-bold mt-1 line-clamp-1">{item.title}</h3>
                <div className="mt-3 flex items-center space-x-1 font-sans text-[11px] font-semibold text-orange-400">
                  <Camera size={12} />
                  <span>Click to Expand View</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            >
              X
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Expanded Masterpiece"
                className="max-h-[80vh] max-w-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="bg-white p-4 flex justify-between items-center">
                <p className="font-serif text-sm font-bold text-stone-900">
                  {GALLERY_ITEMS.find((g) => g.image === selectedImage)?.title || 'Artisan Custom Creation'}
                </p>
                <div className="flex items-center space-x-1 font-mono text-xs text-orange-600">
                  <Star size={12} className="fill-orange-600" />
                  <span>Custom Handcrafted</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
