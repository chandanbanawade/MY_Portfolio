export type Role = {
  org: string;
  orgNote?: string;
  title: string;
  start: string;
  /** ISO date for <time datetime>. */
  startISO: string;
  end: string;
  endISO?: string;
  location: string;
  /** Three bullets, maximum. Achievement-led. */
  points: string[];
};

export const experience: Role[] = [
  {
    org: "C9Lab",
    orgNote: "Pinak Infosec",
    title: "Security Consultant",
    start: "Oct 2024",
    startISO: "2024-10",
    end: "Present",
    location: "Indore, India",
    points: [
      "Leads a 12-person testing team across web, API, mobile, cloud and network engagements.",
      "Built the automated scanning and recon framework the team runs on — cut assessment time 35% and raised finding accuracy 40%.",
      "Documented 100+ vulnerabilities with CVSS scoring, reproducible proof-of-concept and executive reporting for client leadership.",
    ],
  },
  {
    org: "Independent bug bounty",
    title: "Security Researcher",
    start: "Aug 2021",
    startISO: "2021-08",
    end: "Present",
    location: "Remote",
    points: [
      "500+ vulnerabilities disclosed across 500+ public and private programs.",
      "Reached Top 5 in India and #13 globally for highest critical reputation on HackerOne, Q2 2023.",
      "60+ acknowledgements from NCIIPC for findings in Indian critical infrastructure.",
    ],
  },
  {
    org: "Cyberops Infosec LLP",
    title: "Security Intern",
    start: "Feb 2022",
    startISO: "2022-02",
    end: "May 2022",
    endISO: "2022-05",
    location: "Jaipur, India",
    points: [
      "Ran web application assessments against client scopes and wrote the findings up for delivery.",
      "Built familiarity with the full engagement cycle — scoping, testing, reporting, retest.",
    ],
  },
  {
    org: "GPCSSIP — Gurugram Cyber Cell",
    title: "Cyber Security Trainee",
    start: "Jan 2021",
    startISO: "2021-01",
    end: "Mar 2021",
    endISO: "2021-03",
    location: "Gurugram, India",
    points: [
      "Assisted on cybercrime case analysis alongside law-enforcement investigators.",
      "First exposure to digital forensics and evidence handling under process.",
    ],
  },
];
