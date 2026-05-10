import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, Ticket } from 'lucide-react';
import API from '../api/api';

export default function EventHubSignup() {
  const [accountType, setAccountType] = useState('participant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Protocol');
      return;
    }

    if (formData.password !== formData.rePassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';

      await API.post('/auth/register', {
        FirstName: firstName,
        LastName: lastName,
        Email: formData.email,
        Phone: formData.phone,
        Password: formData.password,
        Role: accountType // 'participant' or 'organizer'
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  
  };

  const handleAppleSignup = () => {
    console.log('Apple signup clicked');
  
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Pulse!</h2>
          <p className="text-slate-300 mb-6">Your account has been created successfully.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        <div>
       <div className="flex items-center gap-3 mb-16">
  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
               <Ticket className="text-white w-6 h-6" />
             </div>
  <span className="text-white text-2xl font-bold">EventHub</span>
</div>

          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-6">
              NEW ERA OF CONNECTION
            </span>
            <h1 className="text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Pulse.</span>
            </h1>
            <p className="text-slate-300 text-xl leading-relaxed max-w-lg">
            THIS IS YOUR VIBE
Don’t Just Attend — Belong.
Find your crowd. Feel the energy.
            </p>
          </div>
        </div>

       
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
         <div className="flex items-center gap-3 mb-16">
  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
    <Ticket className="text-white w-6 h-6" />
  </div>
  <span className="text-white text-2xl font-bold">EventHub</span>
</div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-slate-400 mb-8">Step into the ecosystem of elite experiences.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setAccountType('participant')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all border ${
                  accountType === 'participant'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                PARTICIPANT
              </button>
              <button
                type="button"
                onClick={() => setAccountType('organizer')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all border ${
                  accountType === 'organizer'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Ticket className="w-5 h-5 inline mr-2" />
                ORGANIZER
              </button>
            </div>

            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-medium mb-2">FULL NAME</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Alex Rivera"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-medium mb-2">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="alex@pulse.io"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-slate-400 text-sm font-medium mb-2">PHONE NUMBER</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01012345678"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">CONFIRM</label>
                <div className="relative">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="rePassword"
                    value={formData.rePassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-slate-400">
                I agree to the{' '}
                <a href="#" className="text-purple-400 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:underline">
                  Privacy Protocol
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Your Identity'}
            </button>

           

            {/* Login Link */}
            <div className="text-center">
              <span className="text-slate-400 text-sm">
                Already part of the pulse?{' '}
                <a href="/login" className="text-purple-400 hover:underline font-medium">
                  Log in
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}