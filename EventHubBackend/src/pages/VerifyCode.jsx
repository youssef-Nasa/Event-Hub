import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";


export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const email = location.state?.email;
      const res = await API.post("/auth/verify-code", { 
        email,
        resetCode: code.trim() 
      });

      if (res.status === 200) {
        navigate("/reset-password", { state: { email, resetCode: code.trim() } }); 
      } else {

        setError(res.data.message || "Invalid code");
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
          Verify Code
        </h2>

        <p className="text-slate-400 mb-6">
          Enter the code sent to your email
        </p>

        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            required
            className="w-full mb-4 bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white text-center tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

        </form>

      </div>
    </div>
  );
}