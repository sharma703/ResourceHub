import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET() {
  try {
    const metrics = DataStore.getAnalytics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate analytics" },
      { status: 500 }
    );
  }
}
