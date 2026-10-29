import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, Figtree, Montserrat } from "next/font/google";
import Analytics from "@/components/Analytics";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import "./landing.css";

const mont = Montserrat({ subsets: ["latin"], weight: "800", variable: "--f-mont", display: "swap" });
const brico = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--f-brico", display: "swap" });
const fig = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-fig", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--f-dm", display: "swap" });

const SITE = "https://pasteables.vercel.app";
const DESCRIPTION = "Cute vector stickers you can tweak and copy as SVG, React or Flutter code. Mascots, emotes, ghosts, clouds, mushrooms and dumplings.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Pasteables",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Pasteables",
    title: "Pasteables: cute vectors, ready to paste",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Pasteables: cute vectors, ready to paste",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFAF3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mont.variable} ${brico.variable} ${dm.variable} ${fig.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
