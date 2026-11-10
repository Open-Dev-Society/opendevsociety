import Link from "next/link";
import { Container } from "@/components/site";
import { logo, siteName } from "@/content";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus)";

/** The tool bar, in the site nav's instrument language: logo, "Open Dev Society · <tool>" in mono, a hairline, the page's controls on the right. */
export function ToolHeader({ title, href, children }: { title: string; href?: string; children?: React.ReactNode }) {
  return (
    <header className="bg-(--bg) shadow-[0_1px_0_var(--line)]">
      <Container className="flex h-16 items-center justify-between gap-4 font-mono text-[13px]">
        <p className="flex min-w-0 items-center gap-2.5 whitespace-nowrap">
          <Link href="/" aria-label={`${siteName}, home`} className={`flex items-center gap-2.5 ${focus}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt="" width={24} height={24} className="size-6 rounded-md" />
            <span className="font-medium tracking-[0.02em] text-(--fg) max-sm:hidden">{siteName}</span>
          </Link>
          <span aria-hidden className="text-(--fg-subtle) max-sm:hidden">
            ·
          </span>
          {href ? (
            <Link href={href} className={`truncate text-(--fg-muted) transition-colors duration-(--d-2) hover:text-(--fg) ${focus}`}>
              {title}
            </Link>
          ) : (
            <span className="truncate text-(--fg-muted)">{title}</span>
          )}
        </p>
        {children}
      </Container>
    </header>
  );
}
