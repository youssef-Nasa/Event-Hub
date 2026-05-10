import { Link } from "react-router-dom";

export default function Featured({ products, loading }) {
  if (loading) {
    return (
      <section className="px-6 max-w-7xl mx-auto mt-20">
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[380px] rounded-2xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // Filtered/Active products to show
  const mainFeatured = products.slice(0, 3);

  if (mainFeatured.length === 0) return null;

  return (
    <section className="px-6 max-w-7xl mx-auto mt-20">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Featured Experiences
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Handpicked events you don't want to miss
          </p>
        </div>

        <a
          href="#"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors hidden sm:inline-flex items-center gap-1"
        >
          View All
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>

      {/* Featured Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {mainFeatured.map((product, i) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/20 transition-all duration-500 block"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {/* Image */}
            <div className="relative h-[380px] overflow-hidden">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Rating Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                <svg
                  className="w-3.5 h-3.5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.ratingsAverage}
              </div>

              {/* Discount Badge */}
              {product.priceAfterDiscount && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white font-semibold shadow-lg">
                  -{Math.round(
                    ((product.price - product.priceAfterDiscount) /
                      product.price) *
                      100
                  )}
                  %
                </div>
              )}
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {/* Category Tag */}
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-medium mb-3">
                {product.category.name}
              </span>

              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-2">
                {product.title}
              </h3>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-bold text-lg">
                    ${product.priceAfterDiscount || product.price}
                  </span>
                  {product.priceAfterDiscount && (
                    <span className="text-slate-500 text-sm line-through">
                      ${product.price}
                    </span>
                  )}
                </div>

                <button className="px-4 py-2 border border-white/20 hover:border-purple-500/50 hover:bg-purple-500/10 rounded-full text-xs text-white font-medium transition-all duration-300">
                  Reserve
                </button>
              </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-purple-600/10 via-transparent to-transparent" />
          </Link>
        ))}
      </div>

    </section>
  );
}