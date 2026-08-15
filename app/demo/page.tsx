import { DemoWorkspace } from "@/components/demo/demo-workspace";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <>
      <SiteHeader />
      <DemoWorkspace />
    </>
  );
}
