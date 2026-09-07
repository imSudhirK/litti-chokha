/**
 * The app's navigation registry.
 *
 * Adding a feature to the sidebar is a one-line change here — nothing else in
 * the shell needs to know the feature exists.
 */
export type NavItem = {
  href: string;
  label: string;
  /** Inline SVG path data, drawn on a 24×24 grid with stroke rendering. */
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/todos",
    label: "Todos",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
  {
    href: "/habits",
    label: "Habits",
    icon: "M3 3v18h18M7 15l4-5 3 3 5-7",
  },
];

/** Where a signed-in user lands. */
export const HOME_PATH = "/todos";
