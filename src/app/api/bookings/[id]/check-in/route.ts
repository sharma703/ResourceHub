import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = DataStore.checkInBooking(params.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Check-in failed" },
      { status: 500 }
    );
  }
}
