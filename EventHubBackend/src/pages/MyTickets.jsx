import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { Calendar, Ticket, User, QrCode, ArrowRight, Heart, Trash2 } from "lucide-react";

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "bookings") {
        const res = await API.get("/bookings/my-bookings");
        setBookings(res.data.bookings || []);
      } else {
        const res = await API.get("/participants/favorites");
        setFavorites(res.data.favoriteEvents || []);
      }
    } catch (err) {
      console.error("Error fetching tickets data:", err);
    } finally {
      setLoading(false);
      gsap.from(".ticket-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
  };

  const openPass = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white font-body selection:bg-purple-500/30">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] -z-10 rounded-full" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10 rounded-full" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-gradient-to-r from-purple-500 to-transparent"></div>
              <span className="text-purple-400 text-xs font-black uppercase tracking-[0.4em]">Vault</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
              Your <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">Inventory</span>
            </h1>
          </div>

          <div className="flex p-1.5 bg-white/[0.03] border border-white/10 rounded-[24px] backdrop-blur-2xl">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-10 py-4 rounded-[20px] text-sm font-black transition-all duration-500 flex items-center gap-2 ${
                activeTab === "bookings" 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/20 scale-105" 
                : "text-slate-500 hover:text-white"
              }`}
            >
              <Ticket size={18} />
              Passes
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-10 py-4 rounded-[20px] text-sm font-black transition-all duration-500 flex items-center gap-2 ${
                activeTab === "favorites" 
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/20 scale-105" 
                : "text-slate-500 hover:text-white"
              }`}
            >
              <Heart size={18} />
              Saved
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-[40px] bg-white/[0.02] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activeTab === "bookings" ? (
              bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TicketCard key={booking.id} booking={booking} onOpen={() => openPass(booking)} navigate={navigate} />
                ))

              ) : (
                <EmptyState icon={<Ticket size={48} />} title="No Tickets Found" message="Your collection is currently empty. Explore upcoming events to get started." />
              )
            ) : (
              favorites.length > 0 ? (
                favorites.map((fav) => (
                  <FavoriteCard key={fav.id} favorite={fav} onClick={() => navigate(`/product/${fav.eventId}`)} />
                ))
              ) : (
                <EmptyState icon={<Heart size={48} />} title="Wishlist is Empty" message="Save events you're interested in to keep track of them here." />
              )
            )}
          </div>
        )}
      </main>

      {/* Digital Pass Modal (Apple Wallet Style) */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl transition-all duration-500">
          <div className="relative w-full max-w-[400px] bg-[#0d1117] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.15)] animate-in slide-in-from-bottom-10 fade-in duration-500">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all z-20"
            >
              <Trash2 size={20} />
            </button>

            <div className="aspect-[4/3] relative overflow-hidden">
                <img src={selectedBooking.imageCoverUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-2">Confirmed Entry</p>
                    <h2 className="text-3xl font-black text-white leading-tight">{selectedBooking.eventTitle}</h2>
                </div>
            </div>
            
            <div className="p-10 -mt-10 relative z-10">
              <div className="bg-white rounded-[40px] p-8 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${selectedBooking.qrCode}`} 
                  alt="QR Code" 
                  className="w-full h-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Holder</p>
                  <p className="text-lg font-bold text-white">{user?.firstName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Ticket Type</p>
                  <p className="text-lg font-bold text-purple-400">{selectedBooking.ticketType}</p>
                </div>
              </div>

              <div className="py-6 border-y border-white/5 flex justify-between items-center">
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Pass ID</p>
                    <p className="text-sm font-mono text-slate-300">#EHB-{selectedBooking.qrCode}</p>
                 </div>
                 <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Verified</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function TicketCard({ booking, onOpen, navigate }) {
  const isPending = booking.status === "Pending";

  const handleAction = () => {
    if (isPending) {
        navigate("/checkout", { state: { 
            bookingId: booking.id, 
            product: { 
                id: booking.eventId, 
                title: booking.eventTitle, 
                imageCover: booking.imageCoverUrl,
                price: booking.eventPrice
            },
            selectedTier: booking.ticketType,
            initialQuantity: booking.quantity,
            totalPrice: booking.totalPrice
        }});
    } else {
        onOpen();
    }
  };

  return (
    <div className={`ticket-card group relative overflow-hidden rounded-[40px] border border-white/10 transition-all duration-700 bg-white/[0.06] hover:bg-white/[0.1] shadow-2xl ${
        isPending 
        ? "hover:border-orange-500/40" 
        : "hover:border-purple-500/40 shadow-purple-500/5"
    }`}>


      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
      
      <div className="p-10">
        <div className="flex justify-between items-start mb-10">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border flex items-center gap-1.5 ${
            isPending 
            ? "bg-orange-500/10 border-orange-500/20 text-orange-500" 
            : "bg-green-500/10 border-green-500/20 text-green-500"
          }`}>
            {!isPending && <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />}
            {booking.status}
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 opacity-80">Total</p>
            <p className="text-2xl font-black text-white">${booking.totalPrice}</p>
          </div>

        </div>

        <div className="mb-10">
            <h3 className="text-3xl font-black mb-3 group-hover:text-purple-400 transition-colors leading-[1.1] tracking-tighter">
                {booking.eventTitle}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Calendar size={14} className="text-purple-500" />
                {booking.eventDate}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/5 group-hover:border-purple-500/10 transition-colors">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Tier</p>
                <p className="text-sm font-bold text-purple-400">{booking.ticketType}</p>
            </div>
            <div className="p-5 rounded-[24px] bg-white/[0.03] border border-white/5 group-hover:border-purple-500/10 transition-colors flex items-center justify-center">
                <QrCode size={32} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>

        </div>

        <button 
          onClick={handleAction}
          className={`w-full py-5 rounded-[24px] font-black text-sm transition-all duration-500 flex items-center justify-center gap-3 ${
            isPending 
            ? "bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20" 
            : "bg-white text-black hover:bg-purple-500 hover:text-white shadow-2xl shadow-purple-500/0 hover:shadow-purple-500/40 active:scale-95"
          }`}
        >
          {isPending ? "Complete Payment" : "Access Digital Pass"}
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[100px] -z-10 group-hover:bg-purple-500/20 transition-all duration-700 rounded-full" />
    </div>
  );
}


function FavoriteCard({ favorite, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="ticket-card group relative overflow-hidden rounded-[40px] bg-white/[0.03] border border-white/10 hover:border-pink-500/40 transition-all duration-700 cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img 
          src={favorite.imageCoverUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"} 
          alt={favorite.eventTitle}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/20 to-transparent" />
        <div className="absolute top-8 right-8">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-pink-500/20">
            <Heart size={20} className="text-pink-500 fill-pink-500" />
          </div>
        </div>
      </div>

      <div className="p-10">
        <div className="flex items-center gap-2 text-pink-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
          {favorite.category}
        </div>
        
        <h3 className="text-3xl font-black mb-8 group-hover:text-pink-400 transition-colors leading-[1.1] tracking-tighter">
          {favorite.eventTitle}
        </h3>

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black">
               {favorite.organizerName?.charAt(0) || "O"}
             </div>
             <p className="text-sm text-slate-400 font-bold">{favorite.organizerName}</p>
          </div>
          <p className="text-2xl font-black text-white">${favorite.ticketPrice}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="col-span-full py-40 text-center rounded-[60px] border-2 border-dashed border-white/5 bg-white/[0.01]">
      <div className="inline-flex p-8 rounded-[32px] bg-white/[0.03] border border-white/5 text-purple-500 mb-8 animate-bounce">
        {icon}
      </div>
      <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">{title}</h3>
      <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">{message}</p>
    </div>
  );
}
