export type Recognition = {
  name: string;
  /** True where the program paid a bounty, not only an acknowledgement. */
  bounty: boolean;
  sector: string;
};

/**
 * Wordmarks are set in the display face — no scraped logo PNGs.
 * `bounty: true` gets a distinct typographic treatment; that distinction
 * is the part this audience actually reads.
 */
export const hallOfFame: Recognition[] = [
  { name: "Google", bounty: false, sector: "Platform" },
  { name: "United Nations", bounty: false, sector: "Intergovernmental" },
  { name: "Sony", bounty: false, sector: "Consumer electronics" },
  { name: "Lenovo", bounty: false, sector: "Hardware" },
  { name: "TeamViewer", bounty: false, sector: "Remote access" },
  { name: "Reliance Jio", bounty: false, sector: "Telecom" },
  { name: "Burger King France", bounty: true, sector: "QSR" },
  { name: "Lenskart", bounty: true, sector: "Retail" },
  { name: "G-Core Labs", bounty: true, sector: "CDN & edge" },
  { name: "Xsolla", bounty: true, sector: "Gaming payments" },
  { name: "BU-CERT", bounty: false, sector: "Academic CERT" },
  { name: "NCIIPC", bounty: false, sector: "Government — 60+ acks" },
];
