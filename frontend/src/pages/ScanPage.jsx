import Hero from "../components/landing/Hero";
import BenefitsStrip from "../components/landing/BenefitsStrip";
import HowItWorks from "../components/landing/HowItWorks";
import ScannerSection from "../components/scan/ScannerSection";

/**
 * Home page. No navbar or footer here — <Layout /> provides the single
 * navbar for the whole app.
 */
export default function ScanPage({ result, onResult, earned = 0 }) {
  return (
    <>
      <Hero />
      <BenefitsStrip />
      <HowItWorks />
      <ScannerSection result={result} onResult={onResult} earned={earned} />
    </>
  );
}
