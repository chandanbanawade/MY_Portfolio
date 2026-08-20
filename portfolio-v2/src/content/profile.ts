export type Availability = {
  label: string;
  detail: string;
};

export type Profile = {
  name: string;
  /** One line. Not a pipe-separated keyword list. */
  positioning: string;
  role: string;
  employer: string;
  employerParent: string;
  location: string;
  relocation: string;
  /** Split so the address is assembled in the client, never shipped as one string. */
  emailUser: string;
  emailDomain: string;
  /** Phone stored as digits only; formatted at render time. */
  phoneCC: string;
  phoneRest: string;
  linkedin: string;
  linkedinHandle: string;
  /** LinkedIn activity feed — posts, wins and event photos, kept current there. */
  linkedinActivity: string;
  hackerone: string;
  hackeroneHandle: string;
  cvPath: string;
  siteUrl: string;
  /**
   * Point this at the booking platform's wizard (e.g. "https://…/book") and
   * every session button deep-links into it. Left empty, the buttons fall
   * through to the contact section — see src/lib/booking.ts.
   */
  bookingBaseUrl: string;
  availability: Availability[];
};

export const profile: Profile = {
  name: "Chandan Banawade",
  positioning:
    "I find the flaws that survive a scanner — broken authorisation, chained SSRF, business logic that pays out. 500+ disclosed across 500+ programs, and I mentor 1-to-1 in security, AI/ML and data science.",
  role: "Security Consultant",
  employer: "C9Lab",
  employerParent: "Pinak Infosec",
  location: "Indore, India",
  relocation: "Open to remote & relocation",
  emailUser: "banawadechandan",
  emailDomain: "gmail.com",
  phoneCC: "91",
  phoneRest: "8871211073",
  linkedin: "https://www.linkedin.com/in/chandanbanawade",
  linkedinHandle: "/in/chandanbanawade",
  linkedinActivity: "https://www.linkedin.com/in/chandanbanawade/recent-activity/all/",
  hackerone: "https://hackerone.com/",
  hackeroneHandle: "HackerOne",
  cvPath: "/chandan-banawade-cv.pdf",
  siteUrl: "https://chandanbanawade.com",
  bookingBaseUrl: "",
  availability: [
    {
      label: "1-to-1 mentorship",
      detail: "Security, AI/ML and data science. From a free 15-minute consultation.",
    },
    {
      label: "Pentest engagements",
      detail: "Web, API, mobile, cloud and network scopes. Retest included.",
    },
    {
      label: "Full-time roles",
      detail: "Product security and offensive teams. Remote or relocation.",
    },
    {
      label: "Speaking",
      detail: "Universities, law-enforcement training, community meetups.",
    },
  ],
};
