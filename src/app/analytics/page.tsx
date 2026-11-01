"use client";

import React, { useState, useEffect } from "react";
import UtilizationCharts from "@/components/analytics/UtilizationCharts";
import { UtilizationMetrics } from "@/types";
import { Activity, ShieldCheck, Download, Award, Info, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<UtilizationMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMetrics(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Activity className="w-4 h-4" />
            <span>Campus Real-Time Utilization Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Resource Utilization Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Live measurements of shared lab equipment, computing cluster usage, schedule density, and shared-capital impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Data Feed
          </span>
        </div>
      </div>

      {/* METHODOLOGY EXPLANATION NOTE */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900">How ResourceHub Calculates Campus Utilization:</p>
          <p className="leading-relaxed">
            The platform calculates utilization by evaluating total hours booked against theoretical operating capacity (12 hrs/day per asset) across all 10 specialized categories. Overlapping double bookings are mathematically eliminated by Postgres conflict isolation, ensuring 100% verified integrity.
          </p>
        </div>
      </div>

      {/* CHARTS COMPONENT */}
      <UtilizationCharts initialMetrics={metrics || undefined} />

      {/* SHARED CAPITAL IMPACT SUMMARY */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 rounded-3xl p-8 text-white space-y-4 shadow-premium">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
          <Award className="w-4 h-4" />
          <span>CodeVerse India 2026 Impact Summary</span>
        </div>
        <h2 className="text-2xl font-bold">Unlocking Latent Institutional Capital</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          In typical institutions, high-end instrumentation sits idle 74% of the time. By making availability transparent and orchestrating seamless check-ins and condition handoffs, ResourceHub multiplies student research output without requiring new hardware procurement budgets.
        </p>
        <div className="pt-2">
          <Link
            href="/discover"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
          >
            Explore All Available Resources →
          </Link>
        </div>
      </div>

    </div>
  );
}

