import type { Metadata } from "next";
import { Mona_Sans, Newsreader, Geist_Mono, Playfair_Display, Rock_3D } from "next/font/google";
import "./globals.css";

// Mona Sans is the machine (display + text), Newsreader Italic the hand that signs, Geist Mono the commands.
const sans = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });
const sign = Newsreader({ subsets: ["latin"], style: "italic", axes: ["opsz"], variable: "--font-sign", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// Legacy faces, still used by pages that haven't been rebuilt yet. Drop at cleanup.
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const rock3d = Rock_3D({ weight: "400", subsets: ["latin"], variable: "--font-rock3d" });

export const metadata: Metadata = {
  title: "Open Dev Society: free, open-source software, built in public",
  description:
    "A public workshop of developers, designers and writers building free, open-source tools. No paywalls, no interviews.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${sign.variable} ${mono.variable} ${playfair.variable} ${rock3d.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
