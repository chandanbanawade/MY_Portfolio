/**
 * SKILLS & EXPERTISE
 * -----------------------------------------------------------------------------
 * Taken from the Skills section of your CV, grouped for the web.
 *
 * `verified: false` marks a group containing skills that are NOT evidenced on
 * your current CV. Those render with a subtle "expanding" note so nothing on
 * this site overstates your background. Remove the flag once your CV covers it.
 */

export type SkillGroup = {
  title: string;
  icon: string;
  blurb: string;
  skills: string[];
  verified?: boolean;
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Offensive Security",
    icon: "Crosshair",
    blurb: "Finding what others missed, across every layer of the stack.",
    skills: [
      "Web Penetration Testing",
      "API Testing (REST/GraphQL)",
      "Mobile (iOS/Android)",
      "Network & Infrastructure",
      "Cloud (AWS/Azure/GCP)",
      "Wi-Fi Testing",
      "Red Team Operations",
      "Threat Emulation",
      "White / Black / Grey Box",
    ],
  },
  {
    title: "Application Security",
    icon: "ShieldAlert",
    blurb: "The vulnerability classes behind 500+ disclosed findings.",
    skills: [
      "OWASP Top 10",
      "SQL Injection",
      "XSS",
      "SSRF",
      "Broken Authentication",
      "Mass Assignment",
      "Business Logic Flaws",
      "IDOR / BOLA",
      "Secure Code Review",
    ],
  },
  {
    title: "Security Engineering",
    icon: "ShieldCheck",
    blurb: "Turning findings into a measurably stronger security posture.",
    skills: [
      "Vulnerability Assessment",
      "Risk Assessment",
      "Attack Surface Management",
      "Threat Modeling",
      "CVSS Scoring",
      "Remediation Strategy",
      "Executive Reporting",
    ],
  },
  {
    title: "Incident Response & DFIR",
    icon: "Siren",
    blurb: "What happens after the breach.",
    skills: [
      "Digital Forensics",
      "Threat Analysis",
      "Root Cause Investigation",
      "Evidence Preservation",
      "Ransomware Mitigation",
      "Data Recovery",
      "Incident Documentation",
    ],
  },
  {
    title: "AI-Assisted Security",
    icon: "Cpu",
    blurb:
      "Where my security work and AI overlap — automation frameworks built and deployed on live engagements.",
    skills: [
      "AI-Assisted Exploitation",
      "Automated Recon Pipelines",
      "Security Automation",
      "LLM-Assisted Triage",
      "Python Tooling",
      "API Orchestration",
    ],
  },
  {
    title: "AI / ML & Data",
    icon: "BrainCircuit",
    blurb:
      "Areas I mentor on and continue to build in alongside my security practice.",
    // NOT on your CV — shown with an honest label until you evidence them.
    verified: false,
    skills: [
      "Python for ML",
      "LLMs & Prompt Engineering",
      "RAG Pipelines",
      "Vector Databases",
      "Pandas / NumPy",
      "SQL",
      "Hugging Face",
      "LangChain",
    ],
  },
  {
    title: "Tools",
    icon: "Wrench",
    blurb: "The daily kit.",
    skills: [
      "Burp Suite Pro",
      "OWASP ZAP",
      "Metasploit",
      "Nmap",
      "Wireshark",
      "Nuclei",
      "SQLmap",
      "Nessus",
      "Subfinder",
      "Amass",
    ],
  },
  {
    title: "Frameworks & Compliance",
    icon: "ScrollText",
    blurb: "The standards clients and auditors actually ask for.",
    skills: [
      "OWASP Top 10",
      "SANS Top 25",
      "PTES",
      "NIST",
      "ISO/IEC 27001",
      "MITRE ATT&CK",
      "PCI-DSS",
      "GDPR",
    ],
  },
  {
    title: "Programming",
    icon: "Code2",
    blurb: "For tooling, automation and proof-of-concepts.",
    skills: ["Python", "Bash", "JavaScript"],
  },
];
