import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/schema";
import { appendRow, countByOption } from "@/lib/google-sheets";
import { CAPACITY } from "@/lib/sessions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const counts = await countByOption();
    const full: string[] = [];
    if (counts[data.session1] >= CAPACITY) full.push(data.session1);
    if (counts[data.session2] >= CAPACITY) full.push(data.session2);
    if (full.length > 0) {
      return NextResponse.json(
        { error: "session_full", full, counts },
        { status: 409 }
      );
    }

    await appendRow({
      name: data.name,
      team: data.team,
      session1: data.session1,
      session2: data.session2,
      ai_level: data.ai_level,
      expectation: data.expectation,
      extra: data.extra,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit] failed", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
