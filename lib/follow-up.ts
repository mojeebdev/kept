import type { DraftChannel, Platform, PromiseType } from "@/lib/types";

export function channelFromPlatform(platform: Platform): DraftChannel {
  if (platform === "other") return "generic";
  return platform;
}

export function buildFollowUpDraft(input: {
  summary: string;
  evidenceQuote: string;
  promiseType: PromiseType;
  deliveryLink?: string | null;
  creatorName?: string | null;
}) {
  const link = input.deliveryLink?.trim();
  const lines = [
    `Following up on this — I said I would make good on it.`,
    "",
    input.summary.replace(/\.$/, "") + ".",
  ];

  if (link) {
    lines.push("", link);
  } else if (input.promiseType === "link" || input.promiseType === "template" || input.promiseType === "resource") {
    lines.push("", "[add the real link before you send this]");
  }

  const signOff = input.creatorName?.trim();
  if (signOff) {
    lines.push("", `— ${signOff}`);
  }

  return lines.join("\n");
}
