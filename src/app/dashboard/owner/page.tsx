"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Resource, Booking } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getStatusBadgeVariant, formatDateTime, getConditionBadgeVariant } from "@/lib/utils";
import { 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  MapPin, 
  Layers, 
  Trash2, 
  Edit, 
  Eye, 
  ShieldCheck, 
  Users,
  CheckCircle2,
  FileText
} from "lucide-react";

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [bookingRequests, setBookingRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"requests" | "resources">("requests");

  // New Resource Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submittingResource, setSubmittingResource] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Rejection Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [selectedBookingForReject, setSelectedBookingForReject] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("Lab schedule maintenance or reserved academic seminar.");

  const [formData, setFormData] = useState({
    name: "",
    category: "3D printers",
    description: "",
    location: "",
    condition: "Excellent" as "Excellent" | "Good" | "Fair" | "Damaged",
    capacity: 2,
    max_duration_hours: 4,
    safety_instructions: "",
    usage_restrictions: "",
    thumbnail_url: "",
  });

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const ownerId = user?.id || "22222222-2222-2222-2222-222222222223";

      // Fetch owner's resources
      const rRes = await fetch(`/api/resources?ownerId=${ownerId}`);
      const rData = await rRes.json();
      if (rData.success) {
        setMyResources(rData.data);
      }

      // Fetch booking requests for owner's resources
      const bRes = await fetch(`/api/bookings?ownerId=${ownerId}`);
      const bData = await bRes.json();
      if (bData.success) {
        setBookingRequests(bData.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, [user]);

  const handleApprove = async (bookingId: string) => {
    setActionMessage(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Approved by facility custodian." }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Reservation request approved! Student has been notified." });
        fetchOwnerData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Approval failed." });
      }
    } catch (e: any) {
      setActionMessage({ type: "error", text: e.message || "Failed to approve request." });
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReject) return;

    setActionMessage(null);
    try {
      const res = await fetch(`/api/bookings/${selectedBookingForReject.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Request has been declined and applicant notified." });
        setRejectModalOpen(false);
        fetchOwnerData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Rejection failed." });
      }
    } catch (e: any) {
      setActionMessage({ type: "error", text: e.message || "Failed to reject." });
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingResource(true);
    setActionMessage(null);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          owner_id: user?.id || "22222222-2222-2222-2222-222222222223",
          thumbnail_url: formData.thumbnail_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "New resource catalog entry published successfully!" });
        setModalOpen(false);
        setFormData({
          name: "",
          category: "3D printers",
          description: "",
          location: "",
          condition: "Excellent",
          capacity: 2,
          max_duration_hours: 4,
          safety_instructions: "",
          usage_restrictions: "",
          thumbnail_url: "",
        });
        fetchOwnerData();
      } else {
        setActionMessage({ type: "error", text: data.error || "Failed to create resource." });
      }
    } catch (e: any) {
      setActionMessage({ type: "error", text: e.message || "Failed to submit resource." });
    } finally {
      setSubmittingResource(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to remove this equipment from the catalog?")) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: "success", text: "Resource removed." });
        fetchOwnerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const pendingRequests = bookingRequests.filter((b) => b.status === "Pending");
  const activeLoans = bookingRequests.filter((b) => b.status === "Checked Out" || b.status === "Approved");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
            Resource Custodian Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.full_name}'s Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Review reservation applications, approve facility usage, track active loans, and publish new academic equipment.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Publish New Equipment</span>
        </button>
      </div>

      {/* ACTION MESSAGE TOAST */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-rose-600" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Pending Approvals</span>
          <p className="text-3xl font-extrabold text-amber-500 mt-1">{pendingRequests.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting your action</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Active In-Lab Loans</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{activeLoans.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Currently checked out</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Managed Assets</span>
          <p className="text-3xl font-extrabold text-slate-800 mt-1">{myResources.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Listed in campus catalog</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
          <span className="text-xs text-slate-500 font-medium">Total Booking Volume</span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-1">{bookingRequests.length}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Lifetime student requests</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "requests" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Booking Requests Queue ({bookingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "resources" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          My Listed Resources ({myResources.length})
        </button>
      </div>

      {/* TAB 1: BOOKING REQUESTS QUEUE */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {bookingRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No incoming booking requests</h3>
              <p className="text-xs text-slate-500">
                When students or researchers book your equipment, their applications will show up here for review.
              </p>
            </div>
          ) : (
            bookingRequests.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ring-1 ${getStatusBadgeVariant(b.status)}`}>
                      {b.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      Applicant: {b.user?.full_name || "Nikhil Sharma"}
                    </span>
                    <span className="text-xs text-slate-400">({b.user?.department || "Student Researcher"})</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    {b.resource?.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {formatDateTime(b.start_time)} – {formatDateTime(b.end_time)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                    <strong>Applicant Project Scope:</strong> {b.purpose}
                  </div>
                </div>

                {/* OWNER APPROVE / DECLINE CONTROLS */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-44 shrink-0">
                  {b.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Approve Request</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBookingForReject(b);
                          setRejectModalOpen(true);
                        }}
                        className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-2.5 bg-slate-100 rounded-xl text-center text-slate-600 text-[11px] font-medium">
                      Status: {b.status}
                    </div>
                  )}

                  <Link
                    href={`/resources/${b.resource_id}`}
                    className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-center text-xs font-semibold"
                  >
                    View Resource
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MY LISTED RESOURCES */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-subtle flex flex-col justify-between"
            >
              <div className="space-y-3">
                <img
                  src={res.thumbnail_url}
                  alt=""
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">{res.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getConditionBadgeVariant(res.condition)}`}>
                    {res.condition}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{res.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> {res.location}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/resources/${res.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Link>
                <button
                  onClick={() => handleDeleteResource(res.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  title="Remove Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD RESOURCE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">List New Academic Equipment</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Resource / Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stratasys F370 Industrial 3D Printer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    {[
                      "3D printers",
                      "Computing equipment",
                      "Robotics",
                      "Cameras",
                      "Electronics",
                      "Laboratories",
                      "Classrooms",
                      "Meeting rooms",
                      "Technical tools",
                      "Sports equipment",
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Condition Rating</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Location (Campus / Building / Room)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Manufacturing Block, Room 204"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description & Technical Capabilities</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail specs, operational envelope, compatible tools..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Max Reservation (Hours)</label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={formData.max_duration_hours}
                    onChange={(e) => setFormData({ ...formData, max_duration_hours: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Concurrent User Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Safety Protocols</label>
                <input
                  type="text"
                  placeholder="e.g. Safety goggles required. Conduct initial safety training."
                  value={formData.safety_instructions}
                  onChange={(e) => setFormData({ ...formData, safety_instructions: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Image Thumbnail URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingResource}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
                >
                  {submittingResource ? "Publishing..." : "Publish to Campus Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DECLINE REASON MODAL */}
      {rejectModalOpen && selectedBookingForReject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="font-bold text-slate-900 text-base">Decline Booking Request</h3>
            <p className="text-xs text-slate-500">
              Provide a rationale for turning down {selectedBookingForReject.user?.full_name}'s request for <strong>{selectedBookingForReject.resource?.name}</strong>:
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

