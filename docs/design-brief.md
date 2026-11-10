# Open Dev Society: design brief (C2, "The open workshop")

Art direction for the whole site. Concept C ("Builder's workshop") is the direction. This brief is the design system, the IA and the page templates every builder works from. Where this brief and concept C disagree, this brief wins. Where it is silent, choose the quieter option.

Data is real and live: `getOrgRepos()`, `getOrgTotals()` and `getOrgContributors()` in `src/lib/github.ts` (revalidate 3600, snapshot fallback in `src/data/fallback.ts`). Never hard-code a count. Every number below (21,406★, 2,669 forks, 24 builders, 15 tools, 17 mentions) is the 2026-11-10 snapshot and is used here only as an example.

---

## 1. The idea

> **Technology should belong to everyone, so we build it in public, sign every piece with the names of the people who made it, and keep a seat open for whoever shows up next.**

Short form for the team: **made in public, signed by name, seat open.**

Why the workshop direction carries it: a workshop is the opposite of a storefront. Things are made there, not sold. The tools hang on the wall for anyone to use, unfinished work is in plain view, apprentices learn by doing, and each finished piece carries its maker's mark. Every visual decision maps onto the idea:

| Workshop | On the page | Expresses |
|---|---|---|
| Paper and the bench top | Warm paper ground, card surfaces | Made by hand, not by a vendor |
| The kiln | One orange accent, used only where something gets *made* (the primary action, the open seat, the changed token in a command) | Making |
| Ink and tools | Ink bands for the bench (terminal) and the closing statement | The real tools, not a mock |
| Maker's marks | Every artifact is **signed**: names and faces sit next to the work (hero print caption, repo rows, the wall) | Credited by name |
| The open seat | One empty, outlined seat on the wall that you can claim | Anyone who shows up |

The test for any element: does it show something being made in public, name who made it, or open a seat? If it does none of those, cut it.

## 2. What "premium" means here

Premium for a community is craftsmanship, not luxury. Concretely:

1. **Restraint.** One accent hue. One idea per section. Two signature moments on the whole site and no other ambient motion. At most three kiln-orange things in any viewport.
2. **Type does the work.** Bricolage Grotesque used across its whole range (optical size and width axes), not left at one weight. Big type gets room around it. No uppercase kickers, no pills above headings.
3. **Whitespace with a rhythm.** One section rhythm, one 12-column grid, a left rail for labels. Space is measured, never left over.
4. **Real imagery only.** Real product screenshots of live ODS tools, real GitHub avatars, real partner logos. No illustrations, no 3D, no stock photos, no gradient blobs, no icon-in-a-circle feature trios.
5. **Honest numbers.** Live, sourced, formatted (`21.4k`). Small numbers are not shown as stars (see the index rules). No "1,000+ members".
6. **Captions like a museum label.** Small, precise, signed: what it is, who made it, the numbers, a link.
7. **Motion that confirms cause.** Things move because you did something, or once to show what a section means. Never to decorate.
8. **Finish.** Hairlines instead of borders, concentric radii, tabular numbers, `text-wrap: balance/pretty`, focus rings, reduced motion, nothing clipped at 375px.

### References studied (take composition and restraint, not the look)

- **Cursor** (cursor.com): the product, shown at real scale, is the hero image. The headline stays modest and the visual dominates the lower two thirds. *Take:* the hero "print" of OpenStock.
- **Mux** (mux.com): a single orange on warm grey, mono for machine text only. *Take:* the discipline of one chroma.
- **Turborepo** (turbo.build): one live number and one copyable command next to the primary CTA. *Take:* the command chip.
- **Astro Docs** (docs.astro.build): contributor faces used as texture beside the headline. *Take:* faces as proof. We go further with the wall.
- **Linear, Stripe:** hairlines, editorial measure, dense precise captions. **Teenage Engineering:** labelling objects like instruments, with the product as the art. **Raycast:** chips and keys that feel physical.

## 3. Type system

Load with `next/font/google` in `src/app/layout.tsx`. Remove `Playfair_Display` and `Rock_3D` once no page uses them.

```ts
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-display", display: "swap" });
const sans    = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-sans", display: "swap" });
const mono    = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
```

- **Bricolage Grotesque** is the display face: headings, big numbers, the certificate name. It is our personality. Use the axes so it is ours, not TanStack's.
- **Inter** is the text face: body, UI and captions.
- **JetBrains Mono** is for **machine text only**: commands, paths, IDs, handles, dates in tables, counts in captions. Never for labels or kickers.

| Token | Face | Size (375 → 1440) | Line height | Weight | Axes | Tracking |
|---|---|---|---|---|---|---|
| `display-1` | Bricolage | `clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)` 44→88 | 0.95 | 650 | opsz 96, wdth 88 | -0.04em |
| `display-2` | Bricolage | `clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)` 36→56 | 1.0 | 620 | opsz 72, wdth 92 | -0.032em |
| `display-3` | Bricolage | `clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)` 28→36 | 1.05 | 600 | opsz 40, wdth 95 | -0.025em |
| `title` | Bricolage | 1.375rem / 22 | 1.2 | 600 | opsz 24, wdth 100 | -0.012em |
| `lede` | Inter | 1.1875rem / 19 (17 on mobile) | 1.55 | 400 | opsz auto | -0.011em |
| `body` | Inter | 1rem / 16 (long-form 1.0625rem / 17) | 1.6 (long-form 1.7) | 400 | | -0.006em |
| `small` | Inter | 0.875rem / 14 | 1.5 | 400 | | 0 |
| `meta` | Inter | 0.8125rem / 13 | 1.4 | 500 | | 0 |
| `mono` | JetBrains | 0.8125rem / 13 (min 12) | 1.5 | 450 | | 0 |

Rules:
- Set `font-variation-settings` per token as a CSS class (`.t-display-1 { font-variation-settings: "opsz" 96, "wdth" 88; }`). Use `font-weight` for weight, not `"wght"`.
- Headings get `text-wrap: balance`, paragraphs get `text-wrap: pretty`. Measure: body ≤ 64ch, lede ≤ 52ch.
- Numbers in tables, captions and counters use `font-variant-numeric: tabular-nums` (Inter or mono). Static display numbers may use Bricolage.
- Sentence case everywhere. No uppercase, no letter-spaced mono kickers, no `SNAKE_CASE` or `// V1.0` strings (the old site's hacker cosplay goes).
- Only one `display-1` per page (the H1). The H1 is `display-1` on Home and `display-2` on every other page.
- Size steps never collide: a tile title is never the same size as its section's H2 (the flagship tile matching the H2 at 48px was a C bug).

## 4. Palette (OKLCH, light first)

Evolved from C: the paper is a touch lighter and less yellow, ink-3 is darkened to pass AA, and the kiln is split into a display orange and a text-safe deep orange. Contrast was measured, not estimated.

```css
:root {
  /* Ground */
  --paper:      oklch(0.958 0.012 80);   /* #f5f0e8  page ground */
  --paper-2:    oklch(0.925 0.018 78);   /* #ede5d9  bands, hovered rows, quiet seats */
  --card:       oklch(0.992 0.006 80);   /* #fffcf8  cards, print frame, certificate */

  /* Ink */
  --ink:        oklch(0.215 0.012 65);   /* #1d1814  15.5:1 on paper */
  --ink-2:      oklch(0.44 0.02 65);     /* #5b5047  6.9:1 on paper  secondary text */
  --ink-3:      oklch(0.515 0.022 68);   /* #70655a  5.0:1 paper, 4.5:1 paper-2, 5.5:1 card  meta (12px min) */
  --line:       oklch(0.215 0.012 65 / 0.10);
  --line-2:     oklch(0.215 0.012 65 / 0.06);

  /* Kiln */
  --kiln:       oklch(0.585 0.17 40);    /* #cb4e1a  primary button bg (white text 4.5:1), display text ≥24px only (4.0:1) */
  --kiln-deep:  oklch(0.5 0.145 39);     /* #a43d17  links and small kiln text (5.7:1 paper), button hover */
  --kiln-wash:  oklch(0.925 0.038 58);   /* #fbe1ce  changed-token highlight, selection, open-seat hover (kiln-deep on it 5.1:1) */

  /* Status (only meaning, never decoration) */
  --moss:       oklch(0.5 0.09 145);     /* #407142  live (<24h), verified. 5.1:1 on paper */

  /* Ink band (the bench, the closing footer, tooltips). Also the seed of a future dark theme. */
  --night:        oklch(0.205 0.012 60); /* #1b1612 */
  --night-2:      oklch(0.255 0.013 60); /* #28211d  terminal surface, raised */
  --night-ink:    oklch(0.95 0.012 80);  /* #f3eee6  15.5:1 */
  --night-ink-2:  oklch(0.78 0.016 75);  /* #beb6ac  9.0:1 */
  --night-ink-3:  oklch(0.66 0.016 75);  /* #989188  5.8:1 night, 5.1:1 night-2 */
  --night-kiln:   oklch(0.72 0.15 48);   /* #ef8448  kiln on ink: 6.9:1 night, 6.1:1 night-2 */
  --night-line:   oklch(1 0 0 / 0.09);
}
```

Usage rules:
- Kiln is for: the primary button, H1 emphasis (`anyone who shows up.`), the open seat, changed tokens in the bench, focus rings (`--kiln-deep`), and `::selection` (`--kiln-wash` background, `--ink` text). Nothing else. No orange icons, tags or borders.
- Kiln text below 24px is always `--kiln-deep` (or `--night-kiln` on ink).
- `--moss` means "live" (a commit within 24h) or "verified". It is never decorative.
- Language dots in the index use GitHub's language colors at 8px, which is the only other chroma allowed.
- Paper grain: keep C's SVG noise, `position: fixed`, `opacity: 0.22`, `mix-blend-mode: multiply`, not over images, ink bands or the certificate.
- Tokens live on `:root`, not on a wrapper class. The certificate print clone is appended to `<body>`, so tokens scoped to a wrapper would vanish in print. The concept route may scope them while it is a concept; production must not.

Dark mode is out of scope for v1. The `--night-*` set is designed so a dark theme can map onto it later.

## 5. Grid, spacing, shape, depth

- **Container:** `max-width: 76rem` (1216px) of content, `padding-inline: clamp(20px, 5vw, 48px)`. Full bleed is only for band backgrounds (People, Bench, footer).
- **Grid:** 12 columns, `column-gap: 24px` (16px below 768). Below 768, think in 4 columns.
- **Section header (the rail):** cols 1–3 hold the label (`meta`, ink-3) and a live count under it (`mono`, ink-2). Cols 4–12 hold the H2 (`display-2`) and an optional dek (`lede`, ink-2, ≤ 52ch). On mobile the rail collapses to one line above the H2: `Work · 15 tools`. This replaces C's `0n — KICKER` pill everywhere.
- **Spacing scale (px):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160. Nothing off-scale.
- **Section rhythm:** `--section: clamp(5rem, 3rem + 7vw, 9rem)` (80→144) as `padding-block` on every section, one value site-wide. Header to content is 48px (32 on mobile).
- **Radii:** `--r-xs: 6px` (chips, kbd), `--r-sm: 10px` (inputs, inner frames, seats), `--r-md: 16px` (cards, tiles), `--r-lg: 22px` (print frame, terminal), `999px` for buttons only. Concentric: inner radius = outer radius minus padding.
- **Depth:** no element has both a border and a shadow.
  - `--e-0: 0 0 0 1px var(--line)` hairline
  - `--e-1: 0 0 0 1px oklch(0.215 0.012 65 / 0.07), 0 1px 2px oklch(0.215 0.012 65 / 0.04), 0 8px 24px -12px oklch(0.215 0.012 65 / 0.12)` cards
  - `--e-2: 0 0 0 1px oklch(0.215 0.012 65 / 0.08), 0 2px 4px oklch(0.215 0.012 65 / 0.04), 0 28px 64px -28px oklch(0.4 0.06 50 / 0.35)` the print, the terminal, hovered tiles (a warm, long shadow)
- **Breakpoints:** Tailwind defaults (640 / 768 / 1024 / 1280).

## 6. Motion

Principles:
1. Motion confirms cause. A thing moves because you did something, or exactly once to show what a section means (the two signatures).
2. Only the hero has a load-in. No scroll-reveal fades on sections; content is simply there.
3. Exits are faster than entrances. Hover-out is slower than hover-in.
4. Animate only `transform`, `opacity`, `filter`, `background-color`, `box-shadow`, and `clip-path`/`stroke-dashoffset` for the two signatures.
5. `prefers-reduced-motion: reduce` removes every transform and blur. Opacity changes stay at ≤ 150ms, and both signatures render in their final state.

Tokens:

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* entrances, reveals, seat pop */
--ease-ui:     cubic-bezier(0.2, 0, 0, 1);      /* hovers, presses, state changes */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* things that travel or resize: height, outline draw */
--d-1: 100ms;  /* press */
--d-2: 160ms;  /* hover in, color, crossfades */
--d-3: 240ms;  /* hover out, tab panels, height */
--d-4: 360ms;  /* reveals, seat claim */
--d-5: 560ms;  /* hero items */
```

| Interaction | Spec |
|---|---|
| Hero load | Items rise `translateY(8px) + blur(4px) → 0`, opacity 0→1, `--d-5` `--ease-out`, stagger 60ms: dateline, H1, lede, CTAs, print. |
| Button hover / press | bg `--d-2 --ease-ui`; `:active` `scale(0.97)` `--d-1`; trailing arrow `translateX(2px)` `--d-2`. |
| Navigating tile hover | `translateY(-2px)` and `--e-1 → --e-2`, in `--d-2`, out `--d-3`. **Only** tiles that go somewhere new get a lift. Rows get `--paper-2` bg. Nothing else lifts. |
| Nav active pill and segmented controls | Framer `layoutId`, `{ type: "spring", duration: 0.35, bounce: 0 }` (as in C). |
| Mobile menu sheet | open `opacity 0→1, translateY(-8px)→0` 280ms `--ease-out`; close 180ms `--ease-ui`. |
| Tooltip | 80ms hover intent, appear `--d-2` opacity + `scale(.97→1)` from its anchor side. Moving between seats swaps instantly with no re-delay. |
| Copy → check | Icon crossfade with `blur(2px)` `--d-2`, revert after 1.6s (keep C's morph). |
| Images | Fade in on decode, opacity `--d-3`. No blur-up. |

Banned: parallax, scroll-jacking, marquees, cursor followers, count-up numbers, typewriter headlines, tilt cards, ambient pings (the moss dot only appears when the data is live, and it does not pulse).

## 7. Signature moments

Two moments, and they are one story: **you take a seat, then the bench shows you how to earn it.**

### Signature 1: "Take a seat" (the wall)

The People section shows every contributor as a seat, plus one open seat that is yours.

- **Fill (once):** when the wall is 35% in view (IntersectionObserver, then unobserve), seats appear in reading order. Each one goes opacity 0→1 and `scale(.92→1)` over 280ms `--ease-out`, staggered 14ms (24 seats take about 620ms in total). 200ms after the last seat, the open seat's dashed outline **draws itself**: an SVG `rect` with `stroke-dasharray` and `stroke-dashoffset` animating to 0 over 600ms `--ease-in-out`, in `--kiln`. Then its `+` fades in over `--d-2`.
- **The open seat:** sits at position N+1 directly after the last face. It has a 1.5px dashed kiln outline, `--paper` fill and a `+`. Under the wall: `Seat 25 is open.` (meta) with the `Claim it` button.
- **Claiming:** clicking the seat (or `Claim it`) opens an inline field under the wall, not a modal. The field is mono with an `@` prefix and the placeholder `your-github-handle`. Validate `/^[a-z\d](?:[a-z\d-]{0,38})$/i` and load `https://github.com/${handle}.png?size=96` (client-only, no API call).
  - On load, the avatar fills the seat: `scale(.9→1)` and opacity over `--d-4 --ease-out`, and the dashed outline crossfades to a solid 2px kiln ring over `--d-3`. The caption swaps (crossfade with a 4px slide, `--d-2`) to `Saved for @handle. It's yours after your first merged PR.` with a `Show me how ↓` link to the bench.
  - On error, the caption reads `No GitHub account called @handle.` in ink-2. No shake, no red.
  - The handle is kept in `localStorage["ods.handle"]` (wrapped in try/catch) and offered back with a small `×` to clear it. It also feeds the bench (signature 2).
- **Hover or focus on a seat:** the tooltip (ink) reads `Name or @login`, then `1,204 contributions · OpenStock, kitbash +3`. Every seat is a link to the GitHub profile with an `aria-label` carrying the same text. On touch, a tap opens the profile.
- **Never more empty than full:** seats are contributors, plus the open seat, plus quiet empties only to finish the last row. Quiet empties are `--paper-2` squares with no `+` and no hover.

### Signature 2: "The bench" (your first PR, printed live)

The bench is C's best idea, made correct and current.

- A terminal (`--night-2` surface, `--r-lg`, `--e-2`) on the ink band. Its title bar has a segmented control, **Terminal | Agent**, and a copy button.
- **Terminal** shows the correct contributor flow, using the selected repo and the claimed handle (default `you`):
  ```
  $ gh repo fork Open-Dev-Society/OpenStock --clone
  $ cd OpenStock && git switch -c you/first-pr
  $ gh pr create --fill --draft
  ```
  The `$` is in `--night-ink-3`, the commands in `--night-ink`, and the variable tokens (repo, handle) in `--night-kiln`. Lines use `white-space: pre-wrap` with a 2ch hanging indent, so nothing clips or scrolls sideways at 375px. Under the commands: `Needs the GitHub CLI · cli.github.com` (mono 12, night-ink-3).
- **Agent** shows a copyable prompt in Inter 15/1.6: `Fork Open-Dev-Society/OpenStock, read its README and CONTRIBUTING, pick one open issue labelled "good first issue" or "help wanted", fix it on a branch named you/first-pr, and open a draft pull request that explains the change.` Under it: `Paste into any coding agent.` Don't claim an AGENTS.md exists.
- **Motion:** the first time the bench is 35% in view, the commands print line by line, 9ms per character with 90ms between lines and a block caret blinking (`steps(1)`, 1.06s). They print once and never again. After that, when the repo or handle changes, **only the changed tokens** crossfade (opacity plus a 3px y offset, `--d-2`) and get a `--kiln-wash` at 18% alpha highlight that fades out over 900ms `--ease-out`. Tab switches move the sliding pill (spring) while the panel crossfades over `--d-2` and its height animates over `--d-3 --ease-in-out`.
- The handle you claimed in signature 1 shows up in the branch name. That link between the two moments is the point.

## 8. IA and routes

| Route | Name in nav | Purpose | Status |
|---|---|---|---|
| `/` | (logo) | The workshop: proof, shelf, wall, bench, word of mouth, closing | redesign |
| `/projects` | Work | Every tool, the shelf and the full index | redesign |
| `/contributors` | People | The full wall and the ledger of contributors | redesign |
| `/manifesto` | Manifesto | The idea, long form | redesign |
| `/word-of-mouth` | Word of mouth | Every mention, plus partners and events (`#partners`) | redesign, absorbs `/partners` |
| `/contribute` | **Contribute** (button) | The bench, roles for non-coders, review, conduct, FAQ | redesign |
| `/certificate`, `/certificate/login`, `/certificate/manage` | (not in nav) | Internal tool, password-gated | restyle to the tool template, `robots: noindex` |
| `/verify/[id]` | (not in nav) | Public certificate verification | restyle to the document template |

Redirects go in `next.config.ts` `redirects()`, all `permanent: true`:
- `/partners` → `/word-of-mouth#partners`. Verify with `curl -sI 127.0.0.1:3000/partners` that the `location` keeps the hash.

Anchor compatibility: `/partners#partner-cta` is now `/word-of-mouth#partner-cta` (keep that id on the partner CTA). `/contribute#values` must still land, so put `id="values"` on the code-of-conduct section's wrapper and `id="conduct"` on its heading.

Nav (all pages except the tool template): logo, then Work, People, Manifesto, Word of mouth, then a `★ 21.4k` chip (links to the org), then a **Contribute** button. On Home the sliding pill follows the section in view and links scroll to the anchors (`#work`, `#people`, `#start`, `#signal`). On inner pages it marks the current route.

Remove from the site: `SidebarPanels`, the dashed `max-w-5xl` frame and the dot-grid body background in `(site)/layout.tsx`, and the root `body` styles in `globals.css` (keep only the print block, see section 12).

## 9. Component inventory

Shared components live in `src/components/ods/`. Tokens and base styles live in `src/styles/ods.css`, imported once by the root layout. Everything is a Server Component unless marked **client**.

| Component | Spec |
|---|---|
| `SiteNav` **client** | Sticky, 64px tall. Background `--paper` at 80% with `backdrop-filter: blur(12px) saturate(1.4)`. A hairline `--line` appears after 8px of scroll. Logo (`/logo.png`, 24px) plus `Open Dev Society` (Inter 600/15). Links are Inter 500/14, ink-2 → ink, with the spring pill (`--paper-2`). Stars chip: mono 13, `--e-0`, `--r-xs`. Below 768: logo, Contribute and a menu button; the sheet lists links in `display-3`, then the stars chip and socials. |
| `SiteFooter` | The closing statement on every non-tool page (spec in section 10 §6). `--night` band. |
| `PageHero` | Inner-page header: the rail on the left (label plus live count), `display-2` H1 and a `lede` dek. `padding-top: 96px` (64 on mobile), bottom is `--section`/2. |
| `Section` | `id`, `label`, `count`, `title`, `dek`, `href` and `hrefLabel`. Renders the rail header and ends with a right-aligned `hrefLabel →` link (Inter 500/14, ink-2) **under** the content, not beside the H2. Variants: `paper` (default), `band` (`--paper-2`, full bleed), `night`. |
| `Button` | Heights 44 (md) and 52 (lg), pill, Inter 500/15, padding-inline 20 (lg 24) with 16 on the arrow side. `primary`: `--kiln` bg, white, hover `--kiln-deep`, with an inner top highlight `inset 0 1px 0 oklch(1 0 0 / .2)`. `secondary`: `--card` with `--e-1`. `ghost`: text with a 2px arrow nudge. `on-night`: `--night-2` with `--night-line` hairline. Full width below 640. |
| `CommandChip` **client** | Mono 13 in `--card` (or `--night-2`), `--e-0`, `--r-sm`, height 44. `$` in ink-3. Copy icon on the right, with the copy→check morph. Truncates with a fade mask, never wraps. |
| `Print` | A screenshot frame. `--card` passe-partout of 8px (6 on mobile), `--r-lg` outside and `--r-sm` inside, `--e-2`. A 32px top strip shows the real URL in mono 12, ink-3 (`openstock-ods.vercel.app`), with no fake traffic lights. The image is `next/image` with explicit `sizes`. Under it, a **caption** row: left is the name (`title`) plus what it is (`small`, ink-2); right is the signature: avatar stack (5 × 24px, ring `--card`), `22 builders` and `★ 21.4k · 2.7k forks` (mono 13, tabular), then `Open it ↗`. |
| `RepoTile` | Featured tile: `--card`, `--r-md`, `--e-1`, padding 20 (24 at lg). An image area at 16:10 (inner `--r-sm`) or, for kitbash, a `--night` panel with the tagline set in `display-3`. Then the name (`title`), tagline (`small`, ink-2), and a meta row: language dot · `pushed 3d ago` · `N builders` · `★` only if ≥ 50. The whole tile is one link (stretched `::after`); it lifts on hover. |
| `RepoIndex` **client** (filter only) | A ledger. Above it, a `SegmentedControl`: `All · For everyone · For builders and agents`. Rows (hairline-separated, 56px, hover `--paper-2`) hold name (Inter 600/16) · tagline (ink-2) · audience (meta) · language dot · `pushed 3d ago` (mono 13) · signal (`★ 21.4k` if ≥ 50, else `N builders`) · `↗` (nudges 2px on hover). Below 768, each row is two lines: name and signal, then the tagline. A `First issues (n)` link (kiln-deep, meta) shows **only when n > 0**. |
| `SegmentedControl` **client** | `--paper-2` track, `--card` pill with `--e-1` and the spring. Inter 500/14. `role="tablist"` with arrow-key support. On night, the track is `--night` and the pill `--night-2`. |
| `Wall` **client** (fill animation and claim) | Square seats on a grid: 16 columns at ≥ 1024, 12 at ≥ 640, 8 below. Gap 6px, seat radius `--r-sm`, 1px inner outline `oklch(0 0 0 / .08)` on avatars. Core crew (`src/data/contributors.ts`) get a 2px `--kiln-wash` ring. Includes `YourSeat` and the claim field (section 7). Takes `size: "home" \| "page"`; page seats are 1.25× larger. |
| `Tooltip` **client** | `--night` bg, night-ink, Inter 13/1.4, `--r-xs`, padding 8/10, max 260px, 6px offset, no arrow. |
| `Bench` **client** | Section 7, signature 2. Takes `repos` (name and open_issues) and reads the handle from the wall's store (a tiny `useSyncExternalStore` over localStorage, no context provider). |
| `Steps` | Ordered list. Each step has a numeral (`display-3`, `--night-kiln` on night, `--kiln-deep` on paper), a title (`title`) and a body (`body`, ink-2), separated by hairlines. |
| `Quote` | `feature`: `display-3` text in ink with hanging punctuation (`hanging-punctuation: first`, plus a negative text-indent fallback), attribution in meta: `Tattva Tarang · Medium · 2025 ↗`. `compact`: Inter 500/17 with the same attribution. Quote marks come from CSS `quotes`, never typed in, and the text is trimmed of straight and curly quotes at both ends (this fixes C's doubled-quote bug). |
| `SourceLine` | One line of meta links separated by ` · `: `Also covered by Daily.dev · Hello GitHub · MAGI//ARCHIVE · Reddit · Threads · Facebook`, then `All 17 mentions →`. |
| `PartnerCard` | `--card`, `--e-1`, `--r-md`. Logo at 32px height, grayscale and 80% opacity → color on hover (`--d-2`, from C), plus one line we wrote (`small`, ink-2), never clamped. |
| `Stat` | Inline only: number (Inter 600, tabular) plus a label (ink-2). Lives in captions, rails and the dateline. **There is no standalone stats strip anywhere.** |
| `Ledger` | Generic hairline table for mentions, contributors and certificates: sticky header row in meta ink-3, 52px rows, mono for IDs and dates, horizontal scroll inside its own container on mobile only when there are more than 3 columns. |
| `CertificateDocument` | Shared by `/certificate` (editable) and `/verify/[id]` (read-only). Spec in section 12. |
| `Field` | Inputs: 44px tall, `--card`, `--e-0`, `--r-sm`, Inter 15. Focus is a 2px `--kiln-deep` ring with 2px offset. The label above is meta ink-2; errors go below in ink-2 with an icon. Never red fills. |
| `Status` | Small pill (`--r-xs`): `Verified`/`Active` in moss text on moss at 12% alpha; `Revoked` in kiln-deep on kiln-wash. Always text plus icon, never color alone. |

Data helpers (put them in `src/lib/format.ts`, nowhere else):
`compact(n)` → `Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })`, so 21406 becomes `21.4k`; `ago(iso)` → `3d ago` / `14h ago`; `isLive(iso)` → under 24h.
Catalog: create `src/data/catalog.ts` mapping each repo name to `{ tagline, audience: "everyone" | "builders", shot?: string, featured?: boolean }`. Hide `.github` and `opendevsociety` from public lists. `den` gets an `alpha` meta tag.

Taglines (≤ 56 characters, written by us, faithful to each README):

| Repo | Audience | Tagline |
|---|---|---|
| OpenStock | everyone | Market prices, alerts and company data. Free. |
| kitbash | builders | Tells your agent what already exists on GitHub. |
| kine-ui | builders | Gesture and spatial interfaces, no black box. |
| openreadme | builders | Auto-updating bento banners for your profile. |
| booktrace | everyone | Find free, verified copies of books. |
| opencosmos | everyone | Live space data: ISS tracking and charts. |
| openhaven | builders | Share and discover code snippets. |
| openmind | everyone | Research that reasons instead of listing links. |
| OpenCine | everyone | Trending and popular films, in one place. |
| den | builders | Your Mac in one app. |
| ports | builders | See which dev servers are running, and their cost. |
| ByteMyCV | everyone | Resume analysis with ATS scoring. |
| zomb | builders | A health check for AI-written codebases. |
| tearcopy | builders | Copied text tears off like a strip of paper. |
| settle-ui | builders | Optimistic UI animations for React. |

## 10. Home, section by section

Order: **Hero (OpenStock proof) → Work (the shelf) → People (the wall) → Start (the bench) → Word of mouth → closing footer.** The principles leave the home page and live on `/manifesto`; the closing footer carries the manifesto line. The conversion path is proof, then faces, then "how do I get my face there", in three scrolls.

### §1 Hero

- **Purpose:** state the idea and show a real thing it made, in one viewport.
- **Content:**
  - Dateline (meta, ink-2): `Est. July 2024 · 15 tools · 24 builders · last commit 14h ago`. The last part comes from max `pushed_at`, with an 8px moss dot before it only when `isLive`. It does not pulse.
  - H1 (`display-1`, `max-width: 12.5ch` so it sets in three lines at 1440): **Software for everyone, built by <span kiln>anyone who shows up.</span>**
  - Lede (`lede`, ink-2): **A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a pull request and you're one of us.**
  - Actions: `Button lg primary` **Make your first PR →** (to `#start`), then `CommandChip` `gh repo fork Open-Dev-Society/OpenStock --clone`.
  - `Print` of OpenStock: a desktop capture, with the caption signed by its builders and live numbers.
- **Layout (≥ 1024):** cols 1–9 hold dateline, H1, then lede (cols 1–6) and the actions row, 96px under the nav. The `Print` spans cols 1–12, 64px under the actions, at 16:10. At 1440×900 its top 200px must be visible above the fold (Cursor composition). Below 1024: stacked. The print uses the **mobile** OpenStock capture (390×844), cropped to 4:5 with `object-position: top`.
- **The premium detail:** the caption. A museum label signed by 22 people with the real URL in the frame strip. It's proof without a stats strip.

### §2 Work: "the shelf"

- **Rail:** `Work` / `15 tools`.
- **H2:** **15 tools. 0 paywalls.** Dek: **Free to use, free to fork. Pushed to this week: OpenStock, kitbash, openreadme and ports.** (Computed from `pushed_at` within 7 days, joined naturally.)
- **Content:** three featured `RepoTile`s (cols 4/4/4): **kine-ui** (live-site capture), **openreadme** (live-site capture of a generated banner), **kitbash** (night panel with its tagline; it is the agent-era tool). Then `RepoIndex` with all 15 repos, OpenStock first (it is in the hero but the index is complete), sorted by stars then `pushed_at`. Below it: `All tools →` to `/projects`.
- **Layout:** tiles row, then 32px, then the segmented filter, then the ledger. Below 768 the featured tiles become a horizontal snap scroller (`snap-x snap-mandatory`, cards `78vw`, 12px gap, `scroll-padding-inline` equal to the page padding), and the ledger rows take two lines.
- **The premium detail:** the **For builders and agents** filter. It shows that half of ODS's recent work (kitbash, zomb, ports, tearcopy, settle-ui) is tooling for building with AI. That moves the site out of the pre-AI era with facts, not a chatbot.

### §3 People: "the wall" (signature 1)

- **Band:** `--paper-2`, full bleed.
- **Rail:** `People` / `24 builders`.
- **H2:** **24 people built all of this. Seat 25 is yours.** (N and N+1 are live.) Dek: **Every merged pull request puts a face on this wall. No interview, no invite.**
- **Content:** the `Wall` (home size), then the claim line, then a one-line **masthead** in `small` ink-2: `Founded by Ravi Pratap Singh. Co-founded by Priyanshu Bhardwaj. Maintained with Bipin Kumar Madhur and Mahin Chauhan.` Names link to GitHub. This replaces C's four person cards, so no face appears twice. Then `Everyone, by name →` to `/contributors`.
- **Layout:** the wall spans cols 1–12. At 1440 with 16 columns, 24 faces plus the open seat plus 7 quiet seats fill exactly 2 rows.
- **The premium detail:** the open seat that draws its own outline, and that you can fill with your own face.

### §4 Start: "the bench" (signature 2)

- **Band:** `--night`, full bleed. All text uses the night tokens.
- **Rail:** `Start` / `3 commands`.
- **H2:** **Three commands from here to the wall.**
- **Content:** `Steps` in cols 1–5:
  1. **Pick a repo.** Chips (`SegmentedControl` on night, wrapping) for repos with open issues, showing the count: `OpenStock 8`, `ports 5`, `kitbash 3`, `booktrace 1`.
  2. **Fork it and branch.**
  3. **Open a draft PR.** A maintainer reviews it in the open.
  4. **Get merged. Your face lands on the wall.** (Links up to `#people`.)

  The `Bench` sits in cols 6–12, sticky at `top: 96px` while the steps scroll past. Under it: `Not a coder? Writers, designers and teachers start here →` linking to `/contribute`.
- **Mobile:** the bench renders **inside step 1**, right under the chips, so changing the repo visibly changes the commands. Steps 2–4 follow as text.
- **The premium detail:** only the changed token re-lights in kiln. The terminal feels like an instrument, not a slideshow.

### §5 Word of mouth

- **Rail:** `Word of mouth` / `17 mentions`.
- **H2:** **What people wrote when they found it.**
- **Content:**
  - One feature `Quote` (cols 1–8): **"…great tools shouldn't hide behind logins or price tiers."** (Tattva Tarang · Medium · 2025).
  - Two compact quotes stacked in cols 9–12:
    - **"…the democratization of financial information and tools previously available only to institutional investors."** (Mohamed Idbrahim · brightcoding.dev)
    - **"It's more than just an app; it's a movement towards transparency in the financial sector."** (Built At Lightspeed)
  - Exclude the founder's own posts and every "Got mentioned" row. Then the `SourceLine`.
  - 64px later, the subsection **Who backs the work** (`title`): three `PartnerCard`s (cols 4/4/4) with our lines: Siray.ai: `AI infrastructure behind one API.` StellAILoom: `A hub for publishing and finding AI tools.` Atlas Cloud: `One API for hundreds of models.`
  - Then one sentence in `small`: `Community partner at Apretre 3.0 (Resourcio Community) and JWOC 2026 (JGEC).` Then `Partner with us →` (to `/word-of-mouth#partner-cta`).
- **The premium detail:** honest trimming. Real quotes, ellipses where we cut, never a doubled quote mark.

### §6 Closing (`SiteFooter`, every page)

- **Band:** `--night`, padding-block `--section`.
- **Statement:** `display-1` in night-ink, `max-width: 14ch`: **Technology should belong to <span night-kiln>everyone.</span>** Under it in `lede`, night-ink-2: **So we give ours away. We will never lock knowledge, charge for access, or trade trust for money.** Then `Read the manifesto →`.
- **Actions:** **Make your first PR →** (primary), **Join the Discord** (on-night), and a `CommandChip` on night.
- **Columns** (meta headings in night-ink-3, links in Inter 15, night-ink-2 → night-ink):
  - Society: Work, People, Manifesto, Word of mouth, Contribute
  - Credentials: Verify a certificate (`/verify`, with an ID field that redirects), Code of conduct
  - Elsewhere: GitHub, Discord, LinkedIn, X, Email
- **Bottom line** (meta, night-ink-3): `© 2026 Open Dev Society · Founded July 2024 · This site is open source too ↗` (links to the `opendevsociety` repo).
- **The premium detail:** the site ends on the manifesto line, and the last link is the site's own source.

## 11. Page templates

All inner pages follow the same structure: `SiteNav`, then `PageHero`, then 1–3 `Section`s, then `SiteFooter`. H1 is `display-2`.

**`/projects` (Work).** Rail `Work` / `15 tools`. H1 **15 tools. 0 paywalls.** Dek as on Home. Then the OpenStock `Print` (as in the hero), the three featured `RepoTile`s, and the full `RepoIndex` with the filter and `First issues (n)` links. Last section, **Bring your project** (from the manifesto: `Your project. Your vision. Our community.`), with 3 lines on what ODS gives (contributors, visibility, review) and a `Button` linking to the Discord.

**`/contributors` (People).** H1 **24 people, credited by name.** Then the masthead line, the `Wall` (page size, with the claim), and a `Ledger`: avatar 32 · name/@login · contributions (tabular) · repos (up to 3 names, then `+n`) · `↗`, sorted by contributions. The last section points to the bench: `Seat 25 is open →` to `/contribute`.

**`/manifesto`.** Long form, editorial. The text column is cols 3–10 (about 680px) with body at 17/1.7.
- Dateline `Manifesto · July 2024`, then H1 **Technology should belong to everyone.**
- Opening lede (22px): `Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they're not good enough. We think there's a better way, and we're building it.`
- **Four rules**: numbered `Steps`, one sentence each:
  - Default to open: `Every line of code and every decision is public.`
  - No permission needed: `No interviews. Fork it and send the PR.`
  - Ship, then improve: `Release early and fix it in the open.`
  - Lift each other: `Everyone teaches, everyone learns.`
- **What we build**: the old "Simple utilities / gateway to free books…" list, mapped to real repos as links.
- **The promise**: a `--night` card at full column width with the three "We will never…" lines in `title`, then `Running on transparency, donations and community.`
- **Platform, not gatekeeper**: bring your project, linking to the Discord.
- Pull quotes are `Quote feature` and break out to cols 2–11.

**`/contribute` (Start).** H1 **Your first contribution, from fork to merged.**
1. The `Bench` section (night band, the same component as Home).
2. **Not a coder?** Five cards (cols 4 each at lg, ending 4/4/4 + 6/6) for Code, Writing, Design, Teaching and Media. Each has who it's for (meta), three concrete tasks (`small` list) and one link. Rename the old "Ops" labels and drop the `ACCESS_REPOS ->` strings.
3. **How review works**: `Steps`: open a draft, a maintainer reviews it in public, you iterate, it merges and you're on the wall. No promised turnaround times.
4. **Code of conduct** (`id="conduct"`, wrapper `id="values"`): the five values as short lines, then a link to the full text on GitHub.
5. **Questions**: native `<details>` accordions (summary in `title`, chevron rotates over `--d-3`, content height via `interpolate-size: allow-keywords` where supported).

**`/word-of-mouth`.** H1 **What people wrote when they found it.** The feature `Quote`, then a `SegmentedControl` (All · Articles · Social · Community), then a `Ledger` of all mentions: source (meta) · author · title (one line, ellipsis) · year (mono) · `↗`. Then **Who backs the work** (`id="partners"`): `PartnerCard`s with fuller two-line descriptions we write, then an events `Ledger` (event · organizer · role · year), then the **partner CTA** (`id="partner-cta"`): `Back free software. Partner with us.` and a mailto `Button`.

**Tool template (`/certificate`, `/certificate/login`, `/certificate/manage`).** No marketing chrome: a 56px top bar with the logo, `Certificates` (Inter 600) and on the right `Manage` / `New` / `Sign out`. Paper ground, no grain, no footer statement (a single meta footer line). `robots: { index: false }`. Copy is plain sentence case: `AUTHENTICATING...` becomes `Checking…`, `NO_CERTIFICATES_ISSUED_YET` becomes `No certificates yet.`, and the filter placeholder becomes `Filter by ID, name, role or status`.
- `/certificate/login`: a centered `--card` panel, 400px wide, `--e-1`, `--r-md`. Title `Sign in to issue certificates` (`title`), one `Field`, a primary `Button` at full width, and the error under the field.
- `/certificate`: two panes at ≥ 1024. On the left (cols 1–4), the form: `Field`s for recipient, role (`SegmentedControl`: member, contributor, maintainer, mentor), description, date and issuer, then `Publish` (primary) and `Download PDF` (secondary). On the right (cols 5–12), the live `CertificateDocument` preview with `--e-2`. Below 1024 the preview comes first, then the form.
- `/certificate/manage`: a `Ledger` with ID (mono) · name · role · issued (mono) · `Status` · actions (`View`, `Revoke`, the latter confirmed inline, not with `window.confirm`), plus a filter `Field` above.

**Document template (`/verify/[id]`).** Public, indexable.
- At the top, a status line in `title` with an icon:
  - `Verified. Issued by Open Dev Society on 12 Mar 2026.` (moss)
  - `Revoked on 2 Apr 2026. Reason: …` (kiln-deep on kiln-wash)
  - Not found: H1 `We couldn't find certificate ODS-…` with a `Field` to try another ID.
- Then the `CertificateDocument` (read-only, `--e-2`).
- Then a details `Ledger`: certificate ID, recipient, role, issued, issuer and @handle, status.
- Actions: `Download PDF` (secondary, runs the existing print-clone flow) and `Copy link` (CommandChip style).
- `generateMetadata` keeps returning the name and role for link previews.

## 12. The certificate document (must print as one A4 landscape page)

- Keep the existing print mechanism exactly: the download button clones `.cert-document` into `#cert-print-clone` on `<body>`, adds `body.printing-cert`, and `globals.css` `@media print` sets `@page { size: A4 landscape; margin: 0 }` and fixes the clone at 297×210mm. Do not change those selectors or that flow. Extract it into the shared `CertificateDocument` (it is duplicated across `/certificate` and `/verify` today).
- Box: `aspect-ratio: 297 / 210`, `container-type: inline-size`, all inner sizes in `cqw` (as now), so the screen preview and the print are the same layout. Background `--card` with `print-color-adjust: exact`. No shadows, blur blobs, grain or backdrop filters inside the document. The tokens resolve because they live on `:root` (see section 4).
- **Frame:** one hairline inset at 3.2% in `--line`, plus four kiln corner ticks (L-shapes, 1.6cqw long, 0.18cqw thick, `--kiln`). This replaces the teal corners, the double border and the dashed border.
- **Top row:** logo (3.4cqw) with `Open Dev Society` (Inter 600, 1.4cqw) on the left. On the right, `Certificate` (meta-style, 0.95cqw, ink-3) above the ID (JetBrains 1.1cqw, ink).
- **Body:** `This certifies that` (Inter 400, 1.7cqw, ink-2). Then the **name** (Bricolage 650, opsz 96, wdth 80, `clamp(34px, 6.4cqw, 80px)`, tracking -0.035em, ink, balanced, at most 2 lines). Then the role as a `Status`-shaped tag (`--kiln-wash` with kiln-deep text, Inter 600, 1.1cqw). Then the description (Inter 400, 1.4cqw/1.55, ink-2, max 60ch).
- **Bottom row:** a 3-column grid over a top hairline.
  - Left: `Issued` (ink-3) over the date (JetBrains, 1.2cqw).
  - Center: `Verify at` over `opendevsociety…/verify/{id}` (JetBrains 1.0cqw, kiln-deep).
  - Right: the issuer name (Inter 600, 1.4cqw) over `@handle` (JetBrains 1.0cqw, ink-3), with a hairline signature rule above.
  - No fake script signatures.
- **Check:** in Chrome's print preview, `Download PDF` on `/verify/[id]` gives exactly 1 page, A4 landscape, with no clipping, for a 2-line name and a 4-line description.

## 13. Copy direction

- **Voice:** a workshop lead who is glad you came. Direct, warm, specific, a little dry.
- **Every claim gets a number or a name.** Numbers come from live data. If a number would embarrass us (★ 2), show a different true thing (`3 builders`, `pushed 2d ago`).
- **Verbs of making:** build, ship, fork, fix, merge, sign. Never: empower, revolutionize, journey, leverage, unlock, "the future", "next generation".
- **Headlines:** 8 words or fewer, sentence case, ending with a period. One clause in kiln at most per page (the H1 or the closing line), never both in one viewport.
- **No repetition:** "No paywalls. No gatekeeping." appears once on Home (the hero lede).
- **Microcopy:** buttons are verbs (`Make your first PR`, `Claim it`, `Copy`, `Download PDF`). Links end in `→` (internal) or `↗` (external).

Rewritten lines, final:

| Where | Copy |
|---|---|
| Hero H1 | Software for everyone, built by **anyone who shows up.** |
| Hero lede | A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a pull request and you're one of us. |
| Work H2 | 15 tools. 0 paywalls. |
| People H2 | 24 people built all of this. Seat 25 is yours. |
| Start H2 | Three commands from here to the wall. |
| Word of mouth H2 | What people wrote when they found it. |
| Partners | Who backs the work |
| Closing | Technology should belong to **everyone.** So we give ours away. |
| Metadata title | Open Dev Society: free, open-source software, built in public |
| Metadata description | A public workshop of developers, designers and writers building free, open-source tools. 21.4k stars, 24 builders, no paywalls. (Built from live totals.) |

## 14. What to cut from C

- The **build sheet** hero card (a repo list repeated three times). It is replaced by the OpenStock `Print`.
- The **stats strip** and `1,000+ members`.
- The `ODS·0x` tile labels, the `0n — KICKER` pills with the punched-hole dot, and all uppercase mono kickers.
- The **four person cards**. Faces appear once, on the wall, and names go in the masthead line.
- The **40-seat wall** with 36 empties.
- `Got mentioned by…` rows, the founder's own posts in Signal, line-clamped partner blurbs, and the two full-width event rows.
- The **Principles** section on Home. It moves to `/manifesto` and the closing line.
- The `Snapshot data. In production…` footnote, the `concept c · builder's workshop` footer line, and `Let's build the future together, openly.`
- The `FOREVER FREE` stamp and the rotated paper backing (decoration that competes with the real screenshot).
- The pinging green dot (it becomes a static moss dot, shown only when data is live).
- Uniform `-translate-y-0.5` hover-lift on every card.
- `First issues` links on repos with 0 such issues.
- The wrong `git clone` / `git checkout -b` flow.
- The fake arithmetic star counts (already fixed in `src/data/fallback.ts`). The page must read live data.

**Keep from C:** the paper and kiln palette (evolved above), Bricolage, the H1, the nav's spring pill, the copy→check morph, partner logos going grayscale→color, the inset-hairline shadows, `text-wrap` and focus handling, the ink "promise" card (moved to `/manifesto`), and the idea of one section per old route with an escape-hatch link.

## 15. Mobile rules (375–767px)

1. Page padding 20px. No horizontal page scroll at 375px, ever. Only the featured-tile snap scroller scrolls sideways, inside its own container.
2. H1 is `display-1` at 44px, 3–4 lines. The hero lede is 17px. All buttons are full width and the same width, stacked, with the `CommandChip` below them at full width.
3. The hero print uses the mobile OpenStock capture at 4:5. Its caption stacks: name and tagline, then the signature row.
4. Section rails collapse to one line above the H2: `Work · 15 tools`.
5. Featured tiles become a snap scroller (78vw). Index rows take 2 lines. There are no tables wider than the screen; a `Ledger` with more than 3 columns becomes stacked rows.
6. The wall has 8 columns. The claim field sits full width under it, and seats link straight to profiles (no tooltips on touch).
7. The bench sits inside step 1. Commands wrap with a hanging indent. The Terminal | Agent control is full width.
8. Tap targets are at least 44×44px. Chips are 36px tall with 4px vertical hit-slop padding.
9. Target total home height at 390px: **under 7,000px** (C was 10,549).
10. The nav sheet is full height, with `display-3` links, the Contribute button at the bottom (full width), and it closes on route change and on Escape.

## 16. Imagery: how to get the real screenshots

Capture once into the repo, under `public/shots/`, with a script `scripts/capture-shots.mjs` (playwright-core; install the browser with `PLAYWRIGHT_BROWSERS_PATH=<dir> npx playwright-core install chromium-headless-shell`, because the cached chromium-1148 is broken):

| File | URL | Viewport |
|---|---|---|
| `openstock-desktop.jpg` | https://openstock-ods.vercel.app | 1440×900 @2x, wait for network idle and a further 1.5s |
| `openstock-mobile.jpg` | same | 390×844 @3x |
| `kine-ui.jpg` | https://kine-ui.vercel.app | 1440×900 @2x |
| `openreadme.jpg` | https://openreadme.vercel.app | 1440×900 @2x |

Save as JPEG at quality 86; `next/image` serves AVIF/WebP. Dismiss cookie banners before capture. If a site shows an error or an empty state, don't use it; fall back to a typographic night tile like kitbash's. `openmind` and `openhaven` homepages return 404, so never link or capture them. Avatars: `<img>` with `width`/`height`, `loading="lazy"`, `decoding="async"` and `?s=96` (or `&s=96`) to get the right size.

## 17. Done means

- `npx tsc --noEmit` and `npm run lint` pass.
- At 1440 and 390: no console errors, no horizontal scroll, the hero is complete in the first viewport at 1440×900 with the print's top visible, and home height at 390 is under 7,000px.
- All text meets AA with the tokens above (no new color pairs without a check).
- Reduced motion: both signatures render in their final state, and nothing translates or blurs.
- Every number on the page traces to `src/lib/github.ts` or a `src/data/*` file.
- `/partners` redirects to `/word-of-mouth#partners`, and `/contribute#values` still lands.
- `/verify/[id]` prints exactly one A4 landscape page.
