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

export const metadata: Metadata = {
  title: "Pasteables",
  description: "Little vectors, one click away. Mascots, emoticons, ghosts and clouds you can copy as SVG, React or Flutter.",
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
