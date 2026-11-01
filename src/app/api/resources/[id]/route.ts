import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = DataStore.getResourceById(params.id);
    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: resource });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = DataStore.updateResource(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Resource not found or could not be updated" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = DataStore.deleteResource(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Resource deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete resource" },
      { status: 500 }
    );
  }
}

