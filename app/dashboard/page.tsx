import { DashboardWorkspace } from "@/components/dashboard/workspace";
import { requireUser } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listContent, listPromises } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const databaseReady = isDatabaseConfigured();
  const contents = databaseReady ? await listContent(user.id) : [];
  const promises = databaseReady ? await listPromises(user.id, user.timezone) : [];

  return (
    <DashboardWorkspace
      promises={promises}
      contents={contents}
      timezone={user.timezone}
      databaseReady={databaseReady}
    />
  );
}
