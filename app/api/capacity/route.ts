import { NextResponse } from "next/server";
import { countByOption } from "@/lib/google-sheets";
import { ALL_OPTION_IDS, CAPACITY } from "@/lib/sessions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const counts = await countByOption();
    return NextResponse.json(
      { capacity: CAPACITY, counts },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[capacity] failed", err);
    // Fall back to zeros so the UI still renders if Sheets is misconfigured
    const counts = Object.fromEntries(ALL_OPTION_IDS.map((id) => [id, 0]));
    return NextResponse.json(
      {
        capacity: CAPACITY,
        counts,
        error: "capacity_unavailable",
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
