import { NextRequest, NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import { resourceSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const condition = searchParams.get("condition") || undefined;
    const ownerId = searchParams.get("ownerId") || undefined;

    const resources = DataStore.getResources({
      search,
      category,
      condition,
      ownerId,
    });

    return NextResponse.json({ success: true, count: resources.length, data: resources });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = resourceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.format() },
        { status: 400 }
      );
    }

    const ownerId = body.owner_id || "22222222-2222-2222-2222-222222222223"; // default demo owner if not passed
    const owner = DataStore.getProfile(ownerId);

    const resource = DataStore.createResource({
      ...validated.data,
      owner_id: ownerId,
      owner: owner || undefined,
      institution_id: "11111111-1111-1111-1111-111111111111",
      is_active: true,
      thumbnail_url: validated.data.thumbnail_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
      images: [
        {
          id: `img-${Date.now()}`,
          resource_id: "",
          url: validated.data.thumbnail_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
          is_primary: true,
        }
      ]
    });

    return NextResponse.json({ success: true, data: resource }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create resource" },
      { status: 500 }
    );
  }
}
