import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Experience } from "@/components/site/experience";
import { Achievements } from "@/components/site/achievements";
import { BugBounty } from "@/components/site/bug-bounty";
import { Findings } from "@/components/site/findings";
import { FreeConsultation } from "@/components/site/free-consultation";
import { Mentorship } from "@/components/site/mentorship";
import { Categories } from "@/components/site/categories";
import { Speaking } from "@/components/site/speaking";
import { Feedback } from "@/components/site/feedback";
import { Faq } from "@/components/site/faq";
import { CtaBand } from "@/components/site/cta";
import { MobileBookBar } from "@/components/site/mobile-book-bar";
import { JsonLd } from "@/components/ui/json-ld";
import {
  getSessionTypes,
  getPaidSessionTypes,
  getFreeConsultation,
  getCategories,
  getPublishedReviews,
} from "@/lib/data";
import { serviceSchema, faqSchema } from "@/lib/schema";

// Catalogue and pricing edits from /admin should appear without a rebuild.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allSessions, paidSessions, freeSession, categories, reviews] =
    await Promise.all([
      getSessionTypes(),
      getPaidSessionTypes(),
      getFreeConsultation(),
      getCategories(),
      getPublishedReviews(),
    ]);

  const startingPrice = paidSessions.length
    ? Math.min(...paidSessions.map((s) => s.priceInr))
    : 199;

  const freeAvailable = Boolean(freeSession);

  return (
    <>
      <Navbar />

      <main>
        <Hero startingPrice={startingPrice} freeAvailable={freeAvailable} />

        {/* Credibility first: who he is, what he's done, what he's won. */}
        <About />
        <Experience />
        <Achievements />
        {/* Teaching credentials sit with the recognition they follow from. */}
        <Speaking />
        <BugBounty />
        {/* The detail behind the 500+ counter, straight after the counter. */}
        <Findings />

        {/* Then the offer. */}
        <FreeConsultation session={freeSession} />
        <Mentorship sessions={paidSessions} freeSession={freeSession} />
        <Categories categories={categories} />

        <CtaBand
          variant="inline"
          title="Get personalised guidance — start with a free 15-minute call."
          freeAvailable={freeAvailable}
        />

        <Feedback reviews={reviews} />
        <Faq />

        <CtaBand startingPrice={startingPrice} freeAvailable={freeAvailable} />
      </main>

      <Footer />
      <MobileBookBar
        startingPrice={startingPrice}
        freeAvailable={freeAvailable}
      />

      <JsonLd data={serviceSchema(allSessions)} />
      <JsonLd data={faqSchema()} />
    </>
  );
}
