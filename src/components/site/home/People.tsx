import Link from "next/link";
import { SILHOUETTE } from "@/app/(site)/contributors/Badge";
import type { Builder } from "@/lib/workshop";
import { Face, facts } from "../Avatar";
import { Dither } from "../lab/Dither";
import { Container } from "../Section";
import { band, display, focus, label } from "./ui";
import { ArrowRight } from "../Icon";

const face = "size-11 sm:size-14";

/** 04 · paper: a strip of faces (hover, focus or tap one for who it is), the maintainers first, ending in the open rose spot. */
export function People({ builders }: { builders: Builder[] }) {
  const faces = [...builders.filter((b) => b.core), ...builders.filter((b) => !b.core)];
  return (
    <section id="people" aria-labelledby="people-h" data-grid="Contributors" className={`scroll-mt-16 border-t border-(--line) ${band}`}>
      <Container>
        <p className={label}>Contributors · maintainers first</p>
        <h2 id="people-h" className={`${display} mt-3 max-w-[18ch] text-[clamp(2.5rem,1.6rem+3.6vw,5rem)]`}>
          {faces.length} people build Open Dev Society.
        </h2>

        <ul aria-label="Contributors" className="mt-10 flex flex-wrap gap-1.5 md:mt-14">
          {faces.map((b) => (
            <li key={b.login}>
              <Face p={{ ...b, line: facts(b) }} px={56} photoClassName={face} />
            </li>
          ))}
          <li>
            <Link href="/contributors" className={`group flex items-center gap-3 pr-1 ${focus}`}>
              <Dither
                src={SILHOUETTE}
                alt="An open spot: yours after your first merged pull request"
                width={1}
                height={1}
                variant="mark"
                tone="duotone"
                cell={1}
                develop
                className={`${face} shadow-[0_0_0_1px_var(--mark)]`}
              />
              <span className="t-mono text-[13px] text-(--mark-ink) group-hover:underline">
                This could be you <ArrowRight size="1em" />
              </span>
            </Link>
          </li>
        </ul>

        <p className="mt-8 max-w-[52ch] text-[17px] max-sm:hidden leading-relaxed text-(--fg-muted)">
          Everyone with a merged pull request is on the contributors page. No invite needed: your first contribution puts you there.
        </p>
      </Container>
    </section>
  );
}
