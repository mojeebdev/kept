import { SignInForm } from "@/components/auth/sign-in-form";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <>
      <SiteHeader compact />
      <main className="px-4 py-16 sm:px-6">
        <SignInForm />
      </main>
    </>
  );
}
