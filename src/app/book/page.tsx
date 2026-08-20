import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BookingWizard } from "@/components/booking/wizard";
import { getSessionTypes, getCategories, getPackages } from "@/lib/data";
import { site } from "@/config/site";
import { formatInr } from "@/lib/format";
import { formatDuration } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Mentorship Session",
  description:
    "Book a 1-to-1 mentorship session in cybersecurity, AI/ML or data science. Start with a free 15-minute consultation.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: `Book a Mentorship Session · ${site.name}`,
    description:
      "Choose your mentorship area, session length and meeting method. Free 15-minute consultation available.",
    url: `${site.url}/book`,
  },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const params = await searchParams;

  const [sessions, categories, packages] = await Promise.all([
    getSessionTypes(),
    getCategories(),
    getPackages(),
  ]);

  // Package CTAs land here — explain what happens next rather than silently
  // dropping the choice, since packages start with a planning call.
  const selectedPackage = params.package
    ? packages.find((p) => p.slug === params.package)
    : undefined;

  const packageNote = selectedPackage
    ? `You're enquiring about the ${selectedPackage.title} package (${selectedPackage.sessionCount} × ${formatDuration(selectedPackage.durationMin)}, ${formatInr(selectedPackage.priceInr)}). Book a short session below and we'll agree the plan and schedule on that call — you won't be charged the package price until we've spoken.`
    : null;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container-page">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            Back to portfolio
          </Link>

          <div className="mt-6 mb-10 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Book a 1-to-1 session
            </h1>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-fg-muted">
              Pick what you need help with, how long you need and how you&apos;d
              like to meet. All times are shown in {site.timezoneLabel}.
            </p>
          </div>

          <Suspense fallback={<WizardSkeleton />}>
            <BookingWizard
              sessions={sessions}
              categories={categories}
              packageNote={packageNote}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}

function WizardSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <div className="skeleton h-7 w-full max-w-md rounded" />
        <div className="skeleton h-8 w-64 rounded" />
        <div className="grid gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-24 rounded-[var(--radius)]" />
          ))}
        </div>
      </div>
      <div className="skeleton h-80 rounded-[var(--radius-lg)]" />
    </div>
  );
}
