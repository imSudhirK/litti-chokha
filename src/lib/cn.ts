/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately not `tailwind-merge`: components in this app compose classes
 * additively rather than overriding each other, so the extra dependency would
 * not earn its place. Reach for it only if conflicting utilities show up.
 */
export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
