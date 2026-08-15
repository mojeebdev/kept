import { describe, expect, it } from "vitest";
import { deriveUrgency } from "@/lib/scan/dates";

const now = new Date("2026-08-15T12:00:00.000Z");
const zone = "Africa/Lagos";

describe("deriveUrgency", () => {
  it("never marks a no-date promise overdue", () => {
    expect(deriveUrgency("open", null, zone, now)).toBe("none");
  });

  it("marks yesterday overdue", () => {
    expect(deriveUrgency("open", "2026-08-14T00:00:00.000Z", zone, now)).toBe("overdue");
  });

  it("marks today as due today", () => {
    expect(deriveUrgency("open", "2026-08-15T08:00:00.000Z", zone, now)).toBe("due_today");
  });

  it("leaves a future date as not urgent", () => {
    expect(deriveUrgency("open", "2026-08-20T00:00:00.000Z", zone, now)).toBe("none");
  });

  it("does not treat drafted or fulfilled items as overdue", () => {
    expect(deriveUrgency("drafted", "2026-08-01T00:00:00.000Z", zone, now)).toBe("none");
    expect(deriveUrgency("fulfilled", "2026-08-01T00:00:00.000Z", zone, now)).toBe("none");
  });
});
