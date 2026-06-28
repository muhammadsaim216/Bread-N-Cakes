import { motion } from 'motion/react';
import { ChefHat, Leaf, Sparkles, HeartHandshake, Award } from 'lucide-react';

export default function About() {
  const milestones = [
    {
      year: '1976',
      title: 'Our humble beginning',
      desc: 'Grandmother Maria started baking small-batch sourdough in a brick backyard oven in San Francisco, sharing with neighbors.'
    },
    {
      year: '1995',
      title: 'The Stone Oven Hearth',
      desc: 'We opened our first storefront in the Gourmet District, importing a real volcanic stone oven directly from Naples, Italy.'
    },
    {
      year: '2012',
      title: 'Fifty-Year Sourdough Culture',
      desc: 'Our signature wild starter culture, "Gertrude," officially celebrated 36 years of daily feeding and active bakes.'
    },
    {
      year: '2026',
      title: 'Voted Best Artisan Bakery',
      desc: 'Bread N Cakes was awarded "Golden Crust of SF" for outstanding artisanal bread craftsmanship and community loyalty.'
    }
  ];

  const bakers = [
    {
      name: 'Evelyn Stone',
      role: 'Head Sourdough Baker',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      bio: 'Evelyn has spent 15 years perfecting slow-fermentation. She treats our sourdough culture like her own child and is the heart of the bread kitchen.'
    },
    {
      name: 'Leo Mercier',
      role: 'Master Pastry Chef',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      bio: 'Trained in Paris under legendary laminators, Leo brings French pastry perfection, creating buttery layers that sing on the tongue.'
    }
  ];

  return (
    <div className="space-y-20 pb-20" id="about-view">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-orange-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Our Story & Heritage</span>
          <h1 className="mt-1 font-serif text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Flour, Water, Salt & <span className="italic text-orange-600">Fifty Years of Love</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            We believe that beautiful baking takes time. We reject modern hyper-proofing chemicals and commercial fast yeasts, opting for ancient, slow sourdough traditions and AOP French butter lamination.
          </p>
        </div>
      </section>

      {/* Philosophy Row */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 p-6 rounded-2xl bg-white border border-stone-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Leaf size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">100% Organic Ingredients</h3>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">
              We source our heritage, stone-ground flours exclusively from independent, pesticide-free family grain mills in the Pacific Northwest.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-white border border-stone-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <ChefHat size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Slow 36-Hr Cold Proof</h3>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">
              Time is our primary ingredient. Extended slow-proofing breaks down complex starches, making our loaves lighter and gut-healthy.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-white border border-stone-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Award size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Artisan Lamination</h3>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">
              Our pastries are hand-folded with authentic pasture-fed French butter to produce exactly 27 ultra-airy, melt-in-your-mouth crispy layers.
            </p>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="bg-stone-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Milestones</span>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">Our Baking Journey</h2>
          </div>

          <div className="relative border-l border-orange-200 ml-4 md:ml-0 md:grid md:grid-cols-4 md:border-l-0 md:border-t md:pt-8 md:gap-8 space-y-8 md:space-y-0">
            {milestones.map((step, idx) => (
              <div key={idx} className="relative pl-6 md:pl-0">
                {/* Node dot */}
                <div className="absolute -left-[7px] top-1.5 md:left-0 md:-top-[41px] flex h-3 w-3 items-center justify-center rounded-full bg-orange-600 ring-4 ring-orange-100" />
                <span className="font-mono text-lg font-bold text-orange-600">{step.year}</span>
                <h3 className="font-serif text-base font-bold text-stone-900 mt-1">{step.title}</h3>
                <p className="font-sans text-xs text-stone-500 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Bakers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest">Our Team</span>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl mt-1">The Sourdough Masters</h2>
          <p className="mx-auto mt-2 max-w-md font-sans text-xs text-stone-500">
            Meet the hands that feed the sourdough culture, hand-roll the laminated danishes, and pipe the custom gold celebration cakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {bakers.map((baker) => (
            <div key={baker.name} className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-stone-100 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <img
                src={baker.avatar}
                alt={baker.name}
                className="h-32 w-32 rounded-2xl object-cover shrink-0 shadow"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2 text-center sm:text-left">
                <span className="font-mono text-[10px] font-bold text-orange-600 uppercase tracking-wider">{baker.role}</span>
                <h3 className="font-serif text-lg font-bold text-stone-900">{baker.name}</h3>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">{baker.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
