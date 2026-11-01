import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "22222222-2222-2222-2222-222222222221"; // default student

    const notifications = DataStore.getNotifications(userId);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });
    }
    DataStore.markAllNotificationsAsRead(userId);
    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to mark notifications read" },
      { status: 500 }
    );
  }
}
