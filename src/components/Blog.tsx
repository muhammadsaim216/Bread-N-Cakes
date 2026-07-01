import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, Calendar, Clock, ArrowRight, Share2, Search, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS as FALLBACK_BLOGS } from '../data';
import { BlogPost } from '../types';
import { toast } from '../utils/toast';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(FALLBACK_BLOGS);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (data.blogs && data.blogs.length > 0) {
            setBlogPosts(data.blogs);
          }
        }
      } catch (err) {
        console.error('Failed to fetch blogs from DB:', err);
      }
    }
    fetchBlogs();
  }, []);

  const filteredPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="blog-view">
      <AnimatePresence mode="wait">
        {selectedPost ? (
          /* READ SINGLE POST VIEW */
          <motion.div
            key="single-post"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center space-x-2 font-sans text-xs font-bold text-stone-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Cooking Journal</span>
            </button>

            {/* Post Header */}
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 font-sans text-xs font-bold text-orange-600">
                {selectedPost.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-stone-500 font-mono text-[11px] pt-2 border-b border-stone-100 pb-4">
                <span className="flex items-center space-x-1">
                  <User size={13} />
                  <span>{selectedPost.author}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar size={13} />
                  <span>{selectedPost.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock size={13} />
                  <span>{selectedPost.readTime}</span>
                </span>
              </div>
            </div>

            {/* Main Article Image */}
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full aspect-[16/9] object-cover rounded-3xl shadow-sm"
              referrerPolicy="no-referrer"
            />

            {/* Content text */}
            <div className="font-sans text-stone-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>

            {/* Share and sign-up bar */}
            <div className="border-t border-stone-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="font-serif text-xs font-bold text-stone-400 uppercase tracking-widest">
                Happy Baking from Bread N Cakes
              </p>
              <button
                onClick={() => toast.success('Article link copied to clipboard!')}
                className="inline-flex items-center space-x-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 font-sans text-xs font-semibold text-stone-600 hover:text-orange-600 hover:border-orange-500 transition-all"
              >
                <Share2 size={12} />
                <span>Share Recipe</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* JOURNAL INDEX LIST */
          <motion.div
            key="index-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-100 pb-8 gap-6">
              <div className="max-w-xl">
                <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">The Baking Journal</span>
                <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">
                  Baking secrets from our kitchen
                </h1>
                <p className="mt-2 font-sans text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Browse through detailed baking instructions, starter tips, flour classifications, and secrets to laminating crispy croissants directly from Evelyn & Leo.
                </p>
              </div>

              {/* Search blog */}
              <div className="relative w-full md:w-72 shrink-0">
                <input
                  type="text"
                  placeholder="Search articles & tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/50 py-2.5 pl-4 pr-10 font-sans text-xs focus:border-orange-500 focus:bg-white focus:outline-none"
                />
                <Search size={16} className="absolute right-3.5 top-3 text-stone-400" />
              </div>
            </div>

            {/* Grid List */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between border border-stone-100 rounded-3xl bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Image */}
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-stone-50">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-stone-950/80 backdrop-blur-md px-3 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>

                      {/* Content excerpt */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-stone-400">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-2 hover:text-orange-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="font-sans text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        {post.author}
                      </span>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="inline-flex items-center space-x-1.5 font-sans text-xs font-bold text-orange-600 hover:text-orange-500"
                      >
                        <span>Read Article</span>
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-stone-50 rounded-3xl">
                <p className="font-serif text-base font-bold text-stone-800">No matching articles found</p>
                <p className="font-sans text-xs text-stone-500 mt-1">Try another search keyword.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
