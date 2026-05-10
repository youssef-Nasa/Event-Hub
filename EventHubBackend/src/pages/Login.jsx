import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Ticket } from 'lucide-react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', {
        Email: formData.email,
        Password: formData.password
      });

      authLogin(data.token, data.user);
      
      // Role-based redirection
      if (data.user.role === 'Admin') {
        window.location.href = "/admin";
      } else if (data.user.role === 'Organizer') {
        window.location.href = "/organizer";
      } else {
        // Participant goes back to Home
        window.location.href = "/";
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">

      {/* LEFT SAME AS REGISTER */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Ticket className="text-white w-6 h-6" />
            </div>
            <span className="text-white text-2xl font-bold">EventHub</span>
          </div>

                  <div>
             <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-6">
  BACK TO THE PULSE
</span>
          <h1 className="text-8xl font-bold text-white leading-tight pt-14">
            The Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Pulse
            </span>{" "}
            of Events.
          </h1>

          <p className="text-slate-400 text-lg max-w-md">
            Experience the next generation of event management. Curated,
            premium, and designed for the modern creator.
          </p>
        </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center min-h-[110vh] justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"></div>
              <span className="text-white text-xl font-bold">EventHub</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 mb-8">Sign in to continue your journey.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-medium mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@pulse.io"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>

            {/* Password */}
      {/* Password */}
<div className="mb-6">
  <label className="block text-slate-400 text-sm font-medium mb-2">PASSWORD</label>
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="••••••••"
      required
      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-purple-500 transition"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
    >
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  </div>
</div>

{/* Forgot Password */}
<div className="text-right mb-6">
  <a
    href="/forgot-password"
    className="text-purple-400 text-sm hover:underline font-medium"
  >
    Forgot Password?
  </a>
</div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Link */}
            <div className="text-center mt-6 space-y-3">
              <div>
                <span className="text-slate-400 text-sm">
                  Don’t have an account?{' '}
                  <a href="/register" className="text-purple-400 hover:underline font-medium">
                    Sign up
                  </a>
                </span>
              </div>
              <div className="pt-2 border-t border-slate-700/50 flex flex-col gap-2">
                <a href="/admin" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                  Go to Admin Console &rarr;
                </a>
                <a href="/organizer" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                  Go to Organizer Dashboard &rarr;
                </a>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}