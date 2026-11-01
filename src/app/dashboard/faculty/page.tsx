"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Booking, Resource } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getStatusBadgeVariant, formatDateTime } from "@/lib/utils";
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            Faculty Research Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.full_name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Supervise departmental capstone projects, reserve high-throughput instrumentation, and sponsor student lab reservations.
          </p>
        </div>

        <Link
          href="/discover"
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all"
        >
          <span>Reserve Research Equipment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Sponsored Students</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">14</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Active lab clearances</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Departmental Bookings</span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1">{bookings.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Term to date</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Research Hours Unlocked</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">128 hrs</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Shared facilities usage</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Active Capstones</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">6</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Cross-departmental builds</span>
        </div>
      </div>

      {/* SUPERVISED STUDENT WORKFLOW TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Active Lab Projects in Progress</h3>
            <p className="text-xs text-slate-400">Real-time status of student reservations under your department</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            Electrical & Robotics Dept
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {bookings.map((b) => (
            <div key={b.id} className="py-4 flex flex-col md:flex-row justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeVariant(b.status)}`}>
                    {b.status}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{b.resource?.name}</span>
                </div>
                <p className="text-slate-600 italic">“{b.purpose}”</p>
                <div className="flex items-center gap-3 text-slate-400 text-[11px] pt-0.5">
                  <span>Researcher: {b.user?.full_name || "Aarav Sharma"}</span>
                  <span>•</span>
                  <span>{formatDateTime(b.start_time)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/resources/${b.resource_id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200"
                >
                  Inspect Asset
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
