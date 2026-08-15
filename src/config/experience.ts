/**
 * ABOUT — profile, experience timeline, education, certifications, speaking.
 * -----------------------------------------------------------------------------
 * Every entry below comes straight from your CV. Keep it that way.
 */

export const profile = {
  /** Two short paragraphs — deliberately not a wall of text. */
  intro: [
    "I'm a Security Consultant at Pinak Infosec (C9 Lab), where I lead a team of 12+ security professionals delivering penetration tests and security assessments across banking, fintech, healthcare and e-commerce.",
    "Alongside client work I've been a security researcher since 2021 — 500+ vulnerabilities responsibly disclosed, with recognition from Google, the United Nations, Sony, Reliance Jio and others, and a Top 5 ranking in India on HackerOne in Q2 2023.",
  ],
  /** Shown as a pull-quote in the About section. */
  mentoringApproach:
    "I mentor the way I wish someone had mentored me: no theory dumps, no 100-hour playlists. We look at where you actually are, find the one or two things genuinely blocking you, and build a plan you can start on the same day.",
};


export type TimelineEntry = {
  role: string;
  org: string;
  location?: string;
  period: string;
  current?: boolean;
  points: string[];
};

export const experience: TimelineEntry[] = [
  {
    role: "Security Consultant",
    org: "C9Lab · Pinak Infosec Pvt. Ltd.",
    location: "Indore, India",
    period: "Oct 2024 — Present",
    current: true,
    points: [
      "Lead a team of 12+ security professionals performing white, black and grey box penetration testing across networks, applications, APIs, cloud environments and infrastructure.",
      "Architected an automated vulnerability scanning framework using AI-assisted exploitation — cutting testing time by 35% and improving accuracy by 40%.",
      "Deliver executive-level reports with CVSS scoring, proof-of-concept exploits and remediation strategy to C-suite stakeholders.",
      "Provide incident response and digital forensics support, including ransomware mitigation and root-cause investigation.",
      "Identified and documented 100+ vulnerabilities, measurably reducing client organisational risk.",
    ],
  },
  {
    role: "Security Researcher & Bug Bounty Hunter",
    org: "HackerOne · Yogosha · Zerocopter · Bugcrowd",
    period: "Aug 2021 — Present",
    current: true,
    points: [
      "Discovered and responsibly disclosed 500+ vulnerabilities across 500+ programs for Fortune 500 companies and government organisations.",
      "Top 5 Hacker in India and Rank #13 globally for Highest Critical Reputation on HackerOne (Q2 2023).",
      "Top 5 Security Researcher in the Reliance Jio Bug Bounty Program (Q2 2023).",
      "Reported 60+ vulnerabilities to Indian Government infrastructure, acknowledged by NCIIPC.",
      "Member of the Yogosha Strike Force — an invite-only researcher program.",
    ],
  },
  {
    role: "Information Security Analyst Intern",
    org: "Cyberops Infosec LLP",
    location: "Jaipur, India",
    period: "Feb 2022 — May 2022",
    points: [
      "Performed web application and API penetration testing with Burp Suite Professional and OWASP ZAP.",
      "Identified critical SQL Injection and SSRF vulnerabilities across multiple client projects.",
      "Tested REST APIs for Broken Object Level Authorization, Broken Authentication and Mass Assignment.",
    ],
  },
  {
    role: "Cybersecurity Intern",
    org: "GPCSSIP · Gurugram Cyber Cell",
    location: "Remote",
    period: "Jan 2021",
    points: [
      "Assisted in digital forensics investigations and cybercrime incident response operations.",
      "Gained hands-on experience in evidence preservation and chain-of-custody procedures.",
    ],
  },
];

export const education = [
  {
    degree: "B.Tech, Computer Science and Engineering",
    org: "Oriental University",
    location: "Indore, Madhya Pradesh",
    period: "2020 — 2024",
  },
];

export const certifications = [
  {
    name: "Certified Ethical Hacker (CEH) Practical",
    issuer: "EC-Council",
    credentialId: "ECC9270581634",
  },
  {
    name: "Certified AppSec Practitioner (CAP)",
    issuer: "The SecOps Group",
  },
  {
    name: "ISO/IEC 27001 Information Security Associate",
    issuer: "SkillFront",
  },
];

export const speaking = [
  {
    title: "Guest Speaker — Cybersecurity Training",
    venues: [
      "Police Radio Training Institute, Indore",
      "VIT Bhopal University",
      "Acropolis Institute, Indore",
    ],
    detail:
      "Ethical hacking, penetration testing and real-world security case studies.",
  },
  {
    title: "Speaker — Hackers Meetup",
    venues: ["Hackers Meetup Events"],
    detail:
      "Vulnerability research and offensive security techniques with the community.",
  },
];
