import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";

export type AppUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  timezone: string;
};

export async function getOptionalUser(): Promise<AppUser | null> {
  let session: Awaited<ReturnType<typeof auth.getSession>>["data"] = null;
  try {
    const result = await auth.getSession();
    session = result.data;
  } catch {
    return null;
  }
  const user = session?.user;
  if (!user?.id) return null;

  let timezone = "Africa/Lagos";
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const existing = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1);
      if (existing[0]) {
        timezone = existing[0].timezone;
      } else {
        await db
          .insert(profiles)
          .values({
            userId: user.id,
            displayName: user.name ?? null,
            timezone,
          })
          .onConflictDoNothing();
      }
    } catch {
      // First-login race or missing migration should not block session reads.
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    timezone,
  };
}

export async function requireUser() {
  const user = await getOptionalUser();
  if (!user) {
    redirect("/auth/sign-in");
  }
  return user;
}
