import { AuthView } from "@neondatabase/auth-ui";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function AuthPathPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return (
    <>
      <SiteHeader compact />
      <main className="flex justify-center px-4 py-16">
        <AuthView path={path} />
      </main>
    </>
  );
}
