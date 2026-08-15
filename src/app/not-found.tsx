import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center px-5 pt-24">
        <div className="text-center">
          <p className="font-mono text-sm font-medium text-accent">404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mx-auto mt-3 max-w-md text-fg-muted">
            The link may be out of date. If you were looking for a booking
            confirmation, check the reference in your confirmation email.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">Back to portfolio</ButtonLink>
            <ButtonLink href="/book" variant="secondary">
              Book a session
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
