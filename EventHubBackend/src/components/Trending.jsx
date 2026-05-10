import { Link } from "react-router-dom";

export default function Trending({ products, loading }) {
  const sorted = [...products].sort((a, b) => b.sold - a.sold);
  const trendingProducts = sorted.slice(0, 5);

  if (loading) {
    return (
      <section className="px-6 max-w-7xl mx-auto mt-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-[450px] rounded-2xl bg-white/5 animate-pulse" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[100px] rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (trendingProducts.length === 0) return null;

  const mainProduct = trendingProducts[0];
  const sideProducts = trendingProducts.slice(1, 5);

  return (
    <section className="px-6 max-w-7xl mx-auto mt-20">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Trending Now
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Most popular events this week
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-slate-400">Live Updates</span>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link 
          to={`/product/${mainProduct._id}`}
          className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/20 transition-all duration-500 block"
        >
          <div className="relative h-full min-h-[450px]">
            <img
              src={mainProduct.imageCover}
              alt={mainProduct.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Hot Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 backdrop-blur-sm text-xs text-white font-semibold">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              HOT
            </div>

            {/* Sold count */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
              {mainProduct.sold.toLocaleString()} sold
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-medium mb-3">
                {mainProduct.category.name}
              </span>

              <h3 className="text-white font-bold text-xl leading-tight mb-2">
                {mainProduct.title}
              </h3>

              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                {mainProduct.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-purple-400 font-bold text-xl">
                    ${mainProduct.priceAfterDiscount || mainProduct.price}
                  </span>
                  {mainProduct.priceAfterDiscount && (
                    <span className="text-slate-500 text-sm line-through">
                      ${mainProduct.price}
                    </span>
                  )}
                </div>

                <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all outline-none border-none">
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        </Link>


        <div className="flex flex-col gap-4">
          {sideProducts.map((product, i) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 hover:bg-white/[0.06] cursor-pointer transition-all duration-300"
            >
              {/* Rank Number ... existing fields ... */}
              <span className="text-3xl font-black text-white/10 group-hover:text-purple-500/30 transition-colors min-w-[40px] text-center">
                {String(i + 2).padStart(2, "0")}
              </span>

              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5">
                <img
                  src={product.imageCover}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-semibold leading-tight line-clamp-1">
                  {product.title}
                </h4>
                <p className="text-slate-500 text-xs mt-1">
                  {product.category.name}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-purple-400 text-sm font-bold">
                    ${product.priceAfterDiscount || product.price}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.ratingsAverage}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}