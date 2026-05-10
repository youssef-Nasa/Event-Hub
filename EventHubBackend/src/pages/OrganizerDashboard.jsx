import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Archive, 
  LayoutDashboard,
  Plus,
  Calendar,
  Ticket,
  DollarSign,
  LogOut
} from 'lucide-react';

export default function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        API.get('/v1/organizer/dashboard/stats'),
        API.get('/v1/organizer/dashboard/activities')
      ]);
      setStats(statsRes.data);
      
      // Map backend activities
      const mappedActivities = (activitiesRes.data || []).map(b => ({
        id: b.id,
        user: b.user,
        avatar: b.avatarUrl || `https://i.pravatar.cc/150?u=${b.user}`,
        action: b.actionText,
        target: b.eventName,
        time: b.timeAgo,
        amount: b.amount,
        status: b.status,
        statusColor: b.status === 'Confirmed' || b.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
      }));
      setActivities(mappedActivities);
      
    } catch (err) {
      console.error("Organizer data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E12] text-slate-300 flex font-body">

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0F0F12] border-r border-white/5 flex flex-col justify-between py-8 shrink-0 relative z-20">
        <div>
          <div className="px-6 mb-12">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-8">Event Studio</h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-700 bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                {user?.firstName?.[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.firstName}</p>
                <p className="text-[10px] text-slate-500 font-medium">Verified Producer</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <a href="/organizer" className="w-full flex items-center gap-3 px-6 py-3 bg-white/5 border-l-2 border-indigo-500 text-white font-medium">
              <LayoutDashboard size={20} className="text-indigo-400" />
              Dashboard
            </a>
            <a href="/organizer/create-event" className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
              <Calendar size={20} />
              Events
            </a>
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

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="flex justify-between items-start mb-10 max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Morning, {user?.firstName}</h1>
            <p className="text-slate-400 text-sm">
              Your events are generating <span className="text-purple-400 font-semibold">{stats?.engagementMessage || "12% more engagement"}</span> today.
            </p>
          </div>
          <a href="/organizer/create-event" className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5">
            <Plus size={18} />
            Create Event
          </a>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* TOP STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#18181E] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Calendar size={20} className="text-indigo-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold border border-orange-500/20">{stats?.totalEvents?.growth || "+0 this month"}</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL EVENTS</p>
              <h3 className="text-3xl font-extrabold text-white">{stats?.totalEvents?.count || "0 Active"}</h3>
            </div>

            <div className="bg-[#18181E] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Ticket size={20} className="text-blue-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">{stats?.ticketsSold?.growth || "+0 today"}</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">TICKETS SOLD</p>
              <h3 className="text-3xl font-extrabold text-white">{stats?.ticketsSold?.count || "0"}</h3>
            </div>

            <div className="bg-[#18181E] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <DollarSign size={20} className="text-orange-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">{stats?.totalRevenue?.growth || "0%"} Growth</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">TOTAL REVENUE</p>
              <h3 className="text-3xl font-extrabold text-white">{stats?.totalRevenue?.amount || "$0.00"}</h3>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="max-w-6xl mx-auto pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="bg-[#18181E] border border-white/5 p-10 rounded-2xl text-center text-slate-500">No recent activity detected.</div>
              ) : (
                activities.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-[#18181E] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">{item.user[0]}</div>
                      <div>
                        <p className="text-sm text-slate-300">
                          <span className="font-bold text-white">{item.user}</span> {item.action} <span className="font-bold text-white">{item.target}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-sm mb-1">{item.amount}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
