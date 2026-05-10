export default function Subscribe() {
  return (
    <section className="px-6 max-w-7xl mx-auto mt-24">
      <div className="relative rounded-3xl overflow-hidden border border-white/5">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-[#0a0a1a] to-pink-900/20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 py-16 sm:py-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 mb-6">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Stay Updated
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            NEVER MISS A{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              BEAT
            </span>
          </h2>

          <p className="text-slate-400 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Get personalized event recommendations and early access to exclusive
            tickets delivered straight to your inbox.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/5 border border-white/10 focus:border-purple-500/50 px-5 py-3.5 rounded-full outline-none text-sm text-white placeholder-slate-500 transition-colors backdrop-blur-sm"
            />

            <button className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}