import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "./SettingsModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-shadow">
            E
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Event<span className="text-purple-400">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", path: "/" },
            { name: "My Tickets", path: "/my-tickets" },
            { name: "About", path: "/about" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-slate-300 text-sm font-medium hover:text-white transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'Admin' && (
                <Link to="/admin" className="text-purple-400 text-sm font-bold uppercase tracking-widest hover:text-purple-300">Admin</Link>
              )}
              {user.role === 'Organizer' && (
                <Link to="/organizer" className="text-pink-400 text-sm font-bold uppercase tracking-widest hover:text-pink-300">Organizer</Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-medium">{user.firstName}</span>
                <button 
                  onClick={() => setSettingsOpen(true)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors group/settings"
                >
                  <svg className="w-4 h-4 text-slate-500 group-hover/settings:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 border border-slate-700 rounded-full text-slate-300 text-sm font-medium hover:text-white hover:border-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 text-sm font-medium hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white flex flex-col gap-1.5"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-transform ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-opacity ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-transform ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 pb-6 pt-2 animate-fadeIn">
          {[
            { name: "Home", path: "/" },
            { name: "My Tickets", path: "/my-tickets" },
            { name: "About", path: "/about" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-slate-300 text-sm font-medium hover:text-white border-b border-white/5 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex gap-3 mt-4">
            <Link
              to="/login"
              className="flex-1 text-center py-2.5 border border-slate-700 rounded-full text-sm text-white hover:bg-white/5 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm text-white font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </nav>
  );
}
