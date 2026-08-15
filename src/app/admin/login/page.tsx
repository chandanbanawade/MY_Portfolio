import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already signed in — skip the form.
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-fg text-fg-inverse">
            <ShieldCheck className="h-6 w-6" strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-sm text-fg-muted">
            {site.name} · mentorship dashboard
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-fg-subtle">
          Credentials are set by <code className="font-mono">ADMIN_EMAIL</code> and{" "}
          <code className="font-mono">ADMIN_PASSWORD</code> in{" "}
          <code className="font-mono">.env</code>, applied when you run{" "}
          <code className="font-mono">npm run db:seed</code>.
        </p>
      </div>
    </main>
  );
}
