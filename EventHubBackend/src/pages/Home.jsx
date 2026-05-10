import { useState, useEffect } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Featured from "../components/Featured";
import Trending from "../components/Trending";
import Subscribe from "../components/Subscribe";
import Footer from "../components/Footer";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Data mapping utility
  const mapEvent = (e) => ({
    _id: e.id,
    id: e.id,
    title: e.title,
    description: e.description,
    price: e.ticketPrice,
    imageCover: e.imageCoverUrl && e.imageCoverUrl.startsWith('http') ? e.imageCoverUrl : (e.imageCoverUrl ? `http://localhost:8080${e.imageCoverUrl}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'),
    category: { _id: e.categoryId, name: e.category },
    venue: e.venueName,
    date: e.eventDate,
    organizer: e.organizerName,
    ratingsAverage: e.ratingsAverage || 4.8,
    sold: e.sold || 0,
    status: e.status,
    availableTickets: e.availableTickets
  });

  // Fetch data
  useEffect(() => {
    Promise.all([
      API.get("/events"),
      API.get("/events/categories"),
    ])
      .then(([eventsRes, categoriesRes]) => {
        const rawEvents = eventsRes.data.events || eventsRes.data.Events || [];
        const mappedEvents = rawEvents.map(mapEvent);
        setEvents(mappedEvents);
        setCategories(categoriesRes.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Home fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Filtered events
  const filteredProducts = events.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = 
      !locationQuery ||
      product.venue?.toLowerCase().includes(locationQuery.toLowerCase()) ||
      product.address?.toLowerCase().includes(locationQuery.toLowerCase());

    const matchesDate =
      !dateQuery ||
      product.date?.includes(dateQuery);

    const matchesCategory =
      !selectedCategory || product.category?._id === selectedCategory;

    return matchesSearch && matchesLocation && matchesDate && matchesCategory;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setDateQuery("");
    setSelectedCategory(null);
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) + (locationQuery ? 1 : 0) + (dateQuery ? 1 : 0) + (selectedCategory ? 1 : 0);

  return (
    <div className="bg-black min-h-screen text-white font-body selection:bg-purple-500/30">
      <Navbar />
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        dateQuery={dateQuery}
        setDateQuery={setDateQuery}
      />
      <Categories
        categories={categories}
        loading={loading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <div className="px-6 max-w-7xl mx-auto mt-10">
          <div className="flex items-center flex-wrap gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-sm text-slate-400 mr-1">Active filters:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-white transition-colors">×</button>
              </span>
            )}

            {locationQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs text-pink-300">
                Location: "{locationQuery}"
                <button onClick={() => setLocationQuery("")} className="hover:text-white transition-colors">×</button>
              </span>
            )}

            {dateQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs text-orange-300">
                Date: "{dateQuery}"
                <button onClick={() => setDateQuery("")} className="hover:text-white transition-colors">×</button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs text-pink-300">
                Category:{" "}
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="hover:text-white transition-colors"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-slate-500 hover:text-white transition-colors"
            >
              Clear All
            </button>

            <span className="text-xs text-slate-600">
              {filteredProducts.length} result
              {filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      <Featured products={filteredProducts} loading={loading} />
      <Trending products={filteredProducts} loading={loading} />

      {/* No Results State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            We couldn't find any events matching your current filters. Try adjusting your search or category.
          </p>
          <button 
            onClick={clearFilters}
            className="mt-6 px-6 py-2 rounded-full border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors text-sm font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      <Subscribe />

      <Footer />
    </div>
  );
}