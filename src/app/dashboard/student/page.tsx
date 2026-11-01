"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Booking, Resource, ConditionReport } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getStatusBadgeVariant, formatDateTime, formatDate } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Bookmark, 
  FileCheck, 
  RotateCcw, 
  Search, 
  LogOut, 
  LogIn,
  ShieldCheck,
  Sparkles,
  ClipboardCheck,
  X
} from "lucide-react";

export default function StudentDashboardPage() {
  const { user, savedResourceIds } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "completed" | "saved">("active");

  // Check-out / Condition Report Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<Booking | null>(null);
  const [conditionRating, setConditionRating] = useState<"Excellent" | "Good" | "Fair" | "Damaged">("Good");
  const [checklist, setChecklist] = useState({
    cleanliness: true,
    cables_intact: true,
    functional_test_passed: true,
    accessories_returned: true,
  });
  const [conditionNotes, setConditionNotes] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?userId=${user?.id || "22222222-2222-2222-2222-222222222221"}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }

      // Fetch saved resources
      const rRes = await fetch("/api/resources");
      const rData = await rRes.json();
      if (rData.success) {
        setSavedResources(rData.data.filter((r: Resource) => savedResourceIds.includes(r.id)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, savedResourceIds]);

  const handleCheckIn = async (bookingId: string) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/check-in`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Successfully checked in! Equipment access is active." });
        fetchDashboardData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Check-in failed." });
      }
    } catch (e: any) {
      setActionMessage({ type: "error", text: e.message || "Failed to check in." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForCheckout) return;

    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/bookings/${selectedBookingForCheckout.id}/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conditionReport: {
            condition_rating: conditionRating,
            checklist,
            notes: conditionNotes,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Resource successfully returned and condition audit filed!" });
        setCheckoutModalOpen(false);
        fetchDashboardData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Check-out failed." });
      }
    } catch (e: any) {
      setActionMessage({ type: "error", text: e.message || "Failed to submit check-out." });
    } finally {
      setActionLoading(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status === "Checked Out" || b.status === "Approved");
  const pendingBookings = bookings.filter((b) => b.status === "Pending");
  const completedBookings = bookings.filter((b) => b.status === "Returned" || b.status === "Cancelled");

  const displayedBookings = 
    activeTab === "active" ? activeBookings :
    activeTab === "pending" ? pendingBookings :
    activeTab === "completed" ? completedBookings :
    bookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-premium relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              Student Researcher Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track your reservations, perform contactless check-ins, submit equipment return inspection audits, and explore newly listed campus assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-glow"
            >
              Reserve New Equipment
            </Link>
            <Link
              href="/ai-match"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>AI Matchmaker</span>
            </Link>
          </div>
        </div>
      </div>

      {/* FEEDBACK TOAST BANNER */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">In Use / Approved</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">{activeBookings.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Active lab allocations</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Pending Review</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1">{pendingBookings.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting owner confirmation</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Completed Loans</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{completedBookings.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Returned with audit logs</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Saved Resources</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">{savedResources.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Quick access shortlist</span>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "active", label: `Active & Approved (${activeBookings.length})` },
          { id: "pending", label: `Pending Requests (${pendingBookings.length})` },
          { id: "completed", label: `Completed (${completedBookings.length})` },
          { id: "saved", label: `Saved Shortlist (${savedResources.length})` },
          { id: "all", label: `All History (${bookings.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: SAVED RESOURCES */}
      {activeTab === "saved" ? (
        <div className="space-y-4">
          {savedResources.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No saved resources</h3>
              <p className="text-xs text-slate-500">Click the bookmark icon on any resource card in Discover to save it here.</p>
              <Link href="/discover" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResources.map((res) => (
                <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-subtle">
                  <img src={res.thumbnail_url} alt="" className="w-full h-36 object-cover rounded-xl" />
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{res.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{res.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{res.location}</p>
                  </div>
                  <Link
                    href={`/resources/${res.id}`}
                    className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Reserve Slot</span> <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* TAB CONTENT: BOOKING LIST */
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3 shadow-subtle">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No bookings in this tab</h3>
              <p className="text-xs text-slate-500">
                You don't have any bookings matching this category.
              </p>
              <Link
                href="/discover"
                className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                Browse & Book Resources
              </Link>
            </div>
          ) : (
            displayedBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-slate-300 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ring-1 ${getStatusBadgeVariant(b.status)}`}>
                      {b.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Booking Ref: <span className="font-mono">{b.id.substring(0, 12)}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {b.resource?.name || "Equipment Reservation"}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {formatDateTime(b.start_time)} – {formatDateTime(b.end_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {b.resource?.location || "Campus Facility"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                    <strong>Project Stated Purpose:</strong> {b.purpose}
                  </div>

                  {b.rejection_reason && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                      <strong>Declined Reason:</strong> {b.rejection_reason}
                    </div>
                  )}
                </div>

                {/* WORKFLOW ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-44 shrink-0">
                  
                  {/* CHECK-IN ACTION */}
                  {b.status === "Approved" && (
                    <button
                      onClick={() => handleCheckIn(b.id)}
                      disabled={actionLoading}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Check In Now</span>
                    </button>
                  )}

                  {/* CHECK-OUT ACTION */}
                  {b.status === "Checked Out" && (
                    <button
                      onClick={() => {
                        setSelectedBookingForCheckout(b);
                        setCheckoutModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Check Out & Report</span>
                    </button>
                  )}

                  {b.status === "Pending" && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-center text-amber-800 text-[11px] font-medium">
                      Awaiting custodian review
                    </div>
                  )}

                  {b.status === "Returned" && (
                    <div className="p-2.5 bg-slate-100 rounded-xl text-center text-slate-600 text-[11px] flex items-center justify-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Loan Completed</span>
                    </div>
                  )}

                  <Link
                    href={`/resources/${b.resource_id}`}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-center text-xs font-semibold transition-colors"
                  >
                    View Resource
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* CHECK-OUT & CONDITION REPORT MODAL */}
      {checkoutModalOpen && selectedBookingForCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Check Out & Condition Audit</h3>
              </div>
              <button onClick={() => setCheckoutModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are completing your session for <strong>{selectedBookingForCheckout.resource?.name}</strong>. Please verify the hardware condition before releasing.
            </p>

            <form onSubmit={handleCheckOutSubmit} className="space-y-4 text-xs">
              
              {/* CONDITION RATING */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Post-Use Condition Rating:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Excellent", "Good", "Fair", "Damaged"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setConditionRating(r)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        conditionRating === r
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* INSPECTION CHECKLIST */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-semibold text-slate-700 block">Custody Inspection Checklist:</label>
                <div className="space-y-2">
                  {[
                    { key: "cleanliness", label: "Cleanliness verified (no debris/chemicals left)" },
                    { key: "cables_intact", label: "All cables, power bricks, and adapters intact" },
                    { key: "functional_test_passed", label: "Self-test diagnostic passed without errors" },
                    { key: "accessories_returned", label: "Accessories and manuals returned to locker" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(checklist as any)[item.key]}
                        onChange={(e) =>
                          setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 text-xs">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* NOTES */}
              <div className="space-y-1 pt-2">
                <label className="font-semibold text-slate-700 block">Inspection Notes / Observations:</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Unit wiped with microfiber, battery recharged to 100%..."
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
                >
                  {actionLoading ? "Submitting..." : "Confirm Return"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

