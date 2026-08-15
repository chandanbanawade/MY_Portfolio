/**
 * BUG BOUNTY & VULNERABILITY RESEARCH
 * =============================================================================
 * SOURCE: Chandan Banawade's CV, verbatim. Nothing here is inferred or invented.
 *
 * CV lines this file encodes:
 *   · "Discovered and responsibly disclosed 500+ vulnerabilities across 500+
 *      programs for Fortune 500 companies and government organizations."
 *   · "Achieved Top 5 Hacker in India and Rank #13 globally for Highest Critical
 *      Reputation on HackerOne (Q2 2023)."
 *   · "Ranked Top 5 Security Researcher in the Reliance Jio Bug Bounty Program
 *      (Q2 2023)."
 *   · "Reported 60+ vulnerabilities to Indian Government infrastructure,
 *      acknowledged by NCIIPC."
 *   · "Received monetary bounties from G-Core Labs, Xsolla Gaming, Burger King
 *      France, and Lenskart for high-severity findings."
 *   · "Member of Yogosha Strike Force – Exclusive security researcher program."
 *   · Hall of Fame: Google, United Nations, Sony, Lenovo, TeamViewer, Reliance
 *      Jio, Burger King France, Lenskart, G-Core Labs, Xsolla Gaming, BU-CERT.
 */

/* --- Headline counters ----------------------------------------------------- */

export const bugBountyStats = [
  { value: "500+", label: "Vulnerabilities disclosed", sub: "Across 500+ programs" },
  { value: "Top 5", label: "Hacker in India", sub: "HackerOne · Q2 2023" },
  { value: "#13", label: "Globally", sub: "Highest Critical Reputation" },
  { value: "60+", label: "NCIIPC acknowledgements", sub: "Indian Govt. infrastructure" },
];

/* --- Platforms ------------------------------------------------------------- */

export type Platform = {
  name: string;
  note: string;
  /** Set true only where the CV states a distinction. */
  highlight?: string;
};

export const platforms: Platform[] = [
  {
    name: "HackerOne",
    note: "Primary platform since 2021",
    highlight: "Top 5 in India · #13 globally (Q2 2023)",
  },
  {
    name: "Yogosha",
    note: "Invite-only European platform",
    highlight: "Member of Yogosha Strike Force",
  },
  { name: "Zerocopter", note: "Managed vulnerability research" },
  { name: "Bugcrowd", note: "Public and private programs" },
];

/* --- Rankings -------------------------------------------------------------- */

export type Ranking = {
  rank: string;
  title: string;
  detail: string;
  period: string;
  icon: string;
};

export const rankings: Ranking[] = [
  {
    rank: "Top 5",
    title: "Hacker in India",
    detail: "HackerOne country leaderboard",
    period: "Q2 2023",
    icon: "Trophy",
  },
  {
    rank: "#13",
    title: "Highest Critical Reputation — Global",
    detail: "HackerOne worldwide ranking",
    period: "Q2 2023",
    icon: "Globe",
  },
  {
    rank: "Top 5",
    title: "Security Researcher — Reliance Jio",
    detail: "Reliance Jio Bug Bounty Program",
    period: "Q2 2023",
    icon: "Award",
  },
  {
    rank: "Member",
    title: "Yogosha Strike Force",
    detail: "Exclusive, invite-only researcher program",
    period: "Active",
    icon: "Users",
  },
];

/* --- Organisations that acknowledged findings ------------------------------- */

export type Target = {
  name: string;
  /** hall_of_fame = acknowledged the disclosure · bounty = paid a bounty */
  kind: "hall_of_fame" | "bounty" | "government";
  category: string;
};

export const targets: Target[] = [
  { name: "Google", kind: "hall_of_fame", category: "Technology" },
  { name: "United Nations", kind: "hall_of_fame", category: "International" },
  { name: "Sony", kind: "hall_of_fame", category: "Technology" },
  { name: "Lenovo", kind: "hall_of_fame", category: "Technology" },
  { name: "TeamViewer", kind: "hall_of_fame", category: "Software" },
  { name: "Reliance Jio", kind: "hall_of_fame", category: "Telecom" },
  { name: "Burger King France", kind: "bounty", category: "Retail" },
  { name: "Lenskart", kind: "bounty", category: "E-commerce" },
  { name: "G-Core Labs", kind: "bounty", category: "Cloud & CDN" },
  { name: "Xsolla Gaming", kind: "bounty", category: "Gaming" },
  { name: "BU-CERT", kind: "hall_of_fame", category: "Education" },
  { name: "NCIIPC", kind: "government", category: "Indian Government" },
];

export const targetKindLabels: Record<Target["kind"], string> = {
  hall_of_fame: "Hall of Fame",
  bounty: "Paid bounty",
  government: "Government",
};

/* --- Vulnerability classes found ------------------------------------------- */

export const vulnerabilityClasses = [
  { name: "SQL Injection", severity: "Critical" },
  { name: "Cross-Site Scripting (XSS)", severity: "High" },
  { name: "Server-Side Request Forgery (SSRF)", severity: "Critical" },
  { name: "Broken Authentication", severity: "Critical" },
  { name: "Mass Assignment", severity: "High" },
  { name: "Business Logic Flaws", severity: "High" },
  { name: "Authentication Bypass", severity: "Critical" },
  { name: "Data Exposure", severity: "High" },
];

/* --- Section copy ---------------------------------------------------------- */

export const bugBountyCopy = {
  eyebrow: "Bug bounty",
  title: "500+ vulnerabilities. Disclosed responsibly.",
  description:
    "Since 2021 I've reported security flaws to Fortune 500 companies, government bodies and international organisations — and this is exactly what I mentor people to do themselves.",
};
