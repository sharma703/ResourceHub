"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Resource } from "@/types";
import ResourceCard from "@/components/shared/ResourceCard";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  RotateCcw, 
  Boxes, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { getConditionBadgeVariant } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Laboratories",
  "Electronics",
  "Cameras",
  "Computing equipment",
  "Robotics",
  "3D printers",
  "Classrooms",
  "Meeting rooms",
  "Sports equipment",
  "Technical tools"
];

const CONDITIONS = ["All", "Excellent", "Good", "Fair"];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [condition, setCondition] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category && category !== "All") params.append("category", category);
      if (condition && condition !== "All") params.append("condition", condition);

      const res = await fetch(`/api/resources?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        let items: Resource[] = data.data;

        if (sortBy === "name-asc") {
          items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "capacity-desc") {
          items.sort((a, b) => b.capacity - a.capacity);
        } else if (sortBy === "duration-desc") {
          items.sort((a, b) => b.max_duration_hours - a.max_duration_hours);
        }

        setResources(items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, category, condition, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setCondition("All");
    setSortBy("recommended");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Boxes className="w-4 h-4" />
            <span>Campus Asset Exchange</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and reserve equipment, computing clusters, and collaborative spaces.
          </p>
        </div>

        <Link
          href="/ai-match"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Matchmaker</span>
        </Link>
      </div>

      {/* SEARCH & FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        {/* TOP ROW: SEARCH & QUICK CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by equipment name, keywords, model, or lab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="duration-desc">Sort: Max Duration</option>
              <option value="capacity-desc">Sort: Highest Capacity</option>
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {(search || category !== "All" || condition !== "All") && (
              <button
                onClick={resetFilters}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY PILLS BAR */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CONDITION FILTERS */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Condition:</span>
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              onClick={() => setCondition(cond)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                condition === cond
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS COUNT & STATE */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-900">{resources.length}</strong> available resources</span>
        {category !== "All" && (
          <span className="text-blue-600 font-medium">Filtered by: {category}</span>
        )}
      </div>

      {/* RESOURCE LISTING */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-80" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 stroke-1" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No matching resources found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center justify-between hover:border-blue-400 shadow-subtle transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <img
                  src={res.thumbnail_url}
                  alt={res.name}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {res.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getConditionBadgeVariant(res.condition)}`}>
                      {res.condition}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {res.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                    {res.description}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" /> {res.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Max {res.max_duration_hours}h
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <Link
                  href={`/resources/${res.id}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-slate-400 text-xs">Loading campus catalog...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
