export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(value: string | Date | null | undefined, timeZone = "Africa/Lagos") {
  if (!value) return "No date";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "No date";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function platformLabel(platform: string) {
  switch (platform) {
    case "x":
      return "X";
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "linkedin":
      return "LinkedIn";
    default:
      return "Other";
  }
}

export function typeLabel(type: string) {
  switch (type) {
    case "link":
      return "Link";
    case "template":
      return "Template";
    case "reply":
      return "Reply";
    case "part_two":
      return "Part two";
    case "resource":
      return "Resource";
    case "update":
      return "Update";
    default:
      return "Other";
  }
}

export function xIntentUrl(text: string) {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export function uniqueId() {
  return crypto.randomUUID();
}
