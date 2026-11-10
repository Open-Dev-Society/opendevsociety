# src/content

Typed, verbatim copy from the old site. Pure data: icons are lucide names (strings), no JSX. Strings with runtime values use `{placeholders}` (e.g. `{count}`, `{id}`). Projects, contributors, partners/events and mentions are **not** duplicated; use `src/data/*`.

| Old page / component | Content file | Notes (hard-coded data, dead or placeholder copy) |
|---|---|---|
| `app/layout.tsx`, `Navbar`, `Footer`, `SidebarPanels` | `site.ts` | Sidebar `announcements` are hard-coded and duplicate `src/data/partners` events. Footer year is runtime. Nav link "Love" = `/word-of-mouth`. |
| `(site)/page.tsx` + `HeroSection` | `home.ts` | Hero status: `KERNEL v0.1.0` and `OPERATORS 1000+` are fake/hard-coded; `MEMBERS 1000+` too. Partner logos and the two event rows are hard-coded rather than read from `src/data/partners`. Home principles repeat (shorter) the manifesto ideas. |
| `manifesto` | `manifesto.ts` | Section numbers skip 07 (call-to-action has no label). No page metadata. |
| `projects` | `projects.ts` | Repo cards = `featuredModules` + live GitHub API. |
| `contributors` | `contributors.ts` | People = `manualContributors` + live GitHub API. Page contains a stray developer comment in JSX (not copied). |
| `contribute` | `contribute.ts` | **Dead links:** 5 of 6 role CTAs are `href="#"`. **Placeholder:** `Discord: [LINK_PENDING]` in step 2, though a real invite exists (`site.social.discord`). Code of Conduct is mentioned but no page exists. Unused `main` import from `framer-motion/client`. |
| `partners` | `partners.ts` | Partner/event data in `src/data/partners`. Email copy button uses a hard-coded address. |
| `word-of-mouth` | `word-of-mouth.ts` | Mentions in `src/data/mentions`. Source labels duplicated in `home` (icon map only). |
| `certificate` (page, login, manage) | `certificate.ts` | Private admin tools. Role labels/mono text hard-coded 3× (generator, manage, verify). Signature URL `opendevsociety.vercel.app` hard-coded. Defaults issuer "Ravi Pratap Singh". Uses `window.confirm/prompt/alert` strings. |
| `verify/[id]` | `verify.ts` | Only page with real `generateMetadata` (noindex). Footer line reads `CERT_REPO_OWNER/NAME` env at runtime. |

## Metadata
Only the root layout (`siteMeta`) and `verify` define metadata. Every other `*Meta` export repeats the site default, as the old pages inherit it, so the redesign can override per page.

## Not captured (not copy)
Animations, scramble/typewriter effects, uptime/heartbeat tickers, stat formatting, and class names stay in components.
