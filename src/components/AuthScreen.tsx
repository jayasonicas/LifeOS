/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Mail, 
  Lock, 
  Sparkles, 
  Cpu, 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (email: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<"choose" | "login" | "signup">("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Simulate standard networking latency for high fidelity UI feel
    setTimeout(() => {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem("lifeos_registered_users") || "[]");

        if (isSignUp) {
          // Check if user already exists
          const exists = registeredUsers.some(
            (u: any) => u.email.toLowerCase() === email.toLowerCase()
          );
          if (exists) {
            setError("This email is already registered. Please log in instead.");
            setLoading(false);
            return;
          }

          // Register new user
          const newUser = { email: email.trim(), password };
          registeredUsers.push(newUser);
          localStorage.setItem("lifeos_registered_users", JSON.stringify(registeredUsers));
          
          // Set current user session
          localStorage.setItem("lifeos_current_user", email.trim());
          onAuthSuccess(email.trim());
        } else {
          // Log in user
          const matchedUser = registeredUsers.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          if (!matchedUser) {
            setError("Invalid email address or passcode. Please try again.");
            setLoading(false);
            return;
          }

          // Set current user session
          localStorage.setItem("lifeos_current_user", matchedUser.email);
          onAuthSuccess(matchedUser.email);
        }
      } catch (err: any) {
        console.error("Local auth error:", err);
        setError("An error occurred during local authentication.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md space-y-8 z-10 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.2)] mx-auto">
            <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-3xl text-white tracking-tight flex items-center justify-center gap-2">
              LifeOS <span className="text-sm bg-indigo-500/20 text-indigo-300 font-mono font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">AI</span>
            </h1>
            <p className="text-sm text-slate-400 font-sans mt-1.5">
              Personal Operations System & Intelligent Chief of Staff
            </p>
          </div>
        </div>

        {/* Selection/Forms Box */}
        {mode === "choose" ? (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-6 animate-fadeIn">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-sans font-bold text-white">Select Access Protocol</h2>
              <p className="text-xs text-slate-400">
                Are you a new operator or an existing user?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              {/* Existing User Button */}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="group flex items-center gap-4 p-4.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all text-left cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600/15 transition-all">
                  <LogIn className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Existing User (Log In)
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Authenticate and sync with your existing session.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* New User Button */}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="group flex items-center gap-4 p-4.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all text-left cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-450 group-hover:bg-indigo-600/15 transition-all">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    New User (Sign Up)
                  </p>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Initialize a fresh personal secure profile sandbox.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-6 animate-fadeIn">
            {/* Go Back Header element */}
            <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
              <button
                type="button"
                onClick={() => {
                  setMode("choose");
                  setError(null);
                }}
                className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>GO BACK</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                    mode === "login"
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  LOG IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className={`text-[10px] font-mono font-bold px-2 py-1 rounded transition-colors cursor-pointer ${
                    mode === "signup"
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  SIGN UP
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-sans font-bold text-white">
                {isSignUp ? "New Account Setup" : "Access Personal Console"}
              </h2>
              <p className="text-xs text-slate-500">
                {isSignUp 
                  ? "Deploy your email and a new password to initialize a new user profile." 
                  : "Authorize secure system connection with your credentials."}
              </p>
            </div>

            {/* Alert messages */}
            {error && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex flex-col gap-3 text-xs text-rose-300 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold font-mono">Security Guard Warning</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isSignUp ? "Your Email Address" : "Authorized Email ID"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="operator@lifeos.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isSignUp ? "Choose New Password (min 6 chars)" : "System Passkey"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-350"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only on Sign Up) */}
              {isSignUp && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? "Establishing Handshake..." : isSignUp ? "Create New User Account" : "Sign In to System"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )}

        {/* Security / Info Footer */}
        <div className="flex justify-center items-center gap-1.5 text-[10px] font-mono text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Local Security Profile Managed Securely inside Browser Sandbox</span>
        </div>
      </div>
    </div>
  );
}
