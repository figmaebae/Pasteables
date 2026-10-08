import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const mont = Montserrat({ subsets: ["latin"], weight: "800", variable: "--f-mont", display: "swap" });
const brico = Bricolage_Grotesque({ subsets: ["latin"], weight: "700", variable: "--f-brico", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], weight: ["500", "700"], variable: "--f-dm", display: "swap" });

export const metadata: Metadata = {
  title: "Vector Shelf",
  description: "Little vectors, one click away. Mascots, emoticons, ghosts and clouds you can copy as SVG, React or Flutter.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2B2430",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mont.variable} ${brico.variable} ${dm.variable}`}>
      <body>{children}</body>
    </html>
  );
}
