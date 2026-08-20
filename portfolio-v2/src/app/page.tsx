import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { Hero } from "@/components/hero";
import { ProofStrip } from "@/components/proof-strip";
import { Recognition } from "@/components/recognition";
import { Findings } from "@/components/findings";
import { Speaking } from "@/components/speaking";
import { Mentorship } from "@/components/mentorship";
import { Sessions } from "@/components/sessions";
import { Capabilities } from "@/components/capabilities";
import { Experience } from "@/components/experience";
import { Framework } from "@/components/framework";
import { Credentials } from "@/components/credentials";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

/**
 * Section order is the argument the page makes:
 *   the record → who vouches for it → the findings themselves → evidence of
 *   teaching → what you can be mentored in → how to book it.
 */
export default function Page() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main" className="relative z-10">
        <Hero />
        <ProofStrip />
        <Recognition />
        <Findings />
        <Speaking />
        <Mentorship />
        <Sessions />
        <Capabilities />
        <Experience />
        <Framework />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
