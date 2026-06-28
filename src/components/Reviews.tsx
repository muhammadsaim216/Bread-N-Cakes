import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Upload, MessageSquare, CheckCircle2, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { REVIEWS } from '../data';
import { Review } from '../types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = total > 0 ? (sum / total).toFixed(1) : '5.0';

    // Distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const ratingKey = Math.min(5, Math.max(1, Math.round(r.rating))) as 5|4|3|2|1;
      distribution[ratingKey]++;
    });

    return { total, average, distribution };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === null) return reviews;
    return reviews.filter((r) => r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formTitle || !formComment) return;

    const newReview: Review = {
      id: `r-${Date.now()}`,
      author: formName,
      avatar: uploadedImagePreview || undefined,
      rating: formRating,
      date: new Date().toISOString().split('T')[0],
      title: formTitle,
      comment: formComment,
      verified: true,
      likes: 0,
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitSuccess(true);

    // Reset Form
    setFormName('');
    setFormRating(5);
    setFormTitle('');
    setFormComment('');
    setUploadedImagePreview(null);

    setTimeout(() => setIsSubmitSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="reviews-view">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Client Testimonials</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
          Loved by Local Bread Lovers
        </h1>
        <p className="mt-3 font-sans text-xs sm:text-sm text-stone-500">
          Our customers are our true bakery family. See why they keep lining up every single morning, and write your own review to share your dough story!
        </p>
      </div>

      {/* Main Grid: Left Stats, Right Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Rating Stats Card (cols 5) */}
        <div className="lg:col-span-5 rounded-3xl border border-stone-100 bg-stone-50/50 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900">Overall Satisfaction</h2>
            <div className="flex items-center space-x-4">
              <span className="font-serif text-5xl font-black text-stone-900">{stats.average}</span>
              <div>
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className={s <= Math.round(Number(stats.average)) ? 'fill-amber-500' : 'text-stone-200'} />
                  ))}
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">Based on {stats.total} verified ratings</p>
              </div>
            </div>

            {/* Distribution bars */}
            <div className="space-y-2 pt-4">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const count = stats.distribution[stars];
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedRatingFilter(selectedRatingFilter === stars ? null : stars)}
                    className={`flex w-full items-center text-left hover:opacity-85 transition-opacity ${
                      selectedRatingFilter === stars ? 'font-bold' : ''
                    }`}
                  >
                    <span className="font-mono text-xs text-stone-600 w-3">{stars}</span>
                    <Star size={11} className="fill-amber-500 text-amber-500 ml-1 mr-3" />
                    {/* Progress Bar Container */}
                    <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden mr-3">
                      <div className="h-full bg-orange-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-xs text-stone-500 w-6 text-right">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100">
            {selectedRatingFilter !== null && (
              <div className="flex items-center justify-between font-sans text-xs">
                <span className="text-stone-500">
                  Filtering for <span className="font-bold text-stone-800">{selectedRatingFilter} star</span> ratings
                </span>
                <button
                  onClick={() => setSelectedRatingFilter(null)}
                  className="font-bold text-orange-600 hover:underline"
                >
                  Show all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Write a Review Form (cols 7) */}
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
                <h3 className="font-serif text-lg font-bold text-stone-900">Review Submitted!</h3>
                <p className="font-sans text-xs text-stone-500 max-w-sm mt-1">
                  Thank you so much for sharing your sweet feedback. It has been added to our live stream!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="font-serif text-lg font-bold text-stone-900 mb-6">Write a review</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4 font-sans text-xs">
            {/* Rating selector */}
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Your Rating</label>
              <div className="flex space-x-1 text-stone-300">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = hoverRating !== null ? star <= hoverRating : star <= formRating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star size={20} className={isActive ? 'fill-amber-400 text-amber-400' : ''} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Double Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel K."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 bg-stone-50/50 focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Review Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crispy, airy crumbs!"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 bg-stone-50/50 focus:bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            {/* Comment box */}
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Detailed Feedback</label>
              <textarea
                required
                rows={4}
                placeholder="Share your experience with our flavors, ordering process, or customer service..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 bg-stone-50/50 focus:bg-white focus:border-orange-500 outline-none resize-none"
              />
            </div>

            {/* Photo upload drag and drop */}
            <div className="space-y-1">
              <label className="font-semibold text-stone-700">Add Baking Photo (Optional)</label>
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center bg-stone-50/50 hover:bg-orange-50/20 hover:border-orange-300 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {uploadedImagePreview ? (
                  <div className="flex items-center justify-center space-x-3">
                    <img src={uploadedImagePreview} alt="Preview" className="h-10 w-10 rounded-lg object-cover ring-1 ring-stone-200" referrerPolicy="no-referrer" />
                    <span className="text-xs text-green-600 font-semibold">Photo added successfully!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={18} className="text-stone-400 mb-1" />
                    <p className="font-semibold text-stone-500 text-[11px]">Click or drag photo here to upload preview</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-stone-900 py-3.5 font-sans font-bold text-white hover:bg-orange-600 transition-colors"
            >
              Submit My Review
            </button>
          </form>
        </div>
      </div>

      {/* REVIEWS LIST SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-stone-900">Verified Feedbacks ({filteredReviews.length})</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {rev.avatar ? (
                      <img src={rev.avatar} alt={rev.author} className="h-10 w-10 rounded-full object-cover ring-1 ring-stone-200" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold font-serif text-sm">
                        {rev.author[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-sans text-xs font-bold text-stone-800">{rev.author}</p>
                      <p className="font-mono text-[9px] text-stone-400">
                        {rev.verified ? 'Verified Buyer' : 'Visitor'} • {rev.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < rev.rating ? 'fill-amber-500' : 'text-stone-100'} />
                    ))}
                  </div>
                </div>

                <div className="font-sans">
                  <p className="text-xs font-bold text-stone-900">{rev.title}</p>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{rev.comment}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-50 flex items-center justify-between font-mono text-[10px] text-stone-400">
                <span className="text-green-600 flex items-center space-x-1 font-sans font-semibold">
                  <CheckCircle2 size={12} />
                  <span>Verified Purchase</span>
                </span>
                <button className="hover:text-orange-600 transition-colors">
                  Helpful ({rev.likes})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
