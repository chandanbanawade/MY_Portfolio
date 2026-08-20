export type Metric = {
  /** Numeric portion — animated. */
  value: number;
  /** Rendered immediately after the number, e.g. "+" or "#". */
  suffix?: string;
  prefix?: string;
  label: string;
  /** Where the number comes from. Every figure carries provenance. */
  provenance: string;
};

export const metrics: Metric[] = [
  {
    value: 500,
    suffix: "+",
    label: "Vulnerabilities disclosed",
    provenance: "Coordinated disclosure, 2021–present",
  },
  {
    value: 500,
    suffix: "+",
    label: "Programs tested",
    provenance: "Public and private bug bounty scopes",
  },
  {
    value: 13,
    prefix: "#",
    label: "Global — highest critical reputation",
    provenance: "HackerOne, Q2 2023 · Top 5 in India",
  },
  {
    value: 60,
    suffix: "+",
    label: "NCIIPC acknowledgements",
    provenance: "Indian critical infrastructure disclosures",
  },
];
