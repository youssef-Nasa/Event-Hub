import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  Monitor, 
  Users, 
  Calendar, 
  UserSquare2,
  CalendarCheck,
  AlertTriangle,
  Search,
  Bell,
  Activity,
  LogOut
} from 'lucide-react';

export default function AdminConsole() {
  const { user: currentUser, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'events', 'organizers'

  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/100';
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes, organizersRes, activitiesRes] = await Promise.all([
        API.get('/v1/admin/dashboard/stats'),
        API.get('/v1/admin/events/pending'),
        API.get('/v1/admin/organizers/pending'),
        API.get('/v1/admin/moderation/activities')
      ]);
      setStats(statsRes.data);
      setEvents(eventsRes.data);
      setOrganizers(organizersRes.data);
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleApproveEvent = async (id) => {
    try {
      await API.post(`/v1/admin/events/${id}/approve`);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      alert("Failed to approve event");
    }
  };

  const handleRejectEvent = async (id) => {
    try {
      await API.post(`/v1/admin/events/${id}/reject`);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      alert("Failed to reject event");
    }
  };

  const handleApproveOrganizer = async (id) => {
    try {
      await API.post(`/v1/admin/organizers/${id}/approve`);
      setOrganizers(organizers.filter(o => o.id !== id));
    } catch (err) {
      alert("Failed to approve organizer");
    }
  };

  const handleRejectOrganizer = async (id) => {
    try {
      await API.post(`/v1/admin/organizers/${id}/reject`);
      setOrganizers(organizers.filter(o => o.id !== id));
    } catch (err) {
      alert("Failed to reject organizer");
    }
  };

  return (
    <div className="min-h-screen bg-[#06030F] text-slate-300 flex font-body relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0A0713]/80 backdrop-blur-2xl border-r border-slate-800/40 flex flex-col justify-between py-8 shrink-0 z-10 relative">
        <div>
          <div className="px-6 mb-12 flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
               <span className="text-white font-bold text-lg">E</span>
             </div>
             <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 tracking-tight leading-none mb-1">EventHub</h1>
                <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Admin Console</p>
             </div>
          </div>

          <div className="space-y-1 mt-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-6 py-4 border-l-[3px] transition-all ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500 text-purple-300 font-bold' : 'border-transparent text-slate-500'}`}>
              <Monitor size={18} />
              Dashboard
            </button>

            <div className="mt-8 mb-4 px-6">
              <h2 className="text-xs text-slate-500 uppercase tracking-widest font-bold">Queues</h2>
            </div>
            
            <button 
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors font-medium ${activeTab === 'events' ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Calendar size={18} />
              Pending Events
            </button>
            <button 
              onClick={() => setActiveTab('organizers')}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors font-medium ${activeTab === 'organizers' ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <UserSquare2 size={18} />
              Pending Organizers
            </button>
          </div>
        </div>


        <div className="px-6 flex items-center gap-3 relative mt-10">
          <div className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center overflow-hidden text-purple-400 font-bold">
             {currentUser?.firstName?.[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{currentUser?.firstName} {currentUser?.lastName}</p>
            <p className="text-xs text-slate-500 font-medium">System Admin</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-colors rounded-xl font-bold text-xs uppercase tracking-widest"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT (MIDDLE) */}
      <main className="flex-1 p-8 lg:p-12 border-r border-slate-800/40 flex flex-col overflow-y-auto z-10 relative">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Executive Dashboard</h1>
            <p className="text-slate-400 text-lg">Real-time system oversight and moderation queue.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-11 h-11 rounded-full bg-slate-900/50 hover:bg-slate-800 flex items-center justify-center border border-slate-700/50 transition-colors backdrop-blur-md">
              <Bell size={20} className="text-slate-300" />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-[#0A0713]"></span>
            </button>
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Total Users */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-7 shadow-xl shadow-black/20">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center">
                <Users size={22} className="text-purple-400" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">{stats?.totalUsers?.growthPercentage || "+0%"}</span>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-1">{stats?.totalUsers?.count || "0"}</h3>
            <p className="text-sm text-slate-400 font-medium tracking-wide">TOTAL USERS</p>
          </div>

          {/* Card 2: Active Events */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-7 shadow-xl shadow-black/20">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/20 flex items-center justify-center">
                <CalendarCheck size={22} className="text-pink-400" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold border border-pink-500/20">{stats?.activeEvents?.growthPercentage || "+0%"}</span>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-1">{stats?.activeEvents?.count || "0"}</h3>
            <p className="text-sm text-slate-400 font-medium tracking-wide">ACTIVE EVENTS</p>
          </div>

          {/* Card 3: System Alerts */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-rose-900/30 rounded-3xl p-7 shadow-xl shadow-black/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-2xl rounded-full"></div>
            <div className="flex justify-between items-start mb-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle size={22} className="text-rose-400" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">{stats?.systemAlerts?.status || "Normal"}</span>
            </div>
            <h3 className="text-4xl font-extrabold text-white mb-1 relative">{stats?.systemAlerts?.count || "00"}</h3>
            <p className="text-sm text-slate-400 font-medium tracking-wide relative">SYSTEM ALERTS</p>
          </div>
        </div>

        {/* PENDING APPROVAL QUEUE (TABLE) */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8 flex-1 shadow-xl shadow-black/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Pending {activeTab === 'organizers' ? 'Organizers' : 'Events'} Queue</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-widest">
                  <th className="pb-5 font-semibold w-2/5">{activeTab === 'organizers' ? 'Name' : 'Title'}</th>
                  <th className="pb-5 font-semibold w-1/5">{activeTab === 'organizers' ? 'Email' : 'Organizer'}</th>
                  <th className="pb-5 font-semibold w-1/5">Date Submitted</th>
                  <th className="pb-5 font-semibold text-right w-1/5">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeTab !== 'organizers' ? (
                  events.length === 0 ? (
                    <tr><td colSpan="4" className="py-10 text-center text-slate-500">No pending events.</td></tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id} className="border-b border-slate-800/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <img src={getImageUrl(event.image)} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-slate-800" />
                            <span className="font-bold text-white text-base">{event.title}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-300 font-medium">{event.organizer}</td>
                        <td className="py-4 text-slate-400 text-sm">{event.dateSubmitted}</td>
                        <td className="py-4">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => handleApproveEvent(event.id)} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold transition-all">Approve</button>
                            <button onClick={() => handleRejectEvent(event.id)} className="px-5 py-2.5 bg-slate-800/50 text-slate-300 rounded-xl border border-slate-700/50 text-sm font-bold transition-all">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  organizers.length === 0 ? (
                    <tr><td colSpan="4" className="py-10 text-center text-slate-500">No pending organizers.</td></tr>
                  ) : (
                    organizers.map((org) => (
                      <tr key={org.id} className="border-b border-slate-800/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-bold text-white">{org.firstName} {org.lastName}</td>
                        <td className="py-4 text-slate-300 font-medium">{org.email}</td>
                        <td className="py-4 text-slate-400 text-sm">{new Date(org.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => handleApproveOrganizer(org.id)} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold transition-all">Approve</button>
                            <button onClick={() => handleRejectOrganizer(org.id)} className="px-5 py-2.5 bg-slate-800/50 text-slate-300 rounded-xl border border-slate-700/50 text-sm font-bold transition-all">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* 3. RIGHT SIDEBAR */}
      <aside className="w-[360px] bg-[#0A0713]/90 backdrop-blur-2xl p-8 shrink-0 overflow-y-auto flex flex-col z-10 border-l border-slate-800/40">
        
        {/* Recent Activities Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity className="text-purple-400" size={18} />
              <h3 className="text-white font-bold text-lg">Moderation</h3>
            </div>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold border border-purple-500/20 uppercase tracking-tighter">Live</span>
          </div>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center py-8">
                <p className="text-xs text-slate-500 font-medium">No recent activities</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer relative overflow-hidden">
                  <div className={`absolute left-0 top-0 w-1 h-full ${
                    activity.colorTheme === 'orange' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{activity.title}</h4>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      activity.colorTheme === 'orange' ? 'text-orange-500' : 'text-blue-500'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{activity.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Site Health Footer */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-purple-400" size={18} />
            <h3 className="text-white font-bold text-lg">Site Health</h3>
          </div>

          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-400 tracking-wider">SERVER LOAD</span>
                <span className="text-xs font-bold text-purple-400">
                  {stats?.siteHealth?.serverLoad?.status || "Optimal"} ({stats?.siteHealth?.serverLoad?.percentage || 24}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                  style={{width: `${stats?.siteHealth?.serverLoad?.percentage || 24}%`}}>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-400 tracking-wider">API RESPONSE</span>
                <span className="text-xs font-bold text-pink-400">{stats?.siteHealth?.apiResponseTime?.timeMs || "98"}ms</span>
              </div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                <div className="h-full bg-gradient-to-r from-pink-600 to-pink-400 rounded-full w-[80%] shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
              </div>
            </div>

          </div>
        </div>

      </aside>
      
    </div>
  );
}
