/**
 * MENTORSHIP AREAS — what is offered, not a claim about employment history.
 *
 * PRESERVE THIS DISTINCTION. `backing` drives an honest label in the UI:
 *   "professional" → directly evidenced by the CV (the security work)
 *   "guidance"     → mentorship and career direction in this area, which is
 *                    not the same as claiming industry employment in it
 *
 * Ported from the booking platform's src/config/categories.ts, trimmed to the
 * two pillars this site offers: security, and data science / AI-ML.
 */

export type PillarKey = "cybersecurity" | "ai_ml" | "data_science";

export type Backing = "professional" | "guidance";

export type Pillar = {
  key: PillarKey;
  label: string;
  blurb: string;
};

export type MentorshipArea = {
  slug: string;
  title: string;
  description: string;
  pillar: PillarKey;
  backing: Backing;
  topics: string[];
};

export const pillars: Pillar[] = [
  {
    key: "cybersecurity",
    label: "Cybersecurity",
    blurb: "The professional field — offensive security, bug bounty and VAPT.",
  },
  {
    key: "ai_ml",
    label: "AI / Machine Learning",
    blurb: "Roadmaps, project direction and interview preparation for AI roles.",
  },
  {
    key: "data_science",
    label: "Data Science",
    blurb: "Python, SQL, analytics and the path from beginner to job-ready.",
  },
];

export const mentorshipAreas: MentorshipArea[] = [
  /* --- Cybersecurity ------------------------------------------------------ */
  {
    slug: "ethical-hacking-pentesting",
    title: "Ethical hacking & penetration testing",
    description:
      "Methodology from scoping to reporting, drawn from live client engagements across web, mobile, API, network and cloud.",
    pillar: "cybersecurity",
    backing: "professional",
    topics: [
      "Testing methodology",
      "Web & API security",
      "Mobile security",
      "Network & infrastructure",
      "Cloud security",
      "CVSS scoring & reporting",
    ],
  },
  {
    slug: "bug-bounty-vulnerability-research",
    title: "Bug bounty & vulnerability research",
    description:
      "How to actually find bugs: recon workflow, choosing programs, and writing reports that get accepted rather than duplicated.",
    pillar: "cybersecurity",
    backing: "professional",
    topics: [
      "Recon methodology",
      "Choosing programs",
      "Report writing",
      "Avoiding duplicates",
      "Triage expectations",
    ],
  },
  {
    slug: "application-security",
    title: "Application security",
    description:
      "The vulnerability classes behind real disclosures — how to find them, prove them and fix them.",
    pillar: "cybersecurity",
    backing: "professional",
    topics: [
      "OWASP Top 10",
      "SQL injection & XSS",
      "SSRF",
      "Broken authentication",
      "Business logic flaws",
      "Secure code review",
    ],
  },
  {
    slug: "red-teaming",
    title: "Red teaming & threat emulation",
    description:
      "Adversary simulation, attack surface management and threat modelling as run on enterprise engagements.",
    pillar: "cybersecurity",
    backing: "professional",
    topics: [
      "Red team operations",
      "Threat emulation",
      "Attack surface management",
      "Threat modelling",
      "Incident response basics",
    ],
  },
  {
    slug: "security-career-guidance",
    title: "Cybersecurity career guidance",
    description:
      "A realistic path into security: what to learn, in what order, which labs matter and which certifications are worth the money.",
    pillar: "cybersecurity",
    backing: "professional",
    topics: [
      "Security roadmap",
      "Certification strategy",
      "Building a lab",
      "Landing the first role",
      "Freelance vs full-time",
    ],
  },

  /* --- AI / Machine Learning ---------------------------------------------- */
  {
    slug: "ai-security-automation",
    title: "AI for security & automation",
    description:
      "Building AI-assisted recon and automation tooling — the area where the security work and AI directly overlap.",
    pillar: "ai_ml",
    backing: "professional",
    topics: [
      "Automated recon pipelines",
      "Model-assisted triage",
      "Security automation",
      "Tooling with Python",
    ],
  },
  {
    slug: "ai-ml-career-guidance",
    title: "AI / ML career guidance",
    description:
      "Choosing between AI, ML, data and security tracks, and understanding what these roles actually involve day to day.",
    pillar: "ai_ml",
    backing: "guidance",
    topics: [
      "Career roadmap",
      "Choosing a specialisation",
      "Skill prioritisation",
      "Portfolio direction",
    ],
  },
  {
    slug: "machine-learning-roadmap",
    title: "Machine learning roadmap",
    description:
      "A structured path through the fundamentals — what to study, what to build, and what to safely skip.",
    pillar: "ai_ml",
    backing: "guidance",
    topics: [
      "ML fundamentals",
      "Study sequencing",
      "Practice projects",
      "Avoiding tutorial loops",
    ],
  },
  {
    slug: "genai-llm-rag",
    title: "Generative AI, LLMs & RAG",
    description:
      "Practical direction on LLM applications and retrieval pipelines — where to start, and how to secure what you ship.",
    pillar: "ai_ml",
    backing: "guidance",
    topics: [
      "LLM application design",
      "RAG pipelines",
      "Embeddings & vector stores",
      "Securing AI systems",
    ],
  },
  {
    slug: "ai-project-architecture",
    title: "AI project architecture",
    description:
      "Structuring an AI project so it is defensible in an interview and maintainable afterwards.",
    pillar: "ai_ml",
    backing: "guidance",
    topics: [
      "Project scoping",
      "Architecture decisions",
      "Technology selection",
      "Deployment approach",
    ],
  },

  /* --- Data Science -------------------------------------------------------- */
  {
    slug: "data-science-roadmap",
    title: "Data science roadmap",
    description:
      "A personalised path from beginner to job-ready, built around the time you actually have.",
    pillar: "data_science",
    backing: "guidance",
    topics: ["Beginner to job-ready", "Study plan", "Tool selection", "Realistic timelines"],
  },
  {
    slug: "python-sql-analytics",
    title: "Python, SQL & analytics",
    description:
      "The working core of data science — writing Python that does real work and SQL that answers real questions.",
    pillar: "data_science",
    backing: "guidance",
    topics: ["Python for data", "SQL querying", "Data analytics", "Pandas & NumPy"],
  },
  {
    slug: "data-science-portfolio",
    title: "Data science projects & portfolio",
    description:
      "Choosing projects that get you interviews, and presenting them so a recruiter understands the value in ten seconds.",
    pillar: "data_science",
    backing: "guidance",
    topics: [
      "Project selection",
      "Portfolio structure",
      "GitHub presentation",
      "Writing up results",
    ],
  },
];

export function areasFor(pillar: PillarKey): MentorshipArea[] {
  return mentorshipAreas.filter((area) => area.pillar === pillar);
}
