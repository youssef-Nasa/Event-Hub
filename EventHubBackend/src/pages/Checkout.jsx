import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CreditCard, Wallet, Plus, Minus, ArrowLeft, ShieldCheck, Ticket } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/api";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedTier, bookingId, initialQuantity } = location.state || {};
  const [error, setError] = useState(null); // New state for UI errors

  const [quantity, setQuantity] = useState(initialQuantity || 1);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  // Calculate prices
  const ticketPrice = selectedTier === "VIP" ? Math.round(product?.price * 2.5) : (product?.price || 149);
  const subtotal = ticketPrice * quantity;
  const serviceFee = (subtotal * 0.08).toFixed(2);
  const tax = (subtotal * 0.05).toFixed(2);
  const total = bookingId ? location.state.totalPrice : (parseFloat(subtotal) + parseFloat(serviceFee) + parseFloat(tax)).toFixed(2);


  useEffect(() => {
    if (!product) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, [product, navigate]);

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    if (formatted.length > 19) formatted = formatted.substring(0, 19);
    setFormData({ ...formData, number: formatted });
  };

  const getCardType = (number) => {
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "Mastercard";
    return "Unknown";
  };

  const handleConfirmPurchase = async () => {
    if (paymentMethod === "card" && (!formData.number || !formData.cvv)) {
      setError("Please fill in card details");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the booking (if not already created)
      let booking;
      if (bookingId) {
        booking = { id: bookingId, eventTitle: product.title }; // Minimal object for success page
      } else {
        const bookingRes = await API.post("/bookings", {
          eventId: product.id,
          ticketType: selectedTier || "Standard",
          quantity: quantity
        });
        booking = bookingRes.data;
      }


      // 2. Process the payment
      const paymentData = paymentMethod === "card" ? {
        bookingId: booking.id,
        cardNumber: formData.number.replace(/\s/g, ""),
        cardHolderName: formData.name,
        expiryMonth: formData.expiry.split("/")[0]?.trim() || "12",
        expiryYear: formData.expiry.split("/")[1]?.trim() || "25",
        cvv: formData.cvv,
        billingAddress: "Test Address"
      } : {
        bookingId: booking.id,
        cardNumber: "WALLET_DUMMY_ID",
        cardHolderName: "Digital Wallet User",
        expiryMonth: "01",
        expiryYear: "99",
        cvv: "000",
        billingAddress: "Digital Wallet"
      };

      const paymentRes = await API.post("/payment/process", paymentData);

      if (paymentRes.data.status === "Completed") {
        navigate("/ticket-success", { state: { booking, payment: paymentRes.data } });
      } else {
        setError(paymentRes.data.message || "Payment failed");
      }


    } catch (err) {
      console.error("Purchase error:", err);
      setError(err.response?.data?.message || "Purchase failed. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };


  if (!product) return null;

  return (
    <div className="bg-black min-h-screen text-white font-body selection:bg-purple-500/30">
      <Navbar />
      
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">

        {/* Breadcrumb / Back */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Events / {product.title} / Checkout
        </button>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Checkout Form */}
          <div className="flex-1 space-y-12">
            
            <header>
              <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
                Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Checkout</span>
              </h1>
              <p className="text-slate-400 max-w-md">
                Complete your order to secure your spot at the year's most anticipated digital experience.
              </p>
            </header>

            {/* 1. Ticket Quantity */}
            {!bookingId && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold uppercase tracking-widest text-slate-300">Select Quantity</h2>
                </div>

                <div className="p-6 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 hidden sm:block">
                      <img src={product.imageCover} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedTier === "VIP" ? "VIP Backstage" : "General Admission"}</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                        {selectedTier === "VIP" ? "All-access • VIP Entry • Backstage" : "Full festival access • Standard Entry"}
                      </p>
                      <p className="text-purple-400 font-bold mt-2">${ticketPrice}.00 <span className="text-slate-500 font-normal text-xs uppercase tracking-widest ml-1">per ticket</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-2 rounded-2xl bg-white/5 border border-white/10">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-black w-8 text-center tabular-nums">{String(quantity).padStart(2, '0')}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center hover:bg-purple-400 transition-colors shadow-lg shadow-purple-500/20"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            )}


            {/* 2. Payment Method */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-300">Payment Method</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                    paymentMethod === "card" 
                    ? "bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/20" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className={paymentMethod === "card" ? "text-purple-400" : "text-slate-500"} />
                      {paymentMethod === "card" && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-bold">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Secure Stripe payment</p>
                  </div>
                  {/* Decorative Glow */}
                  {paymentMethod === "card" && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px] -mr-10 -mt-10" />
                  )}
                </button>

                <button 
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-6 rounded-3xl border text-left transition-all ${
                    paymentMethod === "wallet" 
                    ? "bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/20" 
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Wallet className={paymentMethod === "wallet" ? "text-purple-400" : "text-slate-500"} />
                    {paymentMethod === "wallet" && (
                       <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                       </div>
                    )}
                  </div>
                  <p className="font-bold">Digital Wallet</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Apple Pay, Google Pay</p>
                </button>
              </div>

              {/* Card Form UI */}
              {paymentMethod === "card" && (
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="ALEX RIVERA"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all uppercase"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Card Number</label>
                    <div className="relative">
                       <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all font-mono"
                        value={formData.number}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                        {getCardType(formData.number) === "Visa" && <span className="text-[10px] font-black text-blue-400 italic">VISA</span>}
                        {getCardType(formData.number) === "Mastercard" && <span className="text-[10px] font-black text-orange-400 italic">MC</span>}
                        <CreditCard className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM / YY"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all font-mono"
                        value={formData.expiry}
                        onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">CVV</label>
                      <input 
                        type="password" 
                        placeholder="***"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm placeholder:text-slate-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all font-mono"
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Side: Order Summary (Sticky) */}
          <aside className="w-full lg:w-[450px]">
             <div className="sticky top-28 space-y-6">
                
                <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                   {/* Glow background */}
                   <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px]" />

                   <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-bold uppercase tracking-tight">Order Summary</h3>
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Secure Checkout
                      </div>
                   </div>

                   {/* Event Mini Info */}
                   <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 mb-10">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 relative">
                        <img src={product.imageCover} className="w-full h-full object-cover" alt="" />
                        <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-black">
                          {quantity}
                        </div>
                      </div>
                      <div className="min-w-0">
                         <h4 className="font-bold text-sm line-clamp-1">{product.title}</h4>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Oct 24 • Los Angeles, CA</p>
                      </div>
                      <div className="ml-auto text-sm font-black tabular-nums">
                        ${subtotal}.00
                      </div>
                   </div>

                   {/* Price breakdown */}
                   <div className="space-y-4 mb-10 text-sm">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span className="font-mono">${subtotal}.00</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Service Fee</span>
                        <span className="font-mono">${serviceFee}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 pb-4 border-bottom border-white/10">
                        <span>Tax</span>
                        <span className="font-mono">${tax}</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between items-end pt-2">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Amount</p>
                          <p className="text-5xl font-black tracking-tighter leading-none">${total}</p>
                        </div>
                        <div className="pb-1">
                           <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[9px] font-black text-orange-400 uppercase tracking-tighter">
                              Selling Fast
                           </span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-600 italic mt-2">Inclusive of all local and state taxes</p>
                   </div>

                   <button 
                    onClick={handleConfirmPurchase}
                    disabled={loading || product.status === "SoldOut" || quantity > (selectedTier === "VIP" ? product.vipRemaining : product.standardRemaining)}
                    className={`w-full py-5 rounded-3xl transition-all font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-2xl relative group ${
                      (product.status === "SoldOut" || quantity > (selectedTier === "VIP" ? product.vipRemaining : product.standardRemaining))
                      ? "bg-slate-800 cursor-not-allowed opacity-50 shadow-none"
                      : "bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-purple-500/20 hover:shadow-purple-500/40"
                    }`}
                   >
                     {loading ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                       <>
                         <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         {product.status === "SoldOut" ? "SOLD OUT" : "Confirm Purchase"}
                       </>
                     )}
                   </button>

                   <div className="flex items-center justify-center gap-4 mt-8 opacity-30 grayscale">
                      <CreditCard className="w-5 h-5" />
                      <div className="w-px h-4 bg-white/30" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/MasterCard_logo.png" className="h-4 object-contain" alt="" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 object-contain" alt="" />
                   </div>
                   
                   <p className="text-[10px] text-center text-slate-500 uppercase font-bold tracking-widest mt-8 flex items-center justify-center gap-2">
                       <ShieldCheck className="w-3 h-3 text-emerald-500" />
                       SSL Encrypted & Secure Payment
                   </p>
                </div>

                {/* Proof Widget */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     14 people viewing this event right now
                   </p>
                </div>

             </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
