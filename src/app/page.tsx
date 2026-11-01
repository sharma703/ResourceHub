"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Search, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  BookOpen, 
  Boxes,
  Zap,
  Building2,
  ChevronRight,
  Shield,
  Activity
} from "lucide-react";
import ResourceCard from "@/components/shared/ResourceCard";
import { Resource } from "@/types";

export default function HomePage() {
  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedResources(data.data.slice(0, 4));
        }
      })
      .catch(console.error);
  }, []);

  const categories = [
    { name: "All", count: "10+", icon: Boxes },
    { name: "3D printers", count: "2", icon: Layers },
    { name: "Computing equipment", count: "4", icon: Cpu },
    { name: "Robotics", count: "3", icon: Zap },
    { name: "Cameras", count: "3", icon: Sparkles },
    { name: "Electronics", count: "6", icon: Activity },
    { name: "Laboratories", count: "5", icon: Building2 },
  ];

  return (
    <div className="flex-1 flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                CodeVerse India 2026 Challenge Showcase
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Unlock the Potential of <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Shared Resources</span>.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover, borrow and share equipment and spaces within your institution. Transform unused resources into opportunities.
              </p>

              {/* SEARCH BAR CTA */}
              <div className="pt-2">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery) window.location.href = `/discover?search=${encodeURIComponent(searchQuery)}`;
                  }}
                  className="bg-white p-2 rounded-2xl shadow-premium border border-slate-200 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto lg:mx-0"
                >
                  <div className="flex-1 flex items-center gap-3 px-3">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search GPUs, 3D printers, cameras, labs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* CTA BUTTONS */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/discover"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Explore Resources</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard/owner"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300/80 transition-all shadow-sm"
                >
                  List a Resource
                </Link>
                <Link
                  href="/ai-match"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-semibold text-xs sm:text-sm border border-blue-200/80 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Assistant</span>
                </Link>
              </div>

              {/* TRUST BADGES */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-Time Slot Locking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Hardware Condition Audits</span>
                </div>
              </div>
            </div>

            {/* HERO VISUAL MOCKUP */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* BACKDROP GLOW */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl -z-10" />

                {/* MAIN SHOWCASE CARD */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">NVIDIA DGX A100</h4>
                        <p className="text-[10px] text-slate-400">Computing cluster node</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Live Available
                    </span>
                  </div>

                  <div className="rounded-xl overflow-hidden aspect-video relative">
                    <img
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"
                      alt="DGX Cluster"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] flex items-center gap-1.5 font-medium">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>Max booking: 24h</span>
                    </div>
                  </div>

                  {/* FLOATING ACTION PREVIEW */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Scheduled User:</span>
                      <span className="font-semibold text-slate-800">Nikhil Sharma (Robotics)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Conflict Guard:</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Zero Overlap Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-900">Next Slot: 2:00 PM Today</span>
                    <Link
                      href="/resources/33333333-3333-3333-3333-333333333302"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors"
                    >
                      Instant Reserve
                    </Link>
                  </div>
                </div>

                {/* FLOATING BADGE 1 */}
                <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">4,200+ Equipment Hours</p>
                    <p className="text-[10px] text-slate-400">Unlocked across campuses</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM IMPACT STATISTICS */}
      <section className="py-12 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">78.4%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">Resource Utilization Rate</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Up from ~26% campus average</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">10+</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">Specialized Lab Domains</p>
              <p className="text-[11px] text-slate-400 mt-0.5">SLA, GPUs, Cobots, Spectrometry</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">0%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">Double Booking Rate</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Enforced via database triggers</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">Condition Verified</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Check-in and check-out logs</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Frictionless Lifecycle</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              How ResourceHub Works
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              A transparent 4-step workflow connecting students, researchers, lab owners, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Discover & Filter",
                description: "Browse categorized campus assets with real-time specs, safety rules, and availability calendars.",
                icon: Search,
              },
              {
                step: "02",
                title: "Request Reservation",
                description: "Pick available time slots, specify academic purpose, and submit for quick automated or owner review.",
                icon: CalendarCheck,
              },
              {
                step: "03",
                title: "Check-in & Utilize",
                description: "Confirm arrival, activate session, and access enterprise gear safely according to operating protocols.",
                icon: CheckCircle2,
              },
              {
                step: "04",
                title: "Audit & Return",
                description: "Complete post-use checklist, file condition reports, and return equipment ready for the next researcher.",
                icon: ShieldCheck,
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-blue-600/30 font-mono">{s.step}</span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED RESOURCES */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Campus Catalog</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Featured Equipment & Spaces
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore active resources available for immediate reservation.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>View All 10+ Catalog Items</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS: STUDENTS VS INSTITUTIONS */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Why Campus Resource Sharing Wins
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Transforming isolated departmental silos into a unified innovation commons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* STUDENTS */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                🎓
              </div>
              <h3 className="text-xl font-bold text-slate-900">Benefits for Students & Researchers</h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Access advanced GPU clusters and SLA 3D printers previously locked behind closed lab doors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Accelerate project capstone delivery with transparent booking schedules and instant status updates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>AI assistant that analyzes project ideas and recommends exact equipment required for prototypes.</span>
                </li>
              </ul>
              <Link
                href="/dashboard/student"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Go to Student Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* INSTITUTIONS */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-subtle space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                🏛️
              </div>
              <h3 className="text-xl font-bold text-slate-900">Benefits for Institutions & Lab Owners</h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Eliminate wasteful duplicate capital expenditures on rarely utilized specialized test benches.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Comprehensive condition inspection trail and accountability for every loan transaction.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Real-time utilization analytics and reporting ready for accreditation and grant reviews.</span>
                </li>
              </ul>
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Go to Admin Office <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS (SAMPLE DEMO CONTENT) */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Demonstration Feedback</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Voices Across the Campus
            </h2>
            <p className="text-xs text-slate-400 mt-1">Sample testimonials representing user roles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                “Our robotics team had never been able to access the high-precision SLA resin printer until ResourceHub made lab booking transparent. We printed lightweight UAV mounts in 2 days.”
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Nikhil"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Nikhil Sharma</h4>
                  <p className="text-[10px] text-slate-500">Student, Robotics & AI</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                “The automated check-in and condition reporting ensures our department’s 1GHz oscilloscopes are returned in pristine shape. Approval queues take seconds right from my phone.”
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
                  alt="Akanksha"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Akanksha Srivastava</h4>
                  <p className="text-[10px] text-slate-500">Faculty, Electrical Engg</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                “For the first time, our institution has concrete telemetry on DGX cluster utilization and lab occupancy. We avoided a 40 Lakhs INR redundant hardware purchase this quarter.”
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                  alt="Dr Vikram"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Vikram Malhotra</h4>
                  <p className="text-[10px] text-slate-500">Dean of Research Infrastructure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
            CodeVerse India 2026 Ready
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Unlock Your Institution's Resources?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Experience the complete end-to-end booking lifecycle, condition audits, and utilization analytics today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/discover"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-glow transition-all active:scale-95"
            >
              Browse Catalog Now
            </Link>
            <Link
              href="/analytics"
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              View Campus Telemetry
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

