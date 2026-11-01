import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = DataStore.approveBooking(params.id, body.notes);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.booking });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Approval failed" },
      { status: 500 }
    );
  }
}
