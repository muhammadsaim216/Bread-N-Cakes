import { motion } from 'motion/react';
import { ArrowRight, Leaf, Sparkles, ChefHat } from 'lucide-react';
import { PageType } from '../types';
import { CATEGORIES, PRODUCTS } from '../data';

interface CategoriesProps {
  setActivePage: (page: PageType) => void;
  setSelectedCategoryId: (id: string | null) => void;
}

export default function Categories({ setActivePage, setSelectedCategoryId }: CategoriesProps) {
  const handleCategoryClick = (id: string) => {
    setSelectedCategoryId(id);
    setActivePage('shop');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="categories-view">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Our Specialties</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
          Explore our cozy Bakehouse Kitchens
        </h1>
        <p className="mt-3 font-sans text-xs sm:text-sm text-stone-500 leading-relaxed">
          Each department of our bakery operates with its own specialized pastry chefs and unique heritage formulas. Select a kitchen below to browse their active warm products.
        </p>
      </div>

      {/* Grid List */}
      <div className="space-y-16">
        {CATEGORIES.map((cat, idx) => {
          const isEven = idx % 2 === 0;
          const catProducts = PRODUCTS.filter((p) => p.category === cat.id).slice(0, 3);

          return (
            <div
              key={cat.id}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 border-b border-stone-100 pb-16 last:border-b-0 ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Category Card Image */}
              <div className="w-full lg:w-1/2">
                <div
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group relative h-96 rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="font-mono text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                      {cat.count} Active Items
                    </span>
                    <h2 className="font-serif text-2xl font-bold mt-1">{cat.name}</h2>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-center space-x-2 text-orange-600">
                  <ChefHat size={18} />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest">Baking Department</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">{cat.name}</h3>
                <p className="font-sans text-sm text-stone-600 leading-relaxed">{cat.description}</p>

                {/* mini preview products */}
                <div className="space-y-3 pt-2">
                  <p className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">Featured Creations</p>
                  <div className="grid grid-cols-3 gap-3">
                    {catProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setActivePage('shop');
                        }}
                        className="group/item cursor-pointer text-left"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-16 w-full rounded-xl object-cover ring-1 ring-stone-100 group-hover/item:ring-orange-200 transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <p className="font-sans text-[11px] font-semibold text-stone-700 mt-1.5 truncate group-hover/item:text-orange-600">
                          {p.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="inline-flex items-center space-x-2 rounded-full bg-stone-900 px-6 py-3 font-sans text-xs font-bold text-white hover:bg-orange-600 hover:shadow-md hover:shadow-orange-100 hover:-translate-y-0.5 transition-all"
                  >
                    <span>Browse {cat.name}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
