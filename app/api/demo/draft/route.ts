import { NextResponse } from "next/server";
import { z } from "zod";
import { buildFollowUpDraft } from "@/lib/follow-up";
import { promiseTypes } from "@/lib/types";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  summary: z.string().min(3),
  evidenceQuote: z.string().min(3),
  promiseType: z.enum(promiseTypes),
  deliveryLink: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.parse(await request.json());
    const body = buildFollowUpDraft(parsed);
    return NextResponse.json({
      body,
      persist: false,
      notice: "Demo draft only. Opening X does not publish or fulfil anything.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Demo draft failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
