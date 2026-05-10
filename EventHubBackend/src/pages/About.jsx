import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ExternalLink, Code2, Database, Palette, User, Mail } from "lucide-react";

export default function About() {
  const frontendTeam = [
    { name: "Youssef Hisham Mostafa", role: "Frontend Developer", initial: "YH", image: "/1jpeg.jpeg" },
    { name: " Youssef Mostafa Mohamed", role: "Frontend Developer", initial: "YW", image: "/2jpeg.jpeg" },
    { name: "Youssef Walid Taha", role: "Frontend Developer", initial: "YK", image: "/3.jpeg" },
    { name: "Youssef Kamal Abul Ela", role: "Frontend Developer", initial: "YM", image: "/4.jpeg" }
  ];

  const backendTeam = [
    { name: "Mariam Mostafa Mohamed", role: "Backend Developer", initial: "MM" },
    { name: "Abdullah Yakout", role: "Backend Developer", initial: "AY" }
  ];

  return (
    <div className="bg-[#030712] min-h-screen text-white font-body selection:bg-purple-500/30">
      <Navbar />
      
      <main className="pt-32 pb-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] -z-10 rounded-full" />
        <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] -z-10 rounded-full" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 text-center mb-32">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-[0.2em] uppercase mb-8">
            The Visionaries
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
            Meet the <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-400 to-white/50">Architects</span> <br /> 
            of <span className="text-purple-500">EventHub</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12">
            A specialized collective of designers and engineers dedicated to crafting the future of event management. We blend aesthetic precision with technical excellence.
          </p>
        </section>

        {/* Frontend Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <Palette className="text-purple-400" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Frontend Engineering</h2>
              <p className="text-slate-500 text-sm">UI/UX & Interactive Design</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {frontendTeam.map((member, idx) => (
              <div key={idx} className="group relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/20 to-transparent hover:from-purple-500/40 transition-all duration-500">
                <div className="h-full bg-slate-900/80 backdrop-blur-xl rounded-[31px] p-8 relative overflow-hidden border border-white/5">
                  {/* Image Placeholder */}
                  <div className="w-full aspect-[4/5] rounded-2xl mb-6 bg-slate-900 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-purple-500/30 transition-colors">
                    {member.image ? (
                        <img src={member.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                    ) : (

                        <>
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-6xl font-black text-white/10 group-hover:text-purple-500/20 transition-colors tracking-tighter">
                            {member.initial}
                            </span>
                        </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1 tracking-tight">{member.name}</h3>
                  <p className="text-purple-400 text-[10px] font-medium mb-6 uppercase tracking-widest">{member.role}</p>

                  <div className="flex gap-3">
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                      <User size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Backend Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Database className="text-blue-400" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Backend Architecture</h2>
              <p className="text-slate-500 text-sm">Scalability & Core Systems</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {backendTeam.map((member, idx) => (
              <div key={idx} className="group relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/20 to-transparent hover:from-blue-500/40 transition-all duration-500">
                <div className="h-full bg-slate-900/80 backdrop-blur-xl rounded-[31px] p-8 relative overflow-hidden border border-white/5">
                  <div className="flex gap-8 items-center">
                    <div className="w-32 h-32 shrink-0 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                      {member.image ? (
                        <img src={member.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                      ) : (

                        <span className="text-4xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors">
                            {member.initial}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1 tracking-tight">{member.name}</h3>
                      <p className="text-blue-400 text-sm font-medium mb-4 uppercase tracking-widest">{member.role}</p>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Tagline */}
        <section className="max-w-7xl mx-auto px-6 mt-40 text-center">
          <div className="p-20 rounded-[60px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Crafting with Heart. <br /> Building with <span className="italic text-purple-400 font-serif">Passion.</span></h2>
            <p className="text-slate-500 max-w-2xl mx-auto">© 2026 EventHub Creative Team. All names, trademarks and designs are property of their respective creators.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
