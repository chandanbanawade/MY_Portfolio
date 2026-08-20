export type Talk = {
  venue: string;
  audience: string;
  topic: string;
  location: string;
};

export const talks: Talk[] = [
  {
    venue: "Police Radio Training Institute",
    audience: "Law enforcement officers",
    topic: "Cybercrime investigation and the attacker's side of a case file",
    location: "Indore",
  },
  {
    venue: "VIT Bhopal University",
    audience: "Undergraduate engineering students",
    topic: "Getting the first bug bounty without a shortcut",
    location: "Bhopal",
  },
  {
    venue: "Acropolis Institute of Technology",
    audience: "Computer science students",
    topic: "Web application security from the report backwards",
    location: "Indore",
  },
  {
    venue: "Hackers Meetup",
    audience: "Practising researchers",
    topic: "Business logic flaws scanners cannot reach",
    location: "Indore",
  },
];
