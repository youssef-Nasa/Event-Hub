import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinks = {
    Platform: ["Discover", "Trending", "Categories", "Nearby Events"],
    Support: ["Help Center", "Privacy Policy", "Terms of Service", "Contact"],
    Organizers: ["Post Event", "Dashboard", "Analytics", "Pricing"],
  };

  return (
    <footer className="mt-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Event<span className="text-purple-400">Hub</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Discover and attend the most exciting events happening around you.
              Your gateway to unforgettable experiences.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {["twitter", "instagram", "facebook", "youtube"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/30 flex items-center justify-center transition-all duration-300"
                  >
                    <span className="text-slate-400 text-xs capitalize">
                      {social[0].toUpperCase()}
                    </span>
                  </a>
                )
              )}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 text-sm hover:text-purple-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © 2026 EventHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}