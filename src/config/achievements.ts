/**
 * ACHIEVEMENTS — every entry below is taken verbatim from Chandan's CV.
 * Do not add anything here that the CV does not state.
 */

export type Achievement = {
  title: string;
  detail: string;
  icon: string;
  /** Optional highlight figure rendered large on the card. */
  metric?: string;
};

export const achievements: Achievement[] = [
  {
    metric: "500+",
    title: "Vulnerabilities responsibly disclosed",
    detail:
      "Across 500+ programs for Fortune 500 companies and government organisations, on HackerOne, Yogosha, Zerocopter and Bugcrowd.",
    icon: "Bug",
  },
  {
    metric: "Top 5",
    title: "Hacker in India — HackerOne",
    detail:
      "Achieved Top 5 ranking in India on HackerOne in Q2 2023.",
    icon: "Trophy",
  },
  {
    metric: "#13",
    title: "Globally — Highest Critical Reputation",
    detail:
      "Ranked #13 worldwide for Highest Critical Reputation on HackerOne in Q2 2023.",
    icon: "Globe",
  },
  {
    metric: "Top 5",
    title: "Security Researcher — Reliance Jio",
    detail:
      "Top 5 Security Researcher in the Reliance Jio Bug Bounty Program, Q2 2023.",
    icon: "Award",
  },
  {
    metric: "60+",
    title: "NCIIPC acknowledgements",
    detail:
      "60+ vulnerability acknowledgements for reports on Indian Government infrastructure.",
    icon: "ShieldCheck",
  },
  {
    title: "Yogosha Strike Force",
    detail:
      "Member of the Yogosha Strike Force — an exclusive, invite-only security researcher program.",
    icon: "Users",
  },
  {
    metric: "12+",
    title: "Security professionals led",
    detail:
      "Leads a team of 12+ security professionals at C9Lab, delivering assessments across banking, fintech, healthcare and e-commerce.",
    icon: "Users",
  },
  {
    title: "Monetary bounty awards",
    detail:
      "Bounties received from G-Core Labs, Xsolla Gaming, Burger King France and Lenskart for high-severity findings.",
    icon: "CircleDollarSign",
  },
];

/**
 * Hall of Fame recognition — organisations listed in the CV.
 * These are recognitions for disclosed vulnerabilities, not clients or employers.
 */
export const hallOfFame = [
  "Google",
  "United Nations",
  "Sony",
  "Lenovo",
  "TeamViewer",
  "Reliance Jio",
  "Burger King France",
  "Lenskart",
  "G-Core Labs",
  "Xsolla Gaming",
  "BU-CERT",
  "NCIIPC",
];
