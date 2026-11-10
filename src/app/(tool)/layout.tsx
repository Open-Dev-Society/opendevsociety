import { Container } from "@/components/site";
import { siteName } from "@/content";

// Tool and document pages (brief §11): no marketing Nav or Footer, a --bg ground, one meta footer line.
export default function ToolLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const source = `${process.env.CERT_REPO_OWNER || "Open-Dev-Society"}/${process.env.CERT_REPO_NAME || "opendevsociety"}/${process.env.CERT_DATA_PATH || "data/certificates.json"}`;
  return (
    <div className="site flex flex-col">
      {children}
      <footer className="mt-auto border-t border-(--line)">
        <Container className="t-meta flex flex-wrap gap-x-2 py-5 text-(--fg-subtle)">
          <span>{siteName}</span>
          <span aria-hidden className="hidden sm:inline">·</span>
          <span>
            Every certificate is recorded in <span className="font-mono break-all">{source}</span>
          </span>
        </Container>
      </footer>
    </div>
  );
}
