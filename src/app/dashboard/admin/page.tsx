"use client";

import React, { useState, useEffect } from "react";
import { UtilizationMetrics, Resource, Booking, Incident, Profile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import UtilizationCharts from "@/components/analytics/UtilizationCharts";
import { getStatusBadgeVariant, formatDateTime, getConditionBadgeVariant } from "@/lib/utils";
import { 
  Building2, 
  Users, 
  Layers, 
  CalendarCheck, 
  AlertOctagon, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  Search,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<UtilizationMetrics | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "resources" | "incidents">("overview");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [aRes, rRes, bRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/resources"),
          fetch("/api/bookings"),
        ]);

        const [aData, rData, bData] = await Promise.all([
          aRes.json(),
          rRes.json(),
          bRes.json(),
        ]);

        if (aData.success) setMetrics(aData.data);
        if (rData.success) setResources(rData.data);
        if (bData.success) setBookings(bData.data);

        // Mock incidents
        setIncidents([
          {
            id: "inc-1",
            resource_id: "33333333-3333-3333-3333-333333333305",
            resource_name: "Keysight Oscilloscope Bench",
            reported_by: "22222222-2222-2222-2222-222222222222",
            reporter_name: "Dr. Priya Deshmukh",
            severity: "Low",
            title: "Channel 2 BNC mechanical play noted during calibration",
            description: "Technician verified probe contacts. Operating normally within 1GHz range.",
            status: "Investigating",
            created_at: "2026-10-29T16:00:00Z",
          },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const exportReport = () => {
    alert("Exporting Institutional Resource Sharing Telemetry Report (CSV/PDF) for Academic Year 2026...");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      
      {/* ADMIN TITLE BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Campus Office of Academic Infrastructure & Research</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Institutional Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry, double-booking prevention safeguards, asset lifecycle oversight, and safety incident tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportReport}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Audit Report</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "overview" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Utilization Telemetry
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "bookings" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Institutional Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "resources" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Campus Inventory ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "incidents" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Safety Incidents ({incidents.length})
        </button>
      </div>

      {/* TAB 1: TELEMETRY & CHARTS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <UtilizationCharts initialMetrics={metrics || undefined} />
        </div>
      )}

      {/* TAB 2: ALL CAMPUS BOOKINGS TABLE */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Real-time Campus Reservations Log</h3>
            <span className="text-xs text-slate-400">{bookings.length} total entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Reserved By</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeVariant(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {b.resource?.name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {b.user?.full_name || "Aarav Sharma"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {formatDateTime(b.start_time)}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-500">
                      {b.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPUS INVENTORY TABLE */}
      {activeTab === "resources" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Master Campus Asset Register</h3>
            <span className="text-xs text-slate-400">{resources.length} active assets</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Equipment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Facility / Location</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Max Duration</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                      <img src={r.thumbnail_url} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      <span className="max-w-xs truncate">{r.name}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{r.category}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{r.location}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getConditionBadgeVariant(r.condition)}`}>
                        {r.condition}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{r.max_duration_hours} hrs</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Link
                        href={`/resources/${r.id}`}
                        className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SAFETY INCIDENTS */}
      {activeTab === "incidents" && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>All clear:</strong> 0 critical safety violations reported. 1 active preventive maintenance ticket being serviced.
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle divide-y divide-slate-100">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Severity: {inc.severity}
                    </span>
                    <span className="font-semibold text-slate-900">{inc.title}</span>
                  </div>
                  <p className="text-slate-500">{inc.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Target: {inc.resource_name} • Reported by: {inc.reporter_name}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    Status: {inc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
