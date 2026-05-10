import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Share2, MapPin, Calendar, Clock, Ticket as TicketIcon, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TicketSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  
  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, [booking, navigate]);

  if (!booking) return null;

  // Use the QR code from the booking data or fallback to a generator
  const qrCodeUrl = booking.qrCodeImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.id}`;

  return (
    <div className="bg-black min-h-screen text-white font-body selection:bg-purple-500/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        {/* Success Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
            Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Successful</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Your tickets have been secured and a digital copy has been sent to your email.
          </p>
        </div>

        {/* Digital Ticket Card */}
        <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {/* Glassmorphism Container */}
          <div className="relative z-10 p-8 md:p-12 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row gap-12">
            
            {/* Left Side: QR Code & Main Info */}
            <div className="flex-1 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-400 tracking-widest uppercase w-fit">
                  Confirmed Booking
                </div>
                <h2 className="text-3xl font-black tracking-tight">{booking.eventTitle}</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Date & Time</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    {new Date(booking.bookedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    8:00 PM - 11:00 PM
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Ticket Type</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <TicketIcon className="w-4 h-4 text-pink-400" />
                    {booking.ticketType || 'Standard Entry'}
                  </div>
                  <p className="text-xs text-slate-400">{booking.quantity}x Tickets</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Venue Location</p>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Metropol Arena, City Center
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Customer</p>
                  <p className="font-bold">Verified Participant</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Booking ID</p>
                  <p className="font-mono text-xs text-slate-400">{booking.id.substring(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Right Side: QR Code Visual */}
            <div className="w-full md:w-64 flex flex-col items-center justify-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="p-4 bg-white rounded-2xl">
                <img 
                  src={qrCodeUrl} 
                  alt="Ticket QR Code" 
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Entry Pass Code</p>
                <p className="font-mono font-bold text-purple-400 tracking-widest">{booking.qrCode || 'E-TICKET-V1'}</p>
              </div>
              <div className="w-full h-px bg-white/10" />
              <p className="text-[9px] text-center text-slate-500 leading-relaxed">
                Present this QR code at the entrance for verification. Do not share this ticket.
              </p>
            </div>
          </div>

          {/* Ticket Aesthetic "Cutouts" */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-black z-20 border-r border-white/10 hidden md:block" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-black z-20 border-l border-white/10 hidden md:block" />
          
          {/* Dash line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/10 z-0 hidden md:block" />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Ticket
          </button>
          <Link to="/" className="w-full sm:w-auto px-8 py-4 text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
