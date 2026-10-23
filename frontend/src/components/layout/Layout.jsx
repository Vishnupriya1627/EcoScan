import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { scrollToSection, scrollToTop } from "../../utils/scroll";
import "../../styles/ecoscan.css";

export default function Layout({ earned = 0, children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTop();
      return undefined;
    }

    const id = hash.slice(1);
    const frame = requestAnimationFrame(() => scrollToSection(id));

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
  <div className="min-h-screen overflow-x-clip bg-[#fbfcf8] text-[#173c32]">
    <Navbar earned={earned} />
    <main>{children}</main>
    <Footer />
  </div>
);
}
