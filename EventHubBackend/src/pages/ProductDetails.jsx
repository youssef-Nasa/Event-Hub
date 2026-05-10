import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState("Standard"); // New state for tier selection
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/events/${id}/reviews`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  const submitReview = async () => {
    if (!newReview.comment.trim()) return;
    try {
      await API.post(`/participants/reviews`, {
        eventId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: "" });
      // Refresh reviews
      fetchReviews();
      // Refresh event data for average rating
      const res = await API.get(`/events/${id}`);
      setProduct(mapEvent(res.data));
    } catch (err) {
      console.error("Review error:", err);
      alert(err.response?.data?.message || "Failed to submit review. Please try again.");
    }
  };

  const toggleFavorite = async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await API.delete(`/events/${id}/favorite`);
        setIsFavorite(false);
      } else {
        await API.post(`/events/${id}/favorite`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBuyTickets = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/checkout", { state: { product } });
    } else {
      navigate("/login");
    }
  };

  // Countdown State (Mocked)
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    mins: 45,
    secs: 32,
  });

  // Data mapping utility
  const mapEvent = (e) => ({
    _id: e.id,
    id: e.id,
    title: e.title,
    description: e.description,
    price: e.ticketTiers?.[0]?.price || e.ticketPrice || 0,
    imageCover: e.imageCoverUrl && e.imageCoverUrl.startsWith('http') ? e.imageCoverUrl : (e.imageCoverUrl ? `http://localhost:8080${e.imageCoverUrl}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'),
    category: { name: e.category },
    venue: e.location?.venueName || "Cyber Arena",
    date: e.eventDate,
    organizer: e.organizer?.name || "EventHub Productions",
    updatedAt: e.eventDate,
    standardRemaining: e.standardRemaining,
    vipRemaining: e.vipRemaining,
    status: e.status,
    averageRating: e.averageRating,
    totalReviews: e.totalReviews
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    API.get(`/events/${id}`)
      .then((res) => {
        setProduct(mapEvent(res.data));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch event error:", err);
        setLoading(false);
      });

    fetchReviews();

    // Simple countdown effect
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [id]);


  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/" className="text-purple-400 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-body selection:bg-purple-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end pb-20 overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-full object-cover scale-105 blur-sm opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-6 backdrop-blur-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured Experience
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-8 max-w-4xl">
            {product.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Date</p>
                <p className="font-semibold">{new Date(product.updatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Venue</p>
                <p className="font-semibold">{product.brand?.name || "Premium Venue"}, Neo-Cinema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Selling Status */}
        <div className="absolute top-40 right-10 hidden lg:block">
           <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 tracking-widest uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Selling Fast
           </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          
          {/* Main Content (Left) */}
          <div className="space-y-12">
            
            {/* Countdown Container */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Event starts in</h3>
                        <p className="text-slate-400 text-sm">Secure your spot before the countdown ends.</p>
                    </div>
                    <div className="flex gap-4 sm:gap-8">
                        {[
                          { label: 'Days', value: timeLeft.days },
                          { label: 'Hours', value: timeLeft.hours },
                          { label: 'Mins', value: timeLeft.mins },
                          { label: 'Secs', value: timeLeft.secs }
                        ].map(t => (
                          <div key={t.label} className="text-center">
                            <p className="text-3xl sm:text-4xl font-black tracking-tighter tabular-nums">{String(t.value).padStart(2, '0')}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{t.label}</p>
                          </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                About the Event
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
              </h2>
              <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <p>
                  Experience an immersive atmosphere where art meets innovation. This event features world-class audiovisual setups, 
                  holographic projections, and a curated selection of ambient soundscapes. Join over 5,000 attendees in this 
                  unforgettable cultural milestone.
                </p>
              </div>
            </section>

            {/* Organizer Section */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-6">Organizer</h3>
                <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-black">
                            {product.brand?.name?.[0] || 'E'}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">{product.brand?.name || "EventHub Productions"}</h4>
                            <p className="text-green-400 text-[10px] flex items-center gap-1 uppercase font-bold tracking-widest">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified Organizer
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-3 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all text-sm font-medium">
                        Contact Organizer
                    </button>
                </div>
            </div>

            {/* Venue Location Section */}
            <div className="relative h-[250px] rounded-3xl overflow-hidden border border-white/10 group">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  alt="Venue Map"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6">
                    <h4 className="font-bold text-xl mb-1">{product.brand?.name || "Cyber Arena"}</h4>
                    <p className="text-slate-400 text-xs">Sector 7, Neo-Tokyo Central</p>
                    <p className="text-purple-400 text-[10px] font-bold uppercase mt-3 flex items-center gap-2 italic">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        2.4 miles from your location
                    </p>
                </div>
                <div className="absolute bottom-6 right-6">
                    <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                       </svg>
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <section id="reviews" className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    Community Reviews
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
                </h2>
                
                {/* Add Review Form */}
                {localStorage.getItem('token') && (
                  <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 mb-8">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Share your experience</h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => setNewReview({...newReview, rating: star})}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${newReview.rating >= star ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-slate-600'}`}
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="What did you think of the event?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-500/50 transition-colors h-24 resize-none"
                      />
                      <button 
                        onClick={submitReview}
                        className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                )}

                {reviews.length > 0 ? (
                    <div className="grid gap-6">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                            {review.user?.firstName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{review.user?.firstName} {review.user?.lastName}</p>
                                            <p className="text-[10px] text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-700'}`} viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 rounded-3xl bg-white/[0.01] border border-dashed border-white/10 text-center">
                        <p className="text-slate-500 text-sm">No reviews yet for this event.</p>
                    </div>
                )}

            </section>

          </div>

          {/* Sidebar (Right) */}
          <aside className="relative">
            <div className="sticky top-28 space-y-6">
              
              {/* Ticket Card */}
              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Starting from</p>
                        <p className="text-3xl font-black tracking-tighter">${product.price}.00</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                        Limited Tier
                    </div>
                </div>

                {/* Tiers */}
                <div className="space-y-3 mb-8">
                    <div 
                      onClick={() => setSelectedTier("Standard")}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${selectedTier === "Standard" ? 'bg-white/10 border-white/30 ring-1 ring-white/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedTier === "Standard" ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                                <svg className={`w-5 h-5 ${selectedTier === "Standard" ? 'text-white' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <div>
                                <span className={`text-sm font-semibold block ${selectedTier === "Standard" ? 'text-white' : 'text-slate-200'}`}>Standard Pass</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${product.standardRemaining < 10 ? 'text-orange-500' : 'text-slate-500'}`}>
                                    {product.standardRemaining} Left
                                </span>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${selectedTier === "Standard" ? 'text-white' : 'text-slate-400'}`}>${product.price}</span>
                    </div>

                    <div 
                      onClick={() => setSelectedTier("VIP")}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${selectedTier === "VIP" ? 'bg-purple-500/20 border-purple-500/50 ring-1 ring-purple-500/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedTier === "VIP" ? 'bg-purple-500' : 'bg-slate-800'}`}>
                                <svg className={`w-5 h-5 ${selectedTier === "VIP" ? 'text-white' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div>
                                <span className={`text-sm font-semibold block ${selectedTier === "VIP" ? 'text-white' : 'text-slate-200'}`}>VIP Backstage</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${product.vipRemaining < 5 ? 'text-red-500' : 'text-purple-400'}`}>
                                    {product.vipRemaining} Left
                                </span>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${selectedTier === "VIP" ? 'text-white' : 'text-slate-400'}`}>${Math.round(product.price * 2.5)}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                  <button 
                  onClick={() => navigate('/checkout', { state: { product, selectedTier } })}
                  disabled={product.status === "SoldOut" || (selectedTier === "Standard" && product.standardRemaining === 0) || (selectedTier === "VIP" && product.vipRemaining === 0)}
                  className={`w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest text-sm shadow-xl transition-all ${
                    (product.status === "SoldOut" || (selectedTier === "Standard" && product.standardRemaining === 0) || (selectedTier === "VIP" && product.vipRemaining === 0))
                    ? "bg-slate-700 cursor-not-allowed opacity-50 shadow-none" 
                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 active:scale-[0.98]"
                  }`}
                >
                  {(product.status === "SoldOut" || (selectedTier === "Standard" && product.standardRemaining === 0) || (selectedTier === "VIP" && product.vipRemaining === 0)) ? "Sold Out" : "Secure Your Spot"}
                </button>
                  <button 
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isFavorite ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                  >
                    <svg className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                
                <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest mt-6">
                    Protected by EventHub Secure Checkout
                </p>
              </div>

              {/* Badges */}
              <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Instant ticket delivery via app</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">100% money back guarantee</span>
                  </div>
              </div>

            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
