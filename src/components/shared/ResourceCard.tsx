"use client";

import React from "react";
import Link from "next/link";
import { Resource } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getConditionBadgeVariant } from "@/lib/utils";
import { 
  MapPin, 
  Clock, 
  Users, 
  Bookmark, 
  ArrowRight, 
  Sparkles,
  ShieldAlert
} from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { savedResourceIds, toggleSaveResource } = useAuth();
  const isSaved = savedResourceIds.includes(resource.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 shadow-subtle hover:shadow-premium transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* THUMBNAIL CONTAINER */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={resource.thumbnail_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"}
          alt={resource.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
            {resource.category}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaveResource(resource.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? "bg-blue-600 text-white shadow-sm scale-110"
                : "bg-black/30 hover:bg-black/50 text-white"
            }`}
            title={isSaved ? "Saved to your list" : "Save resource"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* BOTTOM THUMBNAIL OVERLAYS */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getConditionBadgeVariant(resource.condition)} bg-white/95 backdrop-blur-sm`}>
            {resource.condition} Condition
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Max {resource.max_duration_hours}h
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>

          <Link href={`/resources/${resource.id}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-base leading-snug">
              {resource.name}
            </h3>
          </Link>

          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* METRICS & ACTION */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">Capacity:</span> {resource.capacity} user{resource.capacity > 1 ? "s" : ""}
          </div>

          <Link
            href={`/resources/${resource.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold transition-all group/btn"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
