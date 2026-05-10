import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate(); // ✅ لازم جوه الكومبوننت

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/forgot-password", { email });

      if (res.status === 200) {
        navigate("/verify-code", { state: { email } });
      } else {

        setError(res.data.message || "Something went wrong");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Network error");
    }

    setLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-white mb-2">
          Forgot Password
        </h2>

        <p className="text-slate-400 mb-6">
          Enter your email to receive a recovery code
        </p>

        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl"
          >
            {loading ? "Sending..." : "Send Recovery Code"}
          </button>

        </form>

      </div>
    </div>
  );
}