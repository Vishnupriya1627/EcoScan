import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "../brand/Logo";
import { scrollToSection, scrollToTop } from "../../utils/scroll";

export default function Footer() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function goTo(event, id) {
    event.preventDefault();

    if (pathname === "/") {
      if (id === "home") scrollToTop();
      else scrollToSection(id);
      return;
    }

    navigate({ pathname: "/", hash: `#${id}` });
  }

  return (
    <footer className="border-t border-emerald-950/[0.07] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <a href="/#home" onClick={(e) => goTo(e, "home")} aria-label="EcoScan home">
          <Logo size={30} className="[&_span:last-child]:!text-lg" />
        </a>

        <p className="text-xs leading-5 text-gray-500">
          Understand your wardrobe. Make more mindful choices.
        </p>

        <div className="flex items-center gap-5">
          <Link
            to="/report"
            className="text-sm font-medium text-gray-600 hover:text-emerald-800"
          >
            Report
          </Link>
        </div>
      </div>
    </footer>
  );
}