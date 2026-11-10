import Link from "next/link";
import { Container } from "@/components/site";
import { logo } from "@/content";

/** The 56px tool bar: logo, the tool's name, and whatever the page puts on the right. */
export function ToolHeader({ title, href, children }: { title: string; href: string; children?: React.ReactNode }) {
  return (
    <header className="border-b border-(--line)">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href={href} className="flex items-center gap-2.5 rounded-(--radius-sm) text-[15px] font-semibold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="Open Dev Society" width={24} height={24} className="size-6" />
          {title}
        </Link>
        {children}
      </Container>
    </header>
  );
}
