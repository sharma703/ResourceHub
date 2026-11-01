import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = DataStore.markNotificationAsRead(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Marked as read" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to mark as read" },
      { status: 500 }
    );
  }
}
