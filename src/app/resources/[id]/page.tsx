"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Resource, ConditionReport } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getConditionBadgeVariant, formatDate, formatDateTime } from "@/lib/utils";
import { 
  MapPin, 
  Clock, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle, 
  ChevronLeft, 
  User, 
  Building2, 
  FileText, 
  Send, 
  Check, 
  Sparkles,
  ClipboardList
} from "lucide-react";
import Link from "next/link";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const resourceId = params.id as string;

  const [resource, setResource] = useState<Resource | null>(null);
  const [conditionReports, setConditionReports] = useState<ConditionReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Booking Form State
  const today = new Date().toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState<string>(today);
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("14:00");
  const [purpose, setPurpose] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadResource() {
      try {
        const res = await fetch(`/api/resources/${resourceId}`);
        const data = await res.json();
        if (data.success) {
          setResource(data.data);
          setSelectedImage(data.data.thumbnail_url || data.data.images?.[0]?.url || "");
        }

        // Fetch past condition reports
        const crRes = await fetch(`/api/condition-reports?resourceId=${resourceId}`);
        const crData = await crRes.json();
        if (crData.success) {
          setConditionReports(crData.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [resourceId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${bookingDate}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${bookingDate}T${endTime}:00`).toISOString();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: resourceId,
          user_id: user?.id || "22222222-2222-2222-2222-222222222221",
          start_time: startDateTime,
          end_time: endDateTime,
          purpose: purpose.trim(),
        }),
      });

      const resData = await response.json();

      if (!resData.success) {
        setBookingError(resData.error || "Failed to submit booking request.");
      } else {
        setBookingSuccess(true);
      }
    } catch (err: any) {
      setBookingError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Resource not found</h2>
        <p className="text-xs text-slate-500">The requested equipment or space does not exist.</p>
        <Link href="/discover" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      
      {/* BREADCRUMBS */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/discover" className="hover:text-blue-600 flex items-center gap-1 font-medium">
          <ChevronLeft className="w-4 h-4" /> Discover Catalog
        </Link>
        <span>/</span>
        <span className="text-slate-400">{resource.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{resource.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: IMAGES & SPECS (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* GALLERY */}
          <div className="space-y-3">
            <div className="aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-subtle relative">
              <img
                src={selectedImage || resource.thumbnail_url}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getConditionBadgeVariant(resource.condition)} bg-white/95 backdrop-blur-sm`}>
                  {resource.condition} Condition
                </span>
              </div>
            </div>

            {/* THUMBNAIL STRIP */}
            {resource.images && resource.images.length > 1 && (
              <div className="flex items-center gap-2">
                {resource.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img.url ? "border-blue-600 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RESOURCE HEADLINE & ATTRIBUTES */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                {resource.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {resource.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {resource.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {resource.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Duration</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> {resource.max_duration_hours} Hours
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Concurrent Capacity</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> {resource.capacity} Seat{resource.capacity > 1 ? "s" : ""}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligibility</span>
                <span className="font-bold text-slate-800 capitalize mt-0.5 block">
                  {resource.eligibility.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* SAFETY PROTOCOLS & USAGE RESTRICTIONS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Safety Instructions & Usage Restrictions
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-amber-900 leading-relaxed">
                <strong>Mandatory Safety Rules:</strong> {resource.safety_instructions || "Standard lab PPE required. Adhere to equipment user manual."}
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 leading-relaxed">
                <strong>Usage Restrictions:</strong> {resource.usage_restrictions || "Authorized academic projects and coursework only."}
              </div>
            </div>
          </div>

          {/* CUSTODIAN / OWNER INFORMATION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={resource.owner?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Facility Custodian</span>
                <h4 className="font-bold text-slate-900 text-sm">{resource.owner?.full_name || "Department Lead"}</h4>
                <p className="text-xs text-slate-500">{resource.owner?.department || "Central Laboratory"}</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 hidden sm:block">
              <span>{resource.institution?.name || "IITS Main Campus"}</span>
            </div>
          </div>

          {/* HISTORICAL CONDITION AUDIT LOGS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                Previous Condition Reports ({conditionReports.length})
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Verified check-outs</span>
            </div>

            {conditionReports.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No historical maintenance incidents logged.</p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-2">
                {conditionReports.map((cr) => (
                  <div key={cr.id} className="pt-2 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        Inspected by {cr.user_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getConditionBadgeVariant(cr.condition_rating)}`}>
                        {cr.condition_rating}
                      </span>
                    </div>
                    {cr.notes && <p className="text-slate-500 text-[11px] italic">"{cr.notes}"</p>}
                    <span className="text-[10px] text-slate-400 block">{formatDateTime(cr.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE BOOKING PANEL (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-premium space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reservation Terminal</span>
                <h3 className="text-lg font-extrabold text-slate-900">Request Time Slot</h3>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Booking
              </span>
            </div>

            {bookingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900 text-base">Booking Submitted!</h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Your request has been forwarded to <strong>{resource.owner?.full_name}</strong> for review. You can track its live status in your dashboard.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/dashboard/student"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    View in Student Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setBookingSuccess(false);
                      setPurpose("");
                    }}
                    className="w-full py-2 text-xs text-emerald-700 hover:underline"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                
                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* DATE SELECTOR */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Reservation Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* TIME SLOTS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* DURATION VALIDATION NOTICE */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-blue-900 text-[11px] flex justify-between items-center">
                  <span>Permitted Duration:</span>
                  <span className="font-bold">Up to {resource.max_duration_hours} Hours</span>
                </div>

                {/* PURPOSE */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" /> Academic Project Purpose
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your research project, capstone prototype, or testing methodology..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                    minLength={5}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Verifying Slot Availability...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Reservation Request</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Protected by server-side collision locking. Overlapping approved bookings are rejected.
                </p>

              </form>
            )}

          </div>

          {/* AI COMPATIBILITY TIP */}
          <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-2xl border border-blue-100 text-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-900">Need Guidance on Equipment Setup?</h5>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Our AI Assistant can suggest complementary probes, resins, or compute libraries tailored to your build.
              </p>
              <Link href="/ai-match" className="text-blue-600 font-semibold hover:underline mt-1.5 inline-block text-[11px]">
                Open AI Matchmaker →
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

