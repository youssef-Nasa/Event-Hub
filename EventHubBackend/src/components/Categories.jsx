import { useRef } from "react";

const CATEGORY_LIST = [
  { id: "Music", name: "Music", emoji: "🎵", color: "from-purple-500/20 to-pink-500/20" },
  { id: "Technology", name: "Tech", emoji: "💻", color: "from-blue-500/20 to-cyan-500/20" },
  { id: "Sports", name: "Sports", emoji: "⚽", color: "from-green-500/20 to-emerald-500/20" },
  { id: "Business", name: "Business", emoji: "💼", color: "from-amber-500/20 to-orange-500/20" },
  { id: "Parties", name: "Parties", emoji: "🥳", color: "from-rose-500/20 to-red-500/20" },
  { id: "Education", name: "Education", emoji: "🎓", color: "from-indigo-500/20 to-blue-500/20" },
  { id: "Art", name: "Art", emoji: "🎨", color: "from-fuchsia-500/20 to-purple-500/20" },
];

export default function Categories({ selectedCategory, setSelectedCategory }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-6 max-w-7xl mx-auto mt-4 relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Browse Categories
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Find events that match your vibe
          </p>
        </div>

        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
      >
        {CATEGORY_LIST.map((cat, i) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`group relative min-w-[140px] h-[160px] rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 border transition-all duration-500 flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${cat.color} ${selectedCategory === cat.id ? 'border-purple-500 ring-2 ring-purple-500/20 scale-105' : 'border-white/5 hover:border-purple-500/30'
              }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Emoji */}
            <span className="text-5xl group-hover:scale-125 transition-transform duration-500 select-none">
              {cat.emoji}
            </span>

            {/* Content */}
            <div className="text-center">
              <p className="text-white text-sm font-semibold tracking-wide">
                {cat.name}
              </p>
            </div>

            {/* Hover glow */}
            <div className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-purple-500/5 to-transparent ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
          </div>
        ))}
      </div>
    </section>
  );
}