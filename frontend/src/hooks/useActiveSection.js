import { useEffect, useState } from "react";

/**
 * Tracks which section (by id) is currently in view, for navbar highlighting.
 * `ids` must be a stable array (module-level constant).
 */
export default function useActiveSection(ids, enabled = true) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!enabled) return undefined;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids, enabled]);

  return active;
}
