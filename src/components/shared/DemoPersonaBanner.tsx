"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Sparkles, RotateCcw, ShieldCheck, UserCheck } from "lucide-react";

export default function DemoPersonaBanner() {
  const { role, switchRole, resetDemoData, user } = useAuth();

  const roles: { id: UserRole; label: string; name: string; icon: string }[] = [
    { id: "student", label: "Student", name: "Aarav", icon: "🎓" },
    { id: "faculty", label: "Faculty", name: "Dr. Priya", icon: "🔬" },
    { id: "resource_owner", label: "Owner", name: "Prof. Rajesh", icon: "⚙️" },
    { id: "institution_admin", label: "Admin", name: "Dr. Vikram", icon: "🏛️" },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Judge Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-300">
            Testing as: <strong className="text-white font-medium">{user?.full_name}</strong> ({role.replace("_", " ")})
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Switch Persona:</span>
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                role === r.id
                  ? "bg-blue-600 text-white shadow-sm ring-1 ring-white/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}

          <button
            onClick={resetDemoData}
            title="Reset sample bookings and test data to default"
            className="ml-2 px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 border border-slate-700/60"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
