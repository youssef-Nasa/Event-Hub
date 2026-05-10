import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake,
  LayoutDashboard,
  Calendar,
  Search,
  Bell,
  User,
  Image as ImageIcon,
  HelpCircle,
  LogOut,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Paperclip,
  Upload,
  Lightbulb,
  Plus
} from 'lucide-react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function CreateEvent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    dateAndTime: '',
    venueLocation: '',
    priceUSD: '',
    ticketCapacity: '',
    imageCoverUrl: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/events/categories');
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const { data } = await API.post('/upload/event-cover', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, imageCoverUrl: data.fileUrl }));
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status = 'PUBLISHED') => {
    setLoading(true);
    setError('');
    
    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: selectedCategory ? selectedCategory.name : '',
        dateAndTime: new Date(formData.dateAndTime).toISOString(),
        venueLocation: formData.venueLocation,
        priceUSD: parseFloat(formData.priceUSD),
        ticketCapacity: parseInt(formData.ticketCapacity),
        imageCoverUrl: formData.imageCoverUrl,
        status: status
      };

      await API.post('/v1/organizer/events', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/organizer");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 flex font-body">

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0F0F12] border-r border-white/5 flex flex-col justify-between py-8 shrink-0">
        <div>
          <div className="px-6 mb-12">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-8">Event Studio</h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-700 bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
                {user?.firstName?.[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.firstName}</p>
                <p className="text-[10px] text-slate-500 font-medium">Verified Producer</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <a href="/organizer" className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
              <LayoutDashboard size={20} />
              Dashboard
            </a>
            <a href="/organizer/create-event" className="w-full flex items-center gap-3 px-6 py-3 bg-purple-500/10 text-purple-300 font-bold rounded-r-full mr-4">
              <Calendar size={20} />
              Events
            </a>
          </div>
        </div>

        <div className="px-6 space-y-4">
          <button className="w-full flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <HelpCircle size={18} />
            Help Center
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 text-rose-400 hover:text-rose-300 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center p-8 lg:px-12 border-b border-white/5 bg-[#0F0F12]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">{user?.firstName}'s Studio</h2>
            <span className="w-px h-6 bg-white/10"></span>
            <h2 className="text-xl font-bold text-purple-400">Create New Event</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="bg-[#1A1A1E] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-purple-500/50 w-64 transition-colors"
              />
            </div>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <button className="w-8 h-8 rounded-full bg-[#1A1A1E] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <User size={16} />
            </button>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
          
          {/* Left Column (Forms) */}
          <div className="flex-1 space-y-6">
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 font-bold mb-6">
                Event created successfully! Redirecting...
              </div>
            )}
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 font-bold mb-6">
                {error}
              </div>
            )}

            <div className="text-sm text-slate-500 mb-6">
              Events &rsaquo; <span className="text-slate-300">New Event</span>
            </div>

            {/* Event Details Form */}
            <div className="bg-[#0F0F12] border border-white/5 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Event Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">Event Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a catchy title for your event"
                    className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 px-5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the vibe, the line-up, and why people should come..."
                    className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 px-5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-purple-400 mb-2">Category</label>
                    <div className="relative">
                      <select 
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 px-5 text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors font-medium appearance-none"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-400 mb-2">Date and Time</label>
                    <div className="relative">
                      <input 
                        type="datetime-local" 
                        name="dateAndTime"
                        value={formData.dateAndTime}
                        onChange={handleChange}
                        className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 px-5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">Venue / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      name="venueLocation"
                      value={formData.venueLocation}
                      onChange={handleChange}
                      placeholder="Physical address or digital link"
                      className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 pl-12 pr-5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-purple-400 mb-2">Pricing (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="number" 
                        name="priceUSD"
                        value={formData.priceUSD}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 pl-12 pr-5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-400 mb-2">Ticket Capacity</label>
                    <div className="relative">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="number" 
                        name="ticketCapacity"
                        value={formData.ticketCapacity}
                        onChange={handleChange}
                        placeholder="Number of attendees"
                        className="w-full bg-[#16161A] border border-white/5 rounded-xl py-4 pl-12 pr-5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors font-medium"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Attachments */}
            <div className="bg-[#0F0F12] border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Paperclip className="text-purple-400" size={20} /> Attachments
              </h3>
              
              <div className="border border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center bg-[#16161A]/50 hover:bg-[#16161A] transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-slate-400" size={20} />
                </div>
                <p className="text-white font-bold mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500">PDF, DOC, or TXT up to 10MB (Sponsors deck, artist riders, etc.)</p>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebars / Previews) */}
          <div className="w-full xl:w-[380px] space-y-6">
            
            {/* Cover Image Upload */}
            <div className="bg-[#0F0F12] border border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4">COVER IMAGE</h3>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div 
                onClick={() => fileInputRef.current.click()}
                className="h-64 border border-dashed border-white/10 rounded-2xl bg-[#16161A] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer mb-6"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] to-transparent z-10 opacity-60"></div>
                )}
                
                <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent border border-purple-500/20 flex items-center justify-center mb-4 z-20">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ImageIcon className="text-purple-400" size={24} />
                  )}
                </div>
                <p className="text-white font-bold z-20 mb-1">{uploading ? 'Uploading...' : 'Upload event poster'}</p>
                <p className="text-[10px] text-slate-500 z-20">Recommended: 1200 x 630px</p>
              </div>
            </div>

            {/* Preview Mode */}
            <div className="bg-[#0F0F12] border border-white/5 rounded-3xl p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-purple-400 uppercase">Preview Mode</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-rose-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Live Preview
                </span>
              </div>

              <div className="rounded-xl h-32 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 mb-6 overflow-hidden relative">
                 {imagePreview ? (
                   <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent mix-blend-overlay"></div>
                 )}
              </div>

              <h4 className="text-xl font-bold text-white mb-4">{formData.title || "Your Event Title Here"}</h4>
              
              <div className="space-y-3 mb-8">
                <p className="text-sm text-slate-400 flex items-center gap-3">
                  <Calendar size={14} className="text-slate-500" /> {formData.dateAndTime ? new Date(formData.dateAndTime).toLocaleString() : "Set a date..."}
                </p>
                <p className="text-sm text-slate-400 flex items-center gap-3">
                  <MapPin size={14} className="text-slate-500" /> {formData.venueLocation || "Location tbd..."}
                </p>
              </div>

              <div className="flex justify-between items-center mb-8 border-t border-white/5 pt-4">
                <span className="text-lg font-bold text-purple-400">${formData.priceUSD || "0.00"}</span>
                <span className="text-xs font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">+{formData.ticketCapacity || "0"}</span>
              </div>

              {/* Attachments Section */}
                <div className="bg-[#18181E] border border-white/5 rounded-2xl p-6 mt-8">
                  <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle size={16} className="text-purple-400" />
                    Event Attachments
                  </h4>
                  <p className="text-xs text-slate-500 mb-6">Upload event materials, schedules, or PDFs for participants.</p>
                  
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      multiple 
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        if (files.length === 0) return;
                        
                        const formData = new FormData();
                        files.forEach(f => formData.append('files', f));
                        
                        try {
                          await API.post('/upload/event-images', formData); // Reusing upload for now or create specific
                          alert("Attachments uploaded successfully!");
                        } catch (err) {
                          alert("Failed to upload attachments");
                        }
                      }}
                      className="hidden" 
                      id="attachments-upload" 
                    />
                    <label 
                      htmlFor="attachments-upload"
                      className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Plus size={24} className="text-slate-500" />
                      <span className="text-sm font-medium text-slate-400">Add Materials (PDF, DOC, JPG)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => handleSubmit('PUBLISHED')}
                    disabled={loading || uploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-3 group"
                  >
                    {loading ? "Creating..." : "Launch Event"}
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>
                  <p className="text-center text-[10px] text-slate-600 uppercase font-bold tracking-widest mt-4">
                    Your event will be submitted for admin review
                  </p>
                </div>

              <div className="space-y-3">
                <button 
                   onClick={() => handleSubmit('DRAFT')}
                   disabled={loading}
                   className="w-full py-4 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span className="w-4 h-4 border-2 border-current rounded-sm"></span> Save Draft
                </button>
              </div>

              {/* Pro Tip */}
              <div className="bg-[#1A1108] border border-orange-500/20 rounded-3xl p-6">
                <div className="flex gap-4">
                  <Lightbulb className="text-orange-400 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-orange-400 font-bold text-sm mb-2">Pro Tip</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">Events with detailed descriptions and high-quality cover images sell up to 40% more tickets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
