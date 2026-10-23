import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { X, Menu, History, Gift } from "lucide-react";
import Logo from "../brand/Logo";
import PointsBadge from "./PointsBadge";
import useActiveSection from "../../hooks/useActiveSection";
import { NAV_SECTIONS, SECTION_IDS } from "../../constants/content";
import { HOME_PATH } from "../../constants/navigation";
import { scrollToSection, scrollToTop } from "../../utils/scroll";

/**
 * The one and only navbar, rendered by <Layout /> on every page.
 * - Section links scroll smoothly on the scan page, and navigate there first
 *   (then scroll) when you're on another page.
 * - The Eco Points badge and Rewards button are always visible, on every
 *   screen size, and both lead to the rewards page.
 */
export default function Navbar({ earned = 0, hasReport = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onHome = pathname === HOME_PATH;
  const activeSection = useActiveSection(SECTION_IDS, onHome);

  function goToSection(event, id) {
    event.preventDefault();
    setMenuOpen(false);

    if (onHome) {
      if (id === "home") scrollToTop();
      else scrollToSection(id);
      return;
    }

    navigate({ pathname: HOME_PATH, hash: `#${id}` });
  }

  const sectionClass = (active) =>
    `text-sm transition ${
      active
        ? "font-semibold text-emerald-800"
        : "font-medium text-gray-600 hover:text-emerald-800"
    }`;

  const pageClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 text-sm transition ${
      isActive
        ? "font-semibold text-emerald-800"
        : "font-medium text-gray-600 hover:text-emerald-800"
    }`;

  const mobileClass = (active) =>
    `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium hover:bg-emerald-50 ${
      active ? "bg-emerald-50 text-emerald-800" : "text-gray-700"
    }`;

  const mobilePageClass = ({ isActive }) => mobileClass(isActive);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/[0.06] bg-[#fbfcf8]/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
      >
        <a
          href={`${HOME_PATH}#home`}
          onClick={(e) => goToSection(e, "home")}
          aria-label="EcoScan home"
          className="shrink-0"
        >
          <Logo />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`${HOME_PATH}#${id}`}
              onClick={(e) => goToSection(e, id)}
              className={sectionClass(onHome && activeSection === id)}
              aria-current={onHome && activeSection === id ? "true" : undefined}
            >
              {label}
            </a>
          ))}

          <span aria-hidden="true" className="h-5 w-px bg-gray-200" />

          <NavLink to="/history" className={pageClass}>
            <History size={16} />
            History
          </NavLink>

          {hasReport && (
            <NavLink to="/report" className={pageClass}>
              Report
            </NavLink>
          )}
        </div>

        {/* Rewards area: always visible */}
        <div className="flex items-center gap-2">
          <PointsBadge points={earned} onNavigate={() => setMenuOpen(false)} />

          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `hidden items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition sm:inline-flex ${
                isActive
                  ? "bg-emerald-900 ring-2 ring-emerald-300"
                  : "bg-emerald-800 hover:bg-emerald-900"
              }`
            }
          >
            <Gift size={15} />
            Rewards
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="space-y-1 border-t border-gray-100 bg-white p-4 lg:hidden">
          {NAV_SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`${HOME_PATH}#${id}`}
              onClick={(e) => goToSection(e, id)}
              className={mobileClass(onHome && activeSection === id)}
            >
              {label}
            </a>
          ))}

          <div className="my-2 h-px bg-gray-100" />

          <NavLink
            to="/history"
            onClick={() => setMenuOpen(false)}
            className={mobilePageClass}
          >
            <History size={16} />
            History
          </NavLink>

          {hasReport && (
            <NavLink
              to="/report"
              onClick={() => setMenuOpen(false)}
              className={mobilePageClass}
            >
              Report
            </NavLink>
          )}

          <NavLink
            to="/offers"
            onClick={() => setMenuOpen(false)}
            className={mobilePageClass}
          >
            <Gift size={16} />
            Rewards
          </NavLink>
        </div>
      )}
    </header>
  );
}
