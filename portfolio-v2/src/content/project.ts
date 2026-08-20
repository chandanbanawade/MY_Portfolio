export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  name: string;
  summary: string;
  body: string[];
  stack: string[];
  metrics: ProjectMetric[];
  /** Where it runs in practice. */
  deployment: string;
};

export const project: Project = {
  name: "Recon & vulnerability discovery framework",
  summary:
    "An orchestration layer over the recon toolchain, with model-assisted triage on the output. Built because the slow part of an engagement was never the scanning — it was deciding what mattered.",
  body: [
    "Chains Nmap, Subfinder, Amass and Nuclei into a single pass over a scope, normalising every tool's output into one findings schema instead of four incompatible ones.",
    "A language model sits on the triage step, not the exploitation step: it clusters near-duplicate results, drafts the reproduction steps, and ranks candidates for manual review. Every finding is still confirmed by hand before it reaches a report.",
    "Runs on red team engagements and continuous attack surface monitoring, where the same scope is re-walked on a schedule and only the delta gets attention.",
  ],
  stack: ["Nmap", "Subfinder", "Amass", "Nuclei", "Python", "LLM-assisted triage"],
  metrics: [
    { value: "30%", label: "Reduction in recon time" },
    { value: "45%", label: "Improvement in endpoint discovery accuracy" },
  ],
  deployment: "In use at C9Lab for red team engagements and attack surface management",
};
