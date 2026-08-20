export type Depth = "Primary" | "Regular" | "Supporting";

export type Capability = {
  surface: string;
  depth: Depth;
  detail: string;
};

export type ToolGroup = {
  label: string;
  items: string[];
};

/** A matrix — surface against depth. Not a tag cloud, not percentage bars. */
export const capabilities: Capability[] = [
  {
    surface: "Web application",
    depth: "Primary",
    detail: "Authorisation, session handling, injection, business logic",
  },
  {
    surface: "API — REST & GraphQL",
    depth: "Primary",
    detail: "BOLA, mass assignment, schema introspection, rate-limit bypass",
  },
  {
    surface: "Mobile — iOS & Android",
    depth: "Regular",
    detail: "Static and dynamic analysis, traffic interception, local storage",
  },
  {
    surface: "Cloud — AWS, Azure, GCP",
    depth: "Regular",
    detail: "IAM misconfiguration, metadata exposure, storage permissions",
  },
  {
    surface: "Network & infrastructure",
    depth: "Regular",
    detail: "External and internal footprint, service exposure, segmentation",
  },
  {
    surface: "Wi-Fi",
    depth: "Supporting",
    detail: "Rogue access points, WPA handshake capture, client isolation",
  },
  {
    surface: "Red team operations",
    depth: "Regular",
    detail: "Threat emulation, initial access, lateral movement",
  },
  {
    surface: "Threat modelling & ASM",
    depth: "Regular",
    detail: "Attack surface discovery, design review, prioritisation",
  },
  {
    surface: "DFIR",
    depth: "Supporting",
    detail: "Incident triage, artefact collection, timeline reconstruction",
  },
];

export const toolGroups: ToolGroup[] = [
  {
    label: "Tooling",
    items: [
      "Burp Suite Pro",
      "Nuclei",
      "Metasploit",
      "Nmap",
      "sqlmap",
      "OWASP ZAP",
      "Nessus",
      "Subfinder",
      "Amass",
      "ffuf",
    ],
  },
  {
    label: "Frameworks",
    items: [
      "OWASP Top 10",
      "OWASP API Top 10",
      "SANS Top 25",
      "PTES",
      "NIST SP 800-115",
      "MITRE ATT&CK",
      "PCI-DSS",
      "ISO/IEC 27001",
    ],
  },
  {
    label: "Reporting",
    items: ["CVSS v3.1 scoring", "Reproducible PoC", "Executive summary", "Remediation retest"],
  },
];
