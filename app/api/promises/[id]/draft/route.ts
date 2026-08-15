import { NextResponse } from "next/server";
import { z } from "zod";
import { draftFollowUpAction } from "@/app/actions/workspace";
import { requireUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  body: z.string().trim().min(3).max(4000).optional(),
  deliveryLink: z.string().trim().optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
    const { id } = await context.params;
    const json = await request.json().catch(() => ({}));
    const parsed = bodySchema.parse(json);
    const draft = await draftFollowUpAction({
      promiseId: id,
      body: parsed.body,
      deliveryLink: parsed.deliveryLink,
    });
    return NextResponse.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
