/**
 * The hero. A real HTTP exchange — this audience will read it, and getting it
 * wrong is fatal. The response headers are the headers this site actually
 * serves, so the hero doubles as the evidence for the claim in §Contact.
 */

export type Header = { name: string; value: string };

export const request = {
  startLine: "GET /.well-known/security-researcher HTTP/1.1",
  headers: [
    { name: "Host", value: "chandanbanawade.com" },
    { name: "Accept", value: "application/json" },
    { name: "Accept-Language", value: "en-IN, en;q=0.9" },
    { name: "X-Requested-Profile", value: "offensive-security" },
    { name: "X-Scope", value: "web, api, mobile, cloud, network" },
    { name: "X-Intent", value: "mentorship" },
    { name: "User-Agent", value: "hiring-manager/2.0" },
    { name: "Connection", value: "close" },
  ] satisfies Header[],
};

export const response = {
  statusLine: "HTTP/1.1 200 OK",
  headers: [
    { name: "Content-Type", value: "application/json; charset=utf-8" },
    { name: "X-Role", value: "Security Consultant — C9Lab (Pinak Infosec)" },
    { name: "X-Rank", value: "#13 global, highest critical reputation" },
    { name: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { name: "X-Frame-Options", value: "DENY" },
    { name: "X-Content-Type-Options", value: "nosniff" },
  ] satisfies Header[],
  body: {
    name: "Chandan Banawade",
    based: "Indore, IN",
    disclosed: 500,
    programs: 500,
    hackerone: {
      india_rank: 5,
      global_critical_rank: 13,
      as_of: "2023-Q2",
    },
    nciipc_acknowledgements: 60,
    team_size: 12,
    mentors_in: ["cybersecurity", "ai-ml", "data-science"],
    consultation: "free, 15 min",
    available_for: ["1:1 mentorship", "pentest engagements", "full-time", "speaking"],
  } as const,
};

/** Pretty-printed once at module scope so the client does no work for it. */
export const responseBodyLines = JSON.stringify(response.body, null, 2).split("\n");
