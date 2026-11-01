"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Building, Phone, ShieldCheck, Check, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, role } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [department, setDepartment] = useState(user?.department || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Institutional Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your academic credentials and verified affiliations.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{user?.full_name}</h3>
            <p className="text-xs text-blue-600 font-semibold capitalize">{role.replace("_", " ")}</p>
            <span className="text-[11px] text-slate-400">{user?.email}</span>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Department / Research Lab</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Contact Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
