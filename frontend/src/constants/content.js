import {
  CloudUpload,
  ScanLine,
  BarChart3,
  Sprout,
  Leaf,
  Shirt,
  Sparkles,
  Recycle,
} from "lucide-react";

export const KG_PER_KM_DRIVEN = 0.17;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const BAR_COLORS = [
  "bg-emerald-300",
  "bg-lime-300",
  "bg-teal-300",
  "bg-amber-300",
  "bg-green-500",
  "bg-cyan-300",
];

// Section ids on the home page. The navbar uses these for smooth scrolling
// and for highlighting the section currently in view.
export const SECTION_IDS = ["home", "how-it-works", "scanner"];

export const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "how-it-works", label: "How it works" },
  { id: "scanner", label: "Scan clothes" },
];

export const STEPS = [
  {
    icon: CloudUpload,
    number: "01",
    title: "Upload or capture",
    description: "Choose a clothing photo or use your camera.",
  },
  {
    icon: ScanLine,
    number: "02",
    title: "Let AI analyse",
    description: "Identify your clothes and estimate their impact.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Discover your impact",
    description: "Explore emissions item by item.",
  },
  {
    icon: Sprout,
    number: "04",
    title: "Make a difference",
    description: "Build mindful habits and earn Eco Points.",
  },
];

export const BENEFITS = [
  {
    icon: Leaf,
    title: "Know your impact",
    description: "Understand your clothing footprint.",
  },
  {
    icon: Shirt,
    title: "Item by item",
    description: "Explore each piece in your outfit.",
  },
  {
    icon: Sparkles,
    title: "Earn Eco Points",
    description: "Get rewarded for your participation.",
  },
  {
    icon: Recycle,
    title: "Choose more wisely",
    description: "Small changes can make a difference.",
  },
];
