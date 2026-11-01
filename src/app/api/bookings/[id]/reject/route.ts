import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || "Scheduling conflict or resource maintenance.";

    const result = DataStore.rejectBooking(params.id, reason);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Rejection failed" },
      { status: 500 }
    );
  }
}

