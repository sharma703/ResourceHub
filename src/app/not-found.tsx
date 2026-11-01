import Link from "next/link";
import { Compass, ArrowRight, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-premium">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 stroke-1" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Error 404</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resource Not Located</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The page, facility schedule, or laboratory booking you are looking for does not exist or has been archived.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
          >
            Return Home
          </Link>
          <Link
            href="/discover"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

