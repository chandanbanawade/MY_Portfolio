export type NavItem = {
  /** Section number, printed like a report contents page. */
  index: string;
  label: string;
  href: string;
};

/**
 * A contiguous 01–06 run, so the bar reads as a contents page rather than a
 * list with gaps in it. Framework (07) and Contact (08) sit below; Contact has
 * its own button at the right of the nav.
 */
export const navItems: NavItem[] = [
  { index: "01", label: "Findings", href: "#findings" },
  { index: "02", label: "Speaking", href: "#speaking" },
  { index: "03", label: "Mentorship", href: "#mentorship" },
  { index: "04", label: "Sessions", href: "#sessions" },
  { index: "05", label: "Capabilities", href: "#capabilities" },
  { index: "06", label: "Experience", href: "#experience" },
];
