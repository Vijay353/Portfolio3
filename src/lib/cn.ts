/** Joins class names, skipping falsy values. Small enough that clsx/tailwind-merge aren't needed. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
