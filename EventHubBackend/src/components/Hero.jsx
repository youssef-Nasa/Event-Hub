import { useEffect, useRef } from "react";
import { Search, MapPin, Calendar } from "lucide-react";

export default function Hero({ searchQuery, setSearchQuery, locationQuery, setLocationQuery, dateQuery, setDateQuery }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    setTimeout(() => {
      el.style.transition = "all 1s cubic-bezier(0.16, 1, 0.3, 1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0a0a1a] to-black" />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[140px] animate-pulse-slow animation-delay-4000" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Content */}
      <div ref={heroRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live Events Near You
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
          <span className="text-white block">UNLEASH THE</span>
          <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text">
            MOMENT
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 mt-8 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Discover curated experiences — from electrifying concerts to immersive
          tech summits. Your next unforgettable memory starts here.
        </p>

        {/* Search Bar */}
        <div className="mt-10 flex justify-center">
          <div className="flex flex-col md:flex-row items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md p-2 rounded-3xl md:rounded-full w-full max-w-[800px] focus-within:border-purple-500/50 transition-all duration-300 shadow-2xl shadow-black/50">
            
            {/* Search Query */}
            <div className="flex items-center flex-1 px-4 py-2 w-full">
              <Search className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
              <input
                placeholder="What are you looking for?"
                className="bg-transparent w-full outline-none text-sm text-white placeholder-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-white/10" />

            {/* Location */}
            <div className="flex items-center flex-1 px-4 py-2 w-full">
              <MapPin className="w-5 h-5 text-pink-400 mr-3 shrink-0" />
              <input
                placeholder="Location..."
                className="bg-transparent w-full outline-none text-sm text-white placeholder-slate-500"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-white/10" />

            {/* Date */}
            <div className="flex items-center flex-1 px-4 py-2 w-full">
              <Calendar className="w-5 h-5 text-orange-400 mr-3 shrink-0" />
              <input
                type="text"
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => e.target.type = 'text'}
                placeholder="Any date"
                className="bg-transparent w-full outline-none text-sm text-white placeholder-slate-500"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
              />
            </div>

            <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:scale-105 rounded-full text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 sm:gap-16 mt-14">
          {[
            { value: "12K+", label: "Events" },
            { value: "50K+", label: "Attendees" },
            { value: "500+", label: "Venues" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}