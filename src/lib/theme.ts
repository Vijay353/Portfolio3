/** Flip the theme, persist the choice, and notify listeners (ThemeToggle, palette). */
export function toggleTheme(): "light" | "dark" {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* private mode: theme still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  return next;
}
