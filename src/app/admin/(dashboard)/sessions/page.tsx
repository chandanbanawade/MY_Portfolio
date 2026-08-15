import { prisma } from "@/lib/prisma";
import { Alert } from "@/components/ui/primitives";
import { PageHeader } from "../shared";
import { SessionEditor } from "./session-editor";
import { parseStringArray } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await prisma.sessionType.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Sessions & Pricing"
        description="Change prices, durations and copy without redeploying. Edits go live on the site immediately."
      />

      <Alert tone="accent" className="mb-6">
        The defaults live in{" "}
        <code className="font-mono text-[0.6875rem]">src/config/sessions.ts</code>.
        Running <code className="font-mono text-[0.6875rem]">npm run db:seed</code>{" "}
        re-syncs from that file and will overwrite changes made here — so once
        you&apos;re managing prices from this page, update the config file too if
        you plan to re-seed.
      </Alert>

      <div className="space-y-5">
        {sessions.map((session) => (
          <SessionEditor
            key={session.id}
            session={{
              id: session.id,
              slug: session.slug,
              title: session.title,
              tagline: session.tagline,
              durationMin: session.durationMin,
              priceInr: session.priceInr,
              description: session.description,
              allowedProviders: parseStringArray(session.allowedProviders),
              isFree: session.isFree,
              active: session.active,
            }}
          />
        ))}
      </div>
    </>
  );
}
