import type { Metadata } from "next";
import IconLibrary from "@/components/IconLibrary";
import "./icons.css";

const TITLE = "Icon Library · Pasteables";
const DESCRIPTION = "Explore a growing collection of thoughtfully designed icons for interfaces, products, and everyday creative workflows. Line, Solid and Duotone, copy as SVG, React or Flutter.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/icons" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/icons", type: "website", siteName: "Pasteables" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <IconLibrary />;
}
