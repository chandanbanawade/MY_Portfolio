/**
 * MENTORSHIP CATEGORIES — what the PLATFORM offers.
 * =============================================================================
 * IMPORTANT DISTINCTION, PLEASE PRESERVE IT:
 *
 *   This file lists the mentorship areas Chandan offers guidance in.
 *   It is NOT a claim about his professional employment history.
 *
 *   His verified professional background lives in `experience.ts` and
 *   `expertise.ts`, sourced strictly from his CV.
 *
 *   Categories carry a `backing` field that the UI renders honestly:
 *     "professional" → directly evidenced by his CV (security work)
 *     "guidance"     → he mentors in this area; it is not claimed as
 *                      professional employment experience
 *
 * Add a new category by appending to the list and re-running `npm run db:seed`.
 * Everything downstream — homepage grid, booking wizard, admin — reads this.
 */

export type CategoryGroupKey =
  | "ai_ml"
  | "data_science"
  | "cybersecurity"
  | "programming"
  | "career"
  | "interview"
  | "projects";

/** How strongly the CV backs this area. Drives the honesty label in the UI. */
export type Backing = "professional" | "guidance";

export type CategoryConfig = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  group: CategoryGroupKey;
  backing: Backing;
  /** Bullet topics shown on the category card. */
  topics: string[];
  active?: boolean;
};

export const categoryGroups: Record<
  CategoryGroupKey,
  { label: string; blurb: string; icon: string }
> = {
  cybersecurity: {
    label: "Cybersecurity",
    blurb:
      "Chandan's professional field — offensive security, bug bounty and VAPT.",
    icon: "ShieldCheck",
  },
  ai_ml: {
    label: "AI / Machine Learning",
    blurb: "Roadmaps, project direction and interview preparation for AI roles.",
    icon: "BrainCircuit",
  },
  data_science: {
    label: "Data Science",
    blurb: "Python, SQL, analytics and the path from beginner to job-ready.",
    icon: "ChartLine",
  },
  programming: {
    label: "Programming & Development",
    blurb: "Fundamentals, backend, APIs and writing code you can maintain.",
    icon: "Code2",
  },
  career: {
    label: "Career Mentorship",
    blurb: "Roadmaps, resumes, portfolios and deciding what to learn next.",
    icon: "Route",
  },
  interview: {
    label: "Interview Preparation",
    blurb: "Mock rounds and how to talk about your work so it lands.",
    icon: "MessagesSquare",
  },
  projects: {
    label: "Project Mentorship",
    blurb: "From idea to deployed, with someone reviewing as you go.",
    icon: "Boxes",
  },
};

export const categories: CategoryConfig[] = [
  /* --- Cybersecurity — Chandan's professional field ----------------------- */
  {
    slug: "ethical-hacking-pentesting",
    title: "Ethical Hacking & Penetration Testing",
    description:
      "Methodology from scoping to reporting, drawn from live client engagements across web, mobile, API, network and cloud.",
    icon: "Crosshair",
    group: "cybersecurity",
    backing: "professional",
    topics: [
      "Penetration testing methodology",
      "Web & API security",
      "Mobile security",
      "Network & infrastructure",
      "Cloud security",
      "Reporting & CVSS scoring",
    ],
  },
  {
    slug: "bug-bounty-vulnerability-research",
    title: "Bug Bounty & Vulnerability Research",
    description:
      "How to actually find bugs: recon workflow, choosing programs, and writing reports that get accepted rather than duplicated.",
    icon: "Bug",
    group: "cybersecurity",
    backing: "professional",
    topics: [
      "Recon methodology",
      "Choosing programs",
      "Report writing",
      "Avoiding duplicates",
      "Vulnerability assessment",
    ],
  },
  {
    slug: "application-security",
    title: "Application Security",
    description:
      "The vulnerability classes behind real disclosures — how to find them, prove them and fix them.",
    icon: "Lock",
    group: "cybersecurity",
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
    title: "Red Teaming & Threat Emulation",
    description:
      "Adversary simulation, attack surface management and threat modelling as run on enterprise engagements.",
    icon: "Swords",
    group: "cybersecurity",
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
    title: "Cybersecurity Career Guidance",
    description:
      "A realistic path into security: what to learn, in what order, which labs matter and which certifications are worth the money.",
    icon: "Map",
    group: "cybersecurity",
    backing: "professional",
    topics: [
      "Security career roadmap",
      "Certification strategy",
      "Building a lab",
      "Landing your first role",
      "Freelance vs full-time",
    ],
  },

  /* --- AI / Machine Learning ---------------------------------------------- */
  {
    slug: "ai-ml-career-guidance",
    title: "AI / ML Career Guidance",
    description:
      "Choosing between AI, ML, data and security tracks, and understanding what these roles actually involve day to day.",
    icon: "BrainCircuit",
    group: "ai_ml",
    backing: "guidance",
    topics: [
      "AI/ML career roadmap",
      "Choosing a specialisation",
      "Skill prioritisation",
      "Portfolio direction",
    ],
  },
  {
    slug: "machine-learning-roadmap",
    title: "Machine Learning Roadmap",
    description:
      "A structured path through the fundamentals — what to study, what to build, and what to safely skip.",
    icon: "Route",
    group: "ai_ml",
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
    icon: "Sparkles",
    group: "ai_ml",
    backing: "guidance",
    topics: [
      "LLM application design",
      "RAG pipelines",
      "Embeddings & vector stores",
      "Prompt engineering",
      "Securing AI systems",
    ],
  },
  {
    slug: "ai-project-architecture",
    title: "AI Project Architecture",
    description:
      "Structuring an AI project so it's defensible in an interview and maintainable afterwards.",
    icon: "Boxes",
    group: "ai_ml",
    backing: "guidance",
    topics: [
      "Project scoping",
      "Architecture decisions",
      "Technology selection",
      "Deployment approach",
    ],
  },
  {
    slug: "ai-security-automation",
    title: "AI for Security & Automation",
    description:
      "Building AI-assisted recon and automation tooling — the area where Chandan's security work and AI directly overlap.",
    icon: "Cpu",
    group: "ai_ml",
    backing: "professional",
    topics: [
      "AI-assisted exploitation",
      "Automated recon pipelines",
      "Security automation",
      "Tooling with Python",
    ],
  },

  /* --- Data Science -------------------------------------------------------- */
  {
    slug: "data-science-roadmap",
    title: "Data Science Roadmap",
    description:
      "A personalised path from beginner to job-ready, built around the time you actually have.",
    icon: "ChartLine",
    group: "data_science",
    backing: "guidance",
    topics: [
      "Beginner to job-ready path",
      "Study plan",
      "Tool selection",
      "Realistic timelines",
    ],
  },
  {
    slug: "python-sql-analytics",
    title: "Python, SQL & Analytics",
    description:
      "The working core of data science — writing Python that does real work and SQL that answers real questions.",
    icon: "Terminal",
    group: "data_science",
    backing: "guidance",
    topics: ["Python for data", "SQL querying", "Data analytics", "Pandas & NumPy"],
  },
  {
    slug: "data-science-portfolio",
    title: "Data Science Projects & Portfolio",
    description:
      "Choosing projects that get you interviews, and presenting them so a recruiter understands the value in ten seconds.",
    icon: "FileText",
    group: "data_science",
    backing: "guidance",
    topics: [
      "Project selection",
      "Portfolio structure",
      "GitHub presentation",
      "Writing up results",
    ],
  },

  /* --- Programming & Development ------------------------------------------ */
  {
    slug: "programming-fundamentals",
    title: "Programming Fundamentals",
    description:
      "Getting genuinely comfortable with Python and the fundamentals everything else builds on.",
    icon: "Code2",
    group: "programming",
    backing: "guidance",
    topics: ["Python", "Core fundamentals", "Problem solving", "Code quality"],
  },
  {
    slug: "backend-apis",
    title: "Backend Development & APIs",
    description:
      "Designing and building APIs — including the security mistakes that turn up constantly in penetration tests.",
    icon: "Server",
    group: "programming",
    backing: "guidance",
    topics: [
      "Backend architecture",
      "REST API design",
      "Authentication done right",
      "Common API security flaws",
    ],
  },
  {
    slug: "debugging-git",
    title: "Debugging, Git & Workflow",
    description:
      "Getting unstuck faster, and working the way a professional team expects you to.",
    icon: "Wrench",
    group: "programming",
    backing: "guidance",
    topics: ["Debugging approach", "Git & GitHub", "Code review", "Team workflow"],
  },

  /* --- Career -------------------------------------------------------------- */
  {
    slug: "career-roadmap",
    title: "Career Roadmap & Skill Prioritisation",
    description:
      "Working out what to learn next when everything looks equally urgent — and what to ignore entirely.",
    icon: "Map",
    group: "career",
    backing: "guidance",
    topics: [
      "Career roadmap",
      "Skill prioritisation",
      "Job preparation",
      "Realistic goal setting",
    ],
  },
  {
    slug: "resume-portfolio-linkedin",
    title: "Resume, Portfolio & LinkedIn Review",
    description:
      "A line-by-line review of what a hiring manager sees in the first ten seconds — and exactly what to change.",
    icon: "FileText",
    group: "career",
    backing: "guidance",
    topics: [
      "Resume review",
      "Portfolio review",
      "GitHub profile",
      "LinkedIn optimisation",
    ],
  },
  {
    slug: "career-switching",
    title: "Career Switching",
    description:
      "Moving into tech, security or AI from development, IT, support or a non-technical background — with honest timelines.",
    icon: "Route",
    group: "career",
    backing: "guidance",
    topics: [
      "Switching strategy",
      "Transferable skills",
      "Realistic timelines",
      "First-role targeting",
    ],
  },

  /* --- Interview Preparation ----------------------------------------------- */
  {
    slug: "technical-interview-prep",
    title: "Technical Interview Preparation",
    description:
      "Structured preparation for technical rounds, with feedback on how you actually come across.",
    icon: "MessagesSquare",
    group: "interview",
    backing: "guidance",
    topics: [
      "Technical rounds",
      "Fundamentals revision",
      "Answer structure",
      "Handling gaps",
    ],
  },
  {
    slug: "project-interview-prep",
    title: "Project & Mock Interviews",
    description:
      "A live mock interview on your own project, then honest feedback on what a panel would think.",
    icon: "Presentation",
    group: "interview",
    backing: "guidance",
    topics: [
      "Mock interviews",
      "Project deep-dives",
      "Explaining your decisions",
      "Follow-up questions",
    ],
  },
  {
    slug: "domain-interview-prep",
    title: "Domain-Specific Interview Prep",
    description:
      "Targeted preparation for AI/ML, Data Science or Cybersecurity interviews depending on where you're applying.",
    icon: "Award",
    group: "interview",
    backing: "guidance",
    topics: [
      "AI/ML interviews",
      "Data Science interviews",
      "Cybersecurity interviews",
      "Role-specific prep",
    ],
  },

  /* --- Project Mentorship --------------------------------------------------- */
  {
    slug: "project-idea-selection",
    title: "Project Idea & Technology Selection",
    description:
      "Picking a project worth your time, and the stack that won't fight you halfway through.",
    icon: "Lightbulb",
    group: "projects",
    backing: "guidance",
    topics: [
      "Idea selection",
      "Scoping",
      "Technology choices",
      "Effort estimation",
    ],
  },
  {
    slug: "project-implementation",
    title: "Implementation & Debugging Support",
    description:
      "Hands-on guidance while you build — architecture reviews, unblocking, and code that holds up.",
    icon: "Wrench",
    group: "projects",
    backing: "guidance",
    topics: [
      "Architecture review",
      "Implementation guidance",
      "Debugging help",
      "Code structure",
    ],
  },
  {
    slug: "project-deployment-presentation",
    title: "Deployment & Portfolio Presentation",
    description:
      "Getting it live, then presenting it so it counts for something in an application.",
    icon: "Rocket",
    group: "projects",
    backing: "guidance",
    topics: [
      "Deployment",
      "Documentation",
      "Portfolio presentation",
      "Demo preparation",
    ],
  },
];

/** Group ordering on the homepage — cybersecurity first, it's his profession. */
export const groupOrder: CategoryGroupKey[] = [
  "cybersecurity",
  "ai_ml",
  "data_science",
  "programming",
  "career",
  "interview",
  "projects",
];
