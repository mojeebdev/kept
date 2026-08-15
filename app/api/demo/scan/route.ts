import { NextResponse } from "next/server";
import { z } from "zod";
import { scanSourceText } from "@/lib/scan";
import { parseFlexibleDate } from "@/lib/scan/dates";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  body: z.string().trim().min(8).max(20000),
  publishedAt: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.parse(await request.json());
    const result = await scanSourceText(parsed.body, parseFlexibleDate(parsed.publishedAt ?? null));
    return NextResponse.json({
      ...result,
      persist: false,
      notice: "Demo scan only. Results are not written to a user workspace.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Demo scan failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
