import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../api/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    resetCode: location.state?.resetCode || "",
    newPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!formData.email || !formData.resetCode) {
      navigate("/forgot-password");
    }
  }, [formData, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.put("/auth/reset-password", formData);

      if (res.status === 200) {
        alert("Password updated successfully 🔥");
        navigate("/login");
      } else {
        setError(res.data.message || "Failed to reset password");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-slate-400 mb-6">Create a new secure password for your account</p>

        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email (Read-only for security) */}
          <div className="mb-4">
            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Account</label>
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-slate-400 text-sm">
              {formData.email}
            </div>
          </div>

          {/* New Password */}
          <div className="relative mb-6">
            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}