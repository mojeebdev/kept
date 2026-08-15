import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { scanAllAction, scanOneAction } from "@/app/actions/workspace";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  contentItemId: z.string().uuid().optional(),
});

export async function POST(request: Request) {
  try {
    await requireUser();
    const json = await request.json().catch(() => ({}));
    const parsed = bodySchema.parse(json);
    const result = parsed.contentItemId
      ? await scanOneAction(parsed.contentItemId)
      : await scanAllAction();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
