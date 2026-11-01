import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return "N/A";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    case "Checked Out":
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    case "Returned":
      return "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
    case "Overdue":
      return "bg-red-50 text-red-700 border-red-200 ring-red-500/20";
    case "Cancelled":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export function getConditionBadgeVariant(condition: string) {
  switch (condition) {
    case "Excellent":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Good":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Fair":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Damaged":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

