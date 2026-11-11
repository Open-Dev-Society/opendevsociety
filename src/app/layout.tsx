import type { Metadata } from "next";
import { Mona_Sans, Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";

// Mona Sans is the machine (display + text), Newsreader Italic the hand that signs, Geist Mono the commands.
const sans = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });
const sign = Newsreader({ subsets: ["latin"], style: "italic", axes: ["opsz"], variable: "--font-sign", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  // OG images and canonical URLs resolve against this; set NEXT_PUBLIC_SITE_URL to the real domain in production.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://opendevsociety.vercel.app"),
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
      <body className={`${sans.variable} ${sign.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
