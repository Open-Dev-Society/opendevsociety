import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Rock_3D } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const rock3d = Rock_3D({ weight: "400", subsets: ["latin"], variable: "--font-rock3d" });

export const metadata: Metadata = {
  title: "Open Dev Society | Technical Index",
  description: "A society of open initiatives.",
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${rock3d.variable} antialiased`}>
        <main className="min-h-screen bg-background text-foreground">
          <div className="max-w-5xl mx-auto border-x border-dashed border-gray-300 min-h-screen bg-white">
            <Navbar />
            {children}
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
