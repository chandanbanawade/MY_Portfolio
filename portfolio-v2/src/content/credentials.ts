export type Certification = {
  name: string;
  issuer: string;
  id?: string;
};

export type Education = {
  degree: string;
  institution: string;
  start: string;
  end: string;
  endISO: string;
};

export const certifications: Certification[] = [
  { name: "CEH Practical", issuer: "EC-Council", id: "ECC9270581634" },
  { name: "Certified AppSec Practitioner", issuer: "The SecOps Group" },
  { name: "ISO/IEC 27001 Associate", issuer: "SkillFront" },
];

export const memberships: Certification[] = [
  { name: "Strike Force member", issuer: "Yogosha" },
];

export const education: Education = {
  degree: "B.Tech, Computer Science & Engineering",
  institution: "Oriental University, Indore",
  start: "2020",
  end: "2024",
  endISO: "2024",
};
