"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { DEMO_PROFILES } from "@/lib/mock-data";
import { Layers, ArrowRight, Sparkles, Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState<string>("student.nikhil@iits.edu.in");
  const [password, setPassword] = useState<string>("••••••••");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email);
      // Route based on role
      if (email.includes("admin")) router.push("/dashboard/admin");
      else if (email.includes("owner")) router.push("/dashboard/owner");
      else if (email.includes("faculty")) router.push("/dashboard/faculty");
      else router.push("/dashboard/student");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    if (role === "institution_admin") router.push("/dashboard/admin");
    else if (role === "resource_owner") router.push("/dashboard/owner");
    else if (role === "faculty") router.push("/dashboard/faculty");
    else router.push("/dashboard/student");
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-premium">
        
        {/* LOGO */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              RESOURCE<span className="text-blue-600">HUB</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-500">
            Access your campus equipment reservations and approvals
          </p>
        </div>

        {/* 1-CLICK QUICK JUDGE DEMO LOGINS */}
        <div className="p-4 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 rounded-2xl border border-blue-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Hackathon Judge 1-Click Access:
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">No password needed</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("student")}
              className="p-2 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 text-left hover:shadow-subtle transition-all"
            >
              <span className="font-bold text-slate-900 block">🎓 Student</span>
              <span className="text-[10px] text-slate-400">Nikhil (Robotics)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("resource_owner")}
              className="p-2 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 text-left hover:shadow-subtle transition-all"
            >
              <span className="font-bold text-slate-900 block">⚙️ Resource Owner</span>
              <span className="text-[10px] text-slate-400">Prof. Rajesh (FabLab)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("faculty")}
              className="p-2 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 text-left hover:shadow-subtle transition-all"
            >
              <span className="font-bold text-slate-900 block">🔬 Faculty Lead</span>
              <span className="text-[10px] text-slate-400">Akanksha (VLSI)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("institution_admin")}
              className="p-2 bg-white rounded-xl border border-blue-200/80 hover:border-blue-500 text-left hover:shadow-subtle transition-all"
            >
              <span className="font-bold text-slate-900 block">🏛️ Campus Admin</span>
              <span className="text-[10px] text-slate-400">Dr. Vikram (Dean)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* STANDARD CREDENTIAL LOGIN */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Campus Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Sign In to ResourceHub"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an institutional profile?{" "}
          <Link href="/signup" className="text-blue-600 font-bold hover:underline">
            Register your institution
          </Link>
        </div>

      </div>
    </div>
  );
}

