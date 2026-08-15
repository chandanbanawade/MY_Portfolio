"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the server log / your error tracker.
    console.error("[app error]", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="text-center">
        <p className="font-mono text-sm font-medium text-danger">Error</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-md text-fg-muted">
          This has been logged. Try again — if you were mid-booking, your slot
          was not charged.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-fg-subtle">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="secondary">
            Back to portfolio
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
