import type { Metadata } from "next";
import { Container } from "@/components/site";
import { siteName } from "@/content";
import { ToolHeader } from "../tool-header";
import { ToolNav } from "./tool-nav";

export const metadata: Metadata = {
  title: "Certificates · Open Dev Society",
  robots: { index: false, follow: false },
};

export default function CertificateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const source = `${process.env.CERT_REPO_OWNER || "Open-Dev-Society"}/${process.env.CERT_REPO_NAME || "opendevsociety"}/${process.env.CERT_DATA_PATH || "data/certificates.json"}`;
  return (
    <>
      <ToolHeader title="Certificates" href="/certificate">
        <ToolNav />
      </ToolHeader>
      <main className="flex-1">{children}</main>
      <footer className="mt-auto shadow-[0_-1px_0_var(--line)]">
        <Container className="t-mono flex flex-wrap justify-between gap-x-6 gap-y-1 py-5 text-[12px] text-(--fg-subtle)">
          <span>{siteName} · Certificates</span>
          <span className="min-w-0">
            Recorded in <span className="break-all text-(--fg-muted)">{source}</span>
          </span>
        </Container>
      </footer>
    </>
  );
}
