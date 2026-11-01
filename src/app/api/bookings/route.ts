import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { bookingSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const ownerId = searchParams.get("ownerId") || undefined;
    const resourceId = searchParams.get("resourceId") || undefined;
    const status = searchParams.get("status") || undefined;

    const bookings = DataStore.getBookings({
      userId,
      ownerId,
      resourceId,
      status,
    });

    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = bookingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.format() },
        { status: 400 }
      );
    }

    const result = DataStore.createBooking({
      resource_id: validated.data.resource_id,
      user_id: validated.data.user_id,
      start_time: validated.data.start_time,
      end_time: validated.data.end_time,
      purpose: validated.data.purpose,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit booking" },
      { status: 500 }
    );
  }
}

