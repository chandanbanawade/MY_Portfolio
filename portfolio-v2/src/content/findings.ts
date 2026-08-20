export type Severity = "Critical" | "High" | "Medium" | "Low";

export type VulnClass =
  | "SQL Injection"
  | "SSRF"
  | "Broken Authentication"
  | "Mass Assignment"
  | "Business Logic"
  | "BOLA"
  | "XSS"
  | "Data Exposure";

export type Finding = {
  id: string;
  vulnClass: VulnClass;
  severity: Severity;
  cvss: number;
  /** CVSS:3.1 vector string. Kept accurate — this audience reads them. */
  vector: string;
  /**
   * Sector descriptor, not the client name. Everything below is either under
   * NDA or under coordinated disclosure that does not name the target.
   */
  target: string;
  /** Impact-first. What an attacker could do, not what tool found it. */
  impact: string;
  /** Terse note on how it was reached. */
  method: string;
  year: string;
  status: string;
  bounty: boolean;
  /**
   * Public write-up, where one exists. Intentionally null across the board —
   * no report URL is published here that cannot be verified.
   */
  disclosure: string | null;
};

export const findings: Finding[] = [
  {
    id: "F-01",
    vulnClass: "SSRF",
    severity: "Critical",
    cvss: 9.1,
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
    target: "CDN & edge delivery platform",
    impact:
      "An unauthenticated request could reach the cloud instance metadata service and return short-lived role credentials for the origin fleet.",
    method:
      "Blind SSRF in a URL-preview endpoint, escalated via a redirect chain that survived the allow-list check.",
    year: "2023",
    status: "Fixed · bounty awarded",
    bounty: true,
    disclosure: null,
  },
  {
    id: "F-02",
    vulnClass: "SQL Injection",
    severity: "Critical",
    cvss: 9.8,
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    target: "State government citizen services portal",
    impact:
      "Pre-authentication injection in a search parameter exposed the full citizen record table, including identity document numbers.",
    method:
      "Time-based blind injection confirmed manually, then bounded to read-only proof to avoid touching production data.",
    year: "2022",
    status: "Fixed · NCIIPC acknowledged",
    bounty: false,
    disclosure: null,
  },
  {
    id: "F-03",
    vulnClass: "BOLA",
    severity: "High",
    cvss: 8.1,
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
    target: "Multi-tenant B2B SaaS — REST API",
    impact:
      "Any authenticated user could read and modify records belonging to other tenants by substituting the object identifier; the tenant boundary was enforced in the UI only.",
    method:
      "Object identifiers were sequential; authorisation was checked at the route, never at the record.",
    year: "2024",
    status: "Fixed · retest passed",
    bounty: false,
    disclosure: null,
  },
  {
    id: "F-04",
    vulnClass: "Mass Assignment",
    severity: "High",
    cvss: 8.8,
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H",
    target: "Gaming payments platform",
    impact:
      "A standard account could promote itself to an administrative role by adding one unbound field to the profile-update body.",
    method:
      "The update handler bound the whole request object to the model; the role field was never in the UI, only in the schema.",
    year: "2023",
    status: "Fixed · bounty awarded",
    bounty: true,
    disclosure: null,
  },
  {
    id: "F-05",
    vulnClass: "Broken Authentication",
    severity: "High",
    cvss: 8.1,
    vector: "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:N",
    target: "Telecom super-app — account recovery",
    impact:
      "The one-time-passcode step could be skipped entirely by replaying the post-verification state transition, giving takeover of any account from a phone number alone.",
    method:
      "Recovery was a multi-step flow where step three trusted a client-supplied marker that step two set.",
    year: "2023",
    status: "Fixed · coordinated disclosure",
    bounty: false,
    disclosure: null,
  },
  {
    id: "F-06",
    vulnClass: "Business Logic",
    severity: "High",
    cvss: 7.5,
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:H/A:N",
    target: "Quick-service restaurant ordering platform",
    impact:
      "Promotional credit could be applied an unbounded number of times to a single order, driving the payable total to zero at checkout.",
    method:
      "The discount was validated per request rather than per cart; concurrent applications raced the balance check.",
    year: "2022",
    status: "Fixed · bounty awarded",
    bounty: true,
    disclosure: null,
  },
  {
    id: "F-07",
    vulnClass: "Data Exposure",
    severity: "Medium",
    cvss: 5.3,
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
    target: "Eyewear retail — internal tooling",
    impact:
      "An unauthenticated build artefact exposed internal service hostnames and a staging API key, narrowing the attack surface for a follow-on attempt.",
    method:
      "Source map left in the production bundle; keys recovered from the unminified chunk.",
    year: "2023",
    status: "Fixed · bounty awarded",
    bounty: true,
    disclosure: null,
  },
  {
    id: "F-08",
    vulnClass: "XSS",
    severity: "Medium",
    cvss: 5.4,
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N",
    target: "Remote-access software vendor — web console",
    impact:
      "A stored payload in a device label executed in an administrator's session, allowing actions to be issued as that administrator.",
    method:
      "Label field sanitised on write but rendered unescaped in the audit-log view.",
    year: "2022",
    status: "Fixed · acknowledged",
    bounty: false,
    disclosure: null,
  },
];

export const severityOrder: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export const vulnClasses = Array.from(
  new Set(findings.map((f) => f.vulnClass)),
).sort() as VulnClass[];
