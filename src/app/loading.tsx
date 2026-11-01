import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 flex-1 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-xl" />
      <div className="h-4 w-72 bg-slate-200 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-72 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

