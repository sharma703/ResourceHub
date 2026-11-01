import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST() {
  try {
    DataStore.reset();
    return NextResponse.json({ success: true, message: "Demo data reset successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset demo data" },
      { status: 500 }
    );
  }
}
