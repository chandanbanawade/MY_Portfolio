/**
 * PROJECTS & PROFESSIONAL WORK
 * =============================================================================
 * Every project below is supported by Chandan's CV. Nothing here is invented.
 *
 * GitHub / demo links: `github` and `demo` are intentionally EMPTY. The CV does
 * not list any repository or demo URLs, and inventing one would be a fabricated
 * claim. Add your real URLs here and the buttons appear automatically; leave
 * them blank and no button is rendered.
 *
 * Images: drop a file in /public/projects/ and set `image: "/projects/x.png"`.
 * Without one, a generated cover with the project initials is used.
 */

export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** The measurable outcome, only where the CV states one. */
  result?: string;
  tech: string[];
  tags: string[];
  image?: string;
  /** Leave blank unless you have a genuine URL. */
  github?: string;
  demo?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ai-recon-framework",
    title: "AI-Powered Reconnaissance & Vulnerability Discovery Framework",
    summary:
      "A security automation tool integrating Nmap, Subfinder, Amass and Nuclei with AI-assisted exploitation techniques. Deployed for red team engagements, attack surface management and client security assessments.",
    result:
      "Reduced reconnaissance time by 30% · improved endpoint discovery accuracy by 45%",
    tech: [
      "Python",
      "Nmap",
      "Subfinder",
      "Amass",
      "Nuclei",
      "AI-assisted exploitation",
    ],
    tags: ["Security Automation", "AI"],
    github: "",
    demo: "",
    featured: true,
  },
  {
    slug: "automated-vuln-scanning",
    title: "Automated Vulnerability Scanning Framework",
    summary:
      "An automated scanning framework architected at C9Lab that layers AI-assisted exploitation over conventional tooling, used across enterprise penetration testing engagements.",
    result: "Reduced testing time by 35% · improved accuracy by 40%",
    tech: ["Python", "Bash", "AI-assisted exploitation", "Security automation"],
    tags: ["Security Automation", "AI"],
    github: "",
    demo: "",
    featured: true,
  },
  {
    slug: "bug-bounty-research",
    title: "Bug Bounty & Vulnerability Research",
    summary:
      "500+ vulnerabilities responsibly disclosed across 500+ programs on HackerOne, Yogosha, Zerocopter and Bugcrowd — including critical SQL Injection, XSS, SSRF, broken authentication and mass assignment findings for Fortune 500 and government targets.",
    result:
      "Top 5 Hacker in India · Rank #13 globally for Highest Critical Reputation (Q2 2023)",
    tech: ["Burp Suite Pro", "Nuclei", "SQLmap", "OWASP ZAP"],
    tags: ["Bug Bounty", "Research"],
    github: "",
    demo: "",
    featured: true,
  },
  {
    slug: "enterprise-vapt",
    title: "Enterprise Penetration Testing Engagements",
    summary:
      "White, black and grey box penetration testing across networks, applications, APIs, cloud environments and infrastructure for banking, fintech, healthcare and e-commerce clients — delivered with CVSS scoring, proof-of-concept exploits and remediation strategy.",
    result: "100+ vulnerabilities identified and documented for enterprise clients",
    tech: ["Burp Suite Pro", "Metasploit", "Nessus", "Wireshark", "OWASP ZAP"],
    tags: ["Penetration Testing", "Consulting"],
    github: "",
    demo: "",
  },
  {
    slug: "incident-response-dfir",
    title: "Incident Response & Digital Forensics",
    summary:
      "Incident response and DFIR support for client incidents, covering ransomware mitigation, root-cause investigation, evidence preservation and data recovery.",
    tech: [
      "Digital forensics",
      "Threat analysis",
      "Evidence preservation",
      "Ransomware mitigation",
    ],
    tags: ["Incident Response"],
    github: "",
    demo: "",
  },
  {
    slug: "api-security-testing",
    title: "API & Web Application Security Testing",
    summary:
      "REST and GraphQL API testing for Broken Object Level Authorization, broken authentication and mass assignment, alongside web application testing with Burp Suite Professional and OWASP ZAP.",
    tech: ["Burp Suite Pro", "OWASP ZAP", "REST", "GraphQL"],
    tags: ["Penetration Testing", "Research"],
    github: "",
    demo: "",
  },
];

/** Filter chips above the project grid — only shown if they match something. */
export const projectFilters = [
  "All",
  "Security Automation",
  "Bug Bounty",
  "Penetration Testing",
  "AI",
  "Incident Response",
  "Research",
] as const;
