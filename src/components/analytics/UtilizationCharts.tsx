"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { UtilizationMetrics } from "@/types";
import { 
  Activity, 
  TrendingUp, 
  PieChart as PieIcon, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  AlertCircle 
} from "lucide-react";

interface UtilizationChartsProps {
  initialMetrics?: UtilizationMetrics;
}

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8", "#1e40af"];

export default function UtilizationCharts({ initialMetrics }: UtilizationChartsProps) {
  const [metrics, setMetrics] = useState<UtilizationMetrics | null>(initialMetrics || null);
  const [loading, setLoading] = useState<boolean>(!initialMetrics);

  useEffect(() => {
    if (!initialMetrics) {
      fetch("/api/analytics")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMetrics(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [initialMetrics]);

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        <div className="h-72 bg-slate-100 rounded-2xl" />
        <div className="h-72 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Campus Utilization</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.overallUtilizationRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">+14.2%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${metrics.overallUtilizationRate}%` }} 
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Active slots vs total capacity</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Active Borrowings</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.activeBookings}</span>
            <span className="text-xs text-slate-500 font-medium">Checked Out</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Equipment currently in use
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Requests</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.pendingRequests}</span>
            <span className="text-xs text-amber-600 font-medium">Awaiting Review</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">Average approval time: 42 mins</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Shared Research Hours</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.savedCostHours} hrs</span>
            <span className="text-xs text-indigo-600 font-medium">Unlocked</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-4">Preventing redundant procurement</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MONTHLY TRENDS AREA CHART */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Booking & Utilization Trends</h3>
              <p className="text-xs text-slate-500">Historical growth in resource sharing across academic terms</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlyTrends}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY DISTRIBUTION BAR CHART */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Resource Inventory by Category</h3>
              <p className="text-xs text-slate-500">Distribution of campus equipment catalog</p>
            </div>
            <PieIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.categoryBreakdown} layout="vertical" margin={{ left: 30, right: 20 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MOST USED VS UNDERUTILIZED ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MOST USED */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Highest Demand Resources</h3>
          <div className="divide-y divide-slate-100">
            {metrics.mostUsedResources.map((res, i) => (
              <div key={res.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{res.name}</p>
                    <span className="text-[10px] text-slate-400">{res.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">{res.bookingCount} bookings</span>
                  <p className="text-[10px] text-slate-400">{res.hoursUtilized} hrs usage</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UNDERUTILIZED (OPPORTUNITY AREA) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Underutilized Assets</h3>
              <p className="text-xs text-slate-400">Prime opportunities for campus scheduling reallocation</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Opportunity
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {metrics.underutilizedResources.map((res) => (
              <div key={res.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 line-clamp-1">{res.name}</p>
                  <span className="text-[10px] text-slate-400">{res.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-600 font-medium">Idle ~{res.idleDays} days</span>
                  <p className="text-[10px] text-slate-400">Available immediately</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
