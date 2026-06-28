import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '../data';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = ['all', 'Ordering & Delivery', 'Dietary & Ingredients', 'Storage & Freshness'];

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' ? true : faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" id="faq-view">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Help Center</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
          Bakehouse Frequently Asked Questions
        </h1>
        <p className="mt-3 font-sans text-xs sm:text-sm text-stone-500">
          Have an inquiry about delivery radius, gluten allergies, custom order notice, or storage recommendations? We have detailed answers below.
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="space-y-6 mb-12">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type your question e.g. 'Celiac', 'delivery'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 py-3 pl-4 pr-12 font-sans text-xs sm:text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
          />
          <Search size={18} className="absolute right-4 top-3.5 text-stone-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setExpandedIndex(null);
              }}
              className={`rounded-full px-4 py-2 font-sans text-xs font-bold border transition-all ${
                selectedCategory === cat
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-100 bg-white p-1 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex w-full items-center justify-between text-left p-4 focus:outline-none"
                >
                  <div className="flex items-start space-x-3 pr-4">
                    <HelpCircle size={16} className="text-orange-600 shrink-0 mt-0.5" />
                    <span className="font-serif text-sm font-bold text-stone-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-stone-400 shrink-0">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-4 pb-5 pl-11 font-sans text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-50/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-stone-50 rounded-2xl">
          <p className="font-serif text-base font-bold text-stone-800">No FAQs match your search</p>
          <p className="font-sans text-xs text-stone-500 mt-1">Try other simple keywords like "gluten", "box", "deliver".</p>
        </div>
      )}

      {/* Secondary Callout */}
      <div className="mt-16 rounded-3xl bg-orange-50/50 border border-orange-100/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-lg font-bold text-stone-900">Still have custom enquiries?</h3>
          <p className="font-sans text-xs text-stone-500 max-w-md">
            Our wedding planners and customer team are available daily to assist with customized wedding towers or allergies.
          </p>
        </div>
        <button
          onClick={() => {}}
          className="inline-flex items-center space-x-1.5 rounded-full bg-orange-600 px-5 py-2.5 font-sans text-xs font-bold text-white hover:bg-orange-500 shadow transition-colors"
        >
          <MessageSquare size={14} />
          <span>Shoot us a Note</span>
        </button>
      </div>
    </div>
  );
}
