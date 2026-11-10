import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SidebarPanels } from "@/components/SidebarPanels";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SidebarPanels />
      <div className="max-w-5xl mx-auto border-x border-dashed border-gray-300 min-h-screen bg-white">
        <Navbar />
        {children}
        <Footer />
      </div>
    </main>
  );
}
