import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Cpu, Award, Heart, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                RESOURCE<span className="text-blue-500">HUB</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              The premier institution resource-sharing ecosystem designed for CodeVerse India 2026. Unlocking underused labs, computing nodes, robotic testbeds, and collaboration spaces across academic campuses.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Supabase RLS Secured
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-blue-400 text-[11px] font-semibold">
                <Award className="w-3.5 h-3.5" /> CodeVerse India 2026
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Resource Categories</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/discover?category=Computing+equipment" className="hover:text-white transition-colors">Computing & GPUs</Link></li>
              <li><Link href="/discover?category=3D+printers" className="hover:text-white transition-colors">3D Printers & SLA</Link></li>
              <li><Link href="/discover?category=Robotics" className="hover:text-white transition-colors">Robotics Manipulators</Link></li>
              <li><Link href="/discover?category=Electronics" className="hover:text-white transition-colors">Electronics & Testbenches</Link></li>
              <li><Link href="/discover?category=Cameras" className="hover:text-white transition-colors">Cinema & Optical Kits</Link></li>
              <li><Link href="/discover?category=Laboratories" className="hover:text-white transition-colors">Bio & Chemistry Labs</Link></li>
            </ul>
          </div>

          {/* PLATFORM ROLES */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Ecosystem Portals</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/dashboard/student" className="hover:text-white transition-colors">Student Hub</Link></li>
              <li><Link href="/dashboard/faculty" className="hover:text-white transition-colors">Faculty Research Portal</Link></li>
              <li><Link href="/dashboard/owner" className="hover:text-white transition-colors">Resource Owner Center</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">Institution Admin Office</Link></li>
              <li><Link href="/analytics" className="hover:text-white transition-colors">Utilization Telemetry</Link></li>
              <li><Link href="/ai-match" className="hover:text-white transition-colors">AI Matchmaker</Link></li>
            </ul>
          </div>

          {/* HACKATHON INFO */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Hackathon Info</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Built for <strong className="text-slate-200">CodeVerse India 2026</strong>. Theme: <em>Unlock Underused Equipment and Spaces</em>.
            </p>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Architecture:</span>
                <span className="text-slate-200 font-mono">Next.js 14 App</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Database:</span>
                <span className="text-slate-200 font-mono">Supabase PostgreSQL</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Auth:</span>
                <span className="text-slate-200 font-mono">RLS + Role RBAC</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 ResourceHub. Built with Next.js, React, Tailwind CSS, TypeScript & Supabase.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian Innovation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

