
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({ block: "start" });
  return true;
}

/** Jumps to the top instantly (used when changing pages). */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
