import type { Metadata } from "next";
import { ToolHeader } from "../tool-header";
import { ToolNav } from "./tool-nav";

export const metadata: Metadata = {
  title: "Certificates · Open Dev Society",
  robots: { index: false, follow: false },
};

export default function CertificateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ToolHeader title="Certificates" href="/certificate">
        <ToolNav />
      </ToolHeader>
      <main className="flex-1">{children}</main>
    </>
  );
}
