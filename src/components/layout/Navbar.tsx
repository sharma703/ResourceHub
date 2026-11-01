"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import { 
  Compass, 
  Sparkles, 
  LayoutDashboard, 
  HelpCircle, 
  Menu, 
  X, 
  Layers, 
  User, 
  LogOut,
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine appropriate dashboard route for the active role
  const dashboardHref = 
    role === "institution_admin" ? "/dashboard/admin" :
    role === "resource_owner" ? "/dashboard/owner" :
    role === "faculty" ? "/dashboard/faculty" :
    "/dashboard/student";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "AI Match", href: "/ai-match", icon: Sparkles, badge: "New" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Analytics", href: "/analytics" },
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  RESOURCE<span className="text-blue-600">HUB</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Campus
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight -mt-1 hidden sm:block">
                Unlock Underused Equipment & Spaces
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-75" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT CONTROLS: Notification, User, Auth */}
          <div className="flex items-center gap-2">
            <NotificationDropdown />

            {/* User Profile / Dashboard pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100/80 transition-colors border border-slate-200/60"
              >
                <img
                  src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                  alt={user?.full_name || "User"}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-900 line-clamp-1 max-w-[100px]">
                    {user?.full_name?.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-blue-600 font-medium capitalize -mt-0.5">
                    {role.replace("_", " ")}
                  </p>
                </div>
              </Link>
            </div>

            <Link
              href="/discover"
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-sm shadow-blue-600/25"
            >
              Explore Catalog
            </Link>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-150">
          <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar_url}
                alt={user?.full_name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                <p className="text-[11px] text-blue-600 capitalize">{role.replace("_", " ")}</p>
              </div>
            </div>
            <Link
              href={dashboardHref}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-blue-600 font-semibold flex items-center gap-1"
            >
              Dashboard <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
