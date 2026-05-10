import { useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import gsap from "gsap";

export default function SettingsModal({ isOpen, onClose }) {
  const { user, setUser } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync state with user data
  useEffect(() => {
    if (user && isOpen) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put("/auth/profile", { firstName, lastName, phone });
      setUser({ ...user, ...res.data });
      addNotification("Profile updated successfully!", "success");
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.title || "Failed to update profile";
      addNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return addNotification("Passwords do not match", "error");
    }
    setLoading(true);
    try {
      await API.post("/auth/change-password", { currentPassword, newPassword });
      addNotification("Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      addNotification(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-purple-500/10 animate-scaleUp">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight">Account <span className="text-purple-400">Settings</span></h2>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/5">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 text-sm font-bold transition-all ${
                activeTab === "profile" ? "text-white border-b-2 border-purple-500" : "text-slate-500 hover:text-white"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`pb-4 text-sm font-bold transition-all ${
                activeTab === "password" ? "text-white border-b-2 border-purple-500" : "text-slate-500 hover:text-white"
              }`}
            >
              Security
            </button>
          </div>

          {activeTab === "profile" ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Save Profile"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Changing..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
