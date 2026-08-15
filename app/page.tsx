import { Landing } from "@/components/marketing/landing";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      <SiteHeader />
      <Landing />
    </>
  );
}
