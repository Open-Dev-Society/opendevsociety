# Open Dev Society: design brief ("Signed in ink")

The art direction and design system for the **whole site**. Concept C ("Builder's workshop") sets the idea and the structure: a workshop, a project shelf, a contributor wall and a first-PR path. Its look (beige paper, kiln orange, Bricolage) is replaced by the theme below, at the user's request. See the three themes side by side at **`/concepts/themes`**; the first one is this brief.

Where this brief and C disagree, this brief wins. Where it is silent, choose the quieter option.

**Sources to build from**
- **Data** is real and live: `getOrgRepos()`, `getOrgTotals()` and `getOrgContributors()` in `src/lib/github.ts` (revalidate 3600, snapshot fallback in `src/data/fallback.ts`). Never hard-code a count. The numbers below (21,406★, 2,669 forks, 24 builders, 15 tools, 17 mentions) are the 2026-11-10 snapshot and are only examples.
- **Copy:** `src/content/*.ts` holds the old copy, and its README lists the dead copy to cut. The rewritten lines in section 13 override it.
- **Foundation:** semantic tokens in `src/app/globals.css` and components in `src/components/site/` (from Claude Code 4). This brief sets their values and specs and adds a few tokens. It does not rename anything that exists.

---

## 1. The idea

> **Technology should belong to everyone, so we build it in public, sign every piece with the names of the people who made it, and keep a seat open for whoever shows up next.**

Short form: **made in public, signed by name, seat open.**

The workshop is the metaphor, and the theme is how it looks. A workshop is the opposite of a storefront: things are made there, not sold, tools hang on the wall for anyone, and every finished piece carries its maker's mark. The theme turns that into three materials:

| Material | On the page | Expresses |
|---|---|---|
| **Daylight paper**: a neutral off-white, no tint, no grain | The page ground | Made *in public*, in the open, nothing hidden |
| **Teal ink**: the logo's teal, the colour we sign in | Names, signatures, the H1's human clause, the primary action | *Signed by name*: people credit their work in ink |
| **Rose mark**: the logo's rose braces | Only what is yours: the open seat, your handle, the token that changed in your command | *Seat open*: this one is for you |
| **The inkwell**: a deep teal-black band | The bench (terminal) and the closing statement | Where the real tools are |

Two typefaces carry the same split. **Mona Sans** is the machine: GitHub's own open-source face, set in print. **Newsreader Italic** is the hand: every name, signature and quote, as if signed.

The test for any element: does it show something made in public, name who made it, or open a seat? If not, cut it.

## 2. What "premium" means here

Premium for a community is craftsmanship, not luxury. Concretely:

1. **Restraint.** One chroma (the logo teal) plus one rose mark that only means "yours". One idea per section. Two signature moments on the whole site and no ambient motion. At most three blue things and one yellow thing in any viewport.
2. **Type does the work.** A wide, confident grotesk against a fine italic serif: the machine next to the hand. The size steps are big. No uppercase kickers, no pills above headings.
3. **Whitespace with a rhythm.** One section rhythm, one 12-column grid, a left rail for labels. Space is measured, never left over.
4. **Real imagery only.** Real screenshots of live ODS tools, real GitHub avatars, real partner logos. No illustrations, no 3D, no stock photos, no gradients, no grain, no icon-in-a-circle feature trios.
5. **Honest numbers.** Live, sourced and formatted (`21.4k`). Small numbers are never dressed up as stars. No "1,000+ members".
6. **Captions like a museum label.** Small, precise, signed: what it is, who made it, the numbers, a link.
7. **Motion that confirms cause.** Things move because you did something, or once to show what a section means.
8. **Finish.** Hairlines instead of borders, concentric radii, tabular numbers, `text-wrap: balance/pretty`, focus rings, reduced motion, nothing clipped at 375px.

### References studied (take composition and restraint, not the look)

- **Cursor** (cursor.com): the product, shown at real scale, is the hero image. The headline stays modest and the visual owns the lower two thirds. *Take:* the hero print of OpenStock.
- **Mux** (mux.com): one saturated color on a quiet ground, mono for machine text only. *Take:* one chroma, used with discipline.
- **Turborepo** (turbo.build): one live number and one copyable command beside the CTA. *Take:* the command chip.
- **Astro Docs** (docs.astro.build): contributor faces as texture beside the headline. *Take:* faces as proof. We go further with the wall.
- **Linear, Stripe:** hairlines, editorial measure, dense precise captions. **Teenage Engineering:** labelling objects like instruments, with the product as the art. **Raycast:** chips and keys that feel physical.

## 3. Type system

Load with `next/font/google` in `src/app/layout.tsx`, replacing Inter, Playfair, JetBrains and Rock 3D once no page uses them. `--font-sans`, `--font-sign` and `--font-mono` go on `<body>`. The foundation already maps `--font-display` and `--font-body` to `--font-sans`.

```ts
const sans = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });
const sign = Newsreader({ subsets: ["latin"], style: "italic", axes: ["opsz"], variable: "--font-sign", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
```

- **Mona Sans** (display and text). GitHub's open-source (OFL) typeface, the native voice of open source. Its width axis gives one family both a wide, confident display cut and a calm text cut.
- **Newsreader Italic** (signatures). Used only for names, signatures, quotes and the H1's human clause: the hand that signs the work. Its optical sizes keep it crisp from 14 to 96px.
- **Geist Mono** (machine text). A neutral, tight mono for commands, IDs, handles and counts that doesn't fight Mona's width. Never used for labels or kickers.

| Token | Face | Size (375 → 1440) | Line height | Weight | Width / opsz | Tracking |
|---|---|---|---|---|---|---|
| `display-1` | Mona | `clamp(2.75rem, 1.5rem + 4.4vw, 5.25rem)` 44→84 | 0.96 | 680 | wdth 112 | -0.035em |
| `display-2` | Mona | `clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)` 36→56 | 1.02 | 650 | wdth 108 | -0.03em |
| `display-3` | Mona | `clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)` 28→36 | 1.08 | 620 | wdth 104 | -0.022em |
| `title` | Mona | 1.375rem / 22 | 1.2 | 600 | wdth 100 | -0.012em |
| `lede` | Mona | 1.1875rem / 19 (17 on mobile) | 1.55 | 400 | wdth 100 | -0.005em |
| `body` | Mona | 1rem / 16 (long-form 1.0625rem / 17) | 1.6 (long-form 1.7) | 400 | wdth 100 | 0 |
| `small` | Mona | 0.875rem / 14 | 1.5 | 400 | | 0 |
| `meta` | Mona | 0.8125rem / 13 | 1.4 | 500 | | 0.005em |
| `mono` | Geist Mono | 0.8125rem / 13 (min 12) | 1.5 | 450 | | 0 |
| `sign` | Newsreader Italic | **1.08em** of the surrounding text (the italic reads small) | inherit | 400 | opsz auto | -0.01em |
| `quote-feature` | Newsreader Italic | `clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem)` 28→44 | 1.2 | 400 | opsz 72 | -0.015em |

Rules:
- Width goes in `font-variation-settings: "wdth" 112` (one class per token). Weight goes in `font-weight`.
- **The `sign` rule.** Newsreader appears only for: the H1's emphasis clause, people's names in signatures and captions (`Signed by 21 builders`, the masthead names, quote attributions' names, the certificate's recipient and issuer), pull quotes, and the `Claim it` action. Never in body text, buttons or headings as a whole.
- Headings use `text-wrap: balance` and paragraphs `text-wrap: pretty`. Measure: body ≤ 64ch, lede ≤ 52ch.
- Counts and dates use `tabular-nums` (Mona or Geist Mono).
- Sentence case everywhere. No uppercase, no letter-spaced kickers, no `SNAKE_CASE` or `// V1.0` strings (the old site's hacker cosplay goes).
- There is one `display-1` per page, and only on Home. Inner pages use `display-2` for the H1.
- Size steps never collide: a tile title is never the size of its section's H2.

## 4. Palette (OKLCH, light, with an inverse band)

The colours come from the logo (`public/logo.png`): the teal of the "OS" mark, **#288488**, and the rose of the `{ }` braces, **#d03c5c**. No cobalt or yellow is left anywhere. The values live in one block in `globals.css`. Every text pair was measured (WCAG 2, against `--bg` unless noted):

```css
:root {
  --bg:           oklch(0.982 0.002 200);  /* #f8f9fa neutral off-white */
  --surface:      oklch(0.997 0.001 200);  /* #fdfefe cards, frames, certificate */
  --surface-2:    oklch(0.955 0.004 200);  /* #edf1f1 muted band, hovered rows */
  --fg:           oklch(0.21 0.03 212);    /* #051c20 teal-black ink. 16.7:1 (17.5 surface, 15.5 surface-2) */
  --fg-muted:     oklch(0.44 0.025 212);   /* #43565b 7.3:1, 6.8:1 on surface-2 */
  --fg-subtle:    oklch(0.52 0.02 212);    /* #5c6c70 5.2:1, 5.4 surface, 4.8 surface-2. Meta only */
  --line:         oklch(0.21 0.03 212 / 0.1);
  --accent-brand: #288488;                 /* logo teal. 4.2:1 on bg: large text and focus rings only */
  --accent:       oklch(0.52 0.085 199);   /* #10777b logo teal one step deeper: links, buttons, signed names. 5.0:1 (5.3 surface, 4.7 surface-2); white on it 5.3:1 */
  --accent-hover: oklch(0.46 0.08 200);    /* #00656a white on it 6.8:1 */
  --accent-fg:    oklch(1 0 0);
  --accent-soft:  oklch(0.95 0.025 195);   /* #dcf4f4 tags, active chip. --accent-hover on it 6.0:1, --fg 15.4:1 */
  --mark:         #d03c5c;                 /* logo rose: what is yours. As a fill, text is --mark-fg (white, 4.7:1). As text on bg only 4.5:1, so use --mark-ink */
  --mark-fg:      oklch(1 0 0);
  --mark-soft:    oklch(0.94 0.035 12);    /* #ffe2e5 pale rose fill: the open seat, ::selection. --fg on it 14.5:1 */
  --mark-ink:     oklch(0.5 0.17 12);      /* #ae2749 rose text on light grounds, 6.3:1 */
  --live:         oklch(0.52 0.12 152);    /* #227c45 live (<24h) and verified. 5.0:1 */
  --focus:        var(--accent-brand);     /* 4.2:1 on bg, 4.1:1 on --inv-bg (3:1 needed for non-text) */

  /* Inverse band: the inkwell (bench, footer, tooltips) */
  --inv-bg:        oklch(0.2 0.03 212);    /* #031a1e teal-black */
  --inv-surface:   oklch(0.255 0.033 212); /* #0d272c terminal, raised */
  --inv-fg:        oklch(0.965 0.004 200); /* 16.3:1, 14.1:1 on inv-surface */
  --inv-fg-muted:  oklch(0.8 0.02 205);    /* 9.7:1, 8.4:1 */
  --inv-fg-subtle: oklch(0.68 0.02 205);   /* 6.3:1, 5.5:1 */
  --inv-accent:    oklch(0.78 0.1 195);    /* #5ecbcb 9.4:1, 8.1:1. Buttons on inverse: this fill, --inv-bg text (9.4:1) */
  --inv-mark:      oklch(0.74 0.13 12);    /* #f08695 rose text on dark, 7.4:1 */
}
.tone-inverse {
  --accent: var(--inv-accent);
  --accent-hover: oklch(0.84 0.09 195);
  --accent-fg: var(--inv-bg);
  --accent-soft: oklch(0.78 0.1 195 / 0.16);
  --mark-ink: var(--inv-mark);
  /* --mark stays the logo rose with white text (4.7:1) on dark too */
}
.site ::selection { background: var(--mark-soft); color: oklch(0.21 0.03 212); }
```

Usage rules:
- **Teal** (`--accent`) is for the primary button, links (with a `--accent` underline at 30% that goes solid on hover), signed names (`sign` style), the H1's emphasis, the bench's variable tokens (`--inv-accent`) and focus rings (`--accent-brand`). The exact logo teal is only for large text and focus rings, because it is 4.2:1 on the page. It never appears on icons, borders or decorative fills.
- **Rose** (`--mark`, `--mark-soft`, `--mark-ink`) marks only what is yours: the open seat (pale fill, rose outline, rose plus), your claimed handle (rose ring, rose chip in the bench), the token that just changed in the bench, and `::selection`. It never carries meaning without text.
- **`--live`** means data is live (a commit within 24h) or a certificate is verified. Never decoration.
- Language dots in the index use GitHub's language colours at 8px, which is the only other chroma allowed.
- No grain, gradients or glass, except the nav's backdrop blur.
- Tokens live on `:root`, not on a wrapper class. The certificate print clone is appended to `<body>`, so tokens scoped to a wrapper would vanish in print.

Dark mode: not in v1. The inverse set is built so a full dark theme can map onto it later.

## 5. Grid, spacing, shape, depth

Set these foundation values:

```css
--container: 76rem;                       /* 1216px content */
--gutter: clamp(20px, 5vw, 48px);          /* page padding-inline (replaces the 16/24 step) */
--grid-gap: 24px;                          /* new; 16px below 768 */
--section-y: clamp(5rem, 3rem + 7vw, 9rem);/* 80→144, the one rhythm, every section */
--radius-sm: 8px;                          /* chips, inputs, seats, inner frames */
--radius-md: 14px;                         /* cards, tiles */
--radius-lg: 20px;                         /* print frame, terminal */
/* --radius-xl: remove. Pills (999px) are for buttons only. Inner radius = outer radius - padding. */
--shadow-sm: 0 0 0 1px var(--line), 0 1px 2px oklch(0.2 0.025 265 / 0.04);
--shadow-md: 0 0 0 1px var(--line), 0 2px 4px oklch(0.2 0.025 265 / 0.04), 0 12px 28px -14px oklch(0.2 0.025 265 / 0.16);
--shadow-lg: 0 0 0 1px var(--line), 0 2px 4px oklch(0.2 0.025 265 / 0.04), 0 32px 64px -32px oklch(0.25 0.06 265 / 0.35); /* new: print, terminal, hovered tiles */
```

- **Grid:** 12 columns, `--grid-gap`. Below 768, think in 4 columns.
- **Section header (the rail):** cols 1–3 hold the label (`meta`, `--fg-subtle`) with a live count under it (`mono`, `--fg-muted`). Cols 4–12 hold the H2 (`display-2`) and an optional dek (`lede`, `--fg-muted`). On mobile the rail collapses to one line above the H2: `Work · 15 tools`. The section's `→` link sits **under** the content, right-aligned, never beside the H2.
- **Spacing scale (px):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160. Nothing off-scale. Header to content is 48 (32 on mobile).
- **Depth:** an element never has both a border and a shadow. Rows separate with hairlines (`--line`), not cards.

## 6. Motion

Principles:
1. Motion confirms cause. A thing moves because you did something, or exactly once to show what a section means (the two signatures).
2. Only the hero has a load-in. No scroll-reveal fades on sections.
3. Exits are faster than entrances. Hover-out is slower than hover-in.
4. Animate only `transform`, `opacity`, `filter`, `background-color`, `box-shadow`, and `stroke-dashoffset` for the two signatures.
5. Under `prefers-reduced-motion: reduce`, no transforms or blurs. Opacity changes stay at ≤ 150ms, and both signatures render in their final state.

```css
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);   /* entrances, reveals, seat pop (replaces the foundation's value) */
--ease-ui:     cubic-bezier(0.2, 0, 0, 1);      /* hovers, presses, state changes */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* travel and resize: height, outline draw */
--d-1: 100ms; --d-2: 160ms; --d-3: 240ms; --d-4: 360ms; --d-5: 560ms;
```

| Interaction | Spec |
|---|---|
| Hero load | Items rise `translateY(8px) + blur(4px) → 0`, opacity 0→1, `--d-5 --ease-out`, stagger 60ms: dateline, H1, lede, actions, print. |
| Button | bg `--d-2 --ease-ui`; `:active` `scale(0.97)` `--d-1`; trailing arrow `translateX(2px)` `--d-2`. |
| Tile that navigates | `translateY(-2px)` and `--shadow-md → --shadow-lg`, in `--d-2`, out `--d-3`. Only navigating tiles lift. Rows get `--surface-2`. Nothing else lifts. |
| Nav pill and segmented controls | Framer `layoutId`, `{ type: "spring", duration: 0.35, bounce: 0 }`. |
| Mobile menu sheet | open `opacity`, `translateY(-8px)→0`, 280ms `--ease-out`; close 180ms `--ease-ui`. |
| Tooltip | 80ms hover intent, appear `--d-2` opacity and `scale(.97→1)`. Moving between seats swaps instantly. |
| Copy → check | Icon crossfade with `blur(2px)`, `--d-2`, reverting after 1.6s. |
| Images | Fade in on decode over `--d-3`. No blur-up. |
| Links | Underline from 30% to 100% `--accent`, `--d-2`. |

Banned: parallax, scroll-jacking, marquees, cursor followers, count-up numbers, typewriter headlines, tilt cards, ambient pings or pulses.

## 7. Signature moments

Two moments that tell one story: **you take a seat, and the bench shows you how to earn it.**

### Signature 1: "Take a seat" (the wall)

Every contributor has a seat, and one open seat is yours.

- **Fill (once):** when the wall is 35% in view (IntersectionObserver, then unobserve), seats appear in reading order. Each goes opacity 0→1 and `scale(.92→1)`, 280ms `--ease-out`, staggered 14ms (24 seats take about 620ms in total). 200ms after the last seat, the open seat's outline **draws itself**: an SVG `rect`, 1.5px, `--accent`, `stroke-dasharray`/`stroke-dashoffset` → 0 over 600ms `--ease-in-out`. Then its fill floods to `--mark` (`--d-3`) and the `+` fades in.
- **The open seat** sits at position N+1, directly after the last face. Under the wall: `Seat 25 is open.` (meta) and **`Claim it`** (`sign` style, `--accent`, underlined).
- **Claiming** opens an inline field under the wall, not a modal: Geist Mono with an `@` prefix and the placeholder `your-github-handle`. Validate `/^[a-z\d](?:[a-z\d-]{0,38})$/i` and load `https://github.com/${handle}.png?size=96` (client-only, no API call).
  - On load, the avatar fills the seat: `scale(.9→1)` and opacity, `--d-4 --ease-out`. The seat keeps a 2px `--mark` ring, so your face stays highlighted on the wall. The caption swaps (crossfade with a 4px slide, `--d-2`) to: `Saved for` *@handle* `. It's yours after your first merged PR.` and `Show me how ↓`.
  - On error: `No GitHub account called @handle.` in `--fg-muted`. No shake, no red.
  - Keep the handle in `localStorage["ods.handle"]` (try/catch), with a small `×` to clear it. It feeds signature 2.
- **Hover or focus on a seat:** an inverse tooltip with the *name* (`sign`) or @login, then `1,204 contributions · OpenStock, kitbash +3`. Each seat is a link to the GitHub profile, with the same text in `aria-label`. On touch, a tap opens the profile.
- **Never more empty than full:** contributors, plus the open seat, plus quiet `--surface-2` seats only to finish the last row (no `+`, no hover).

### Signature 2: "The bench" (your first PR, printed live)

- A terminal (`--inv-surface`, `--radius-lg`, `--shadow-lg`) on the inkwell band. Its title bar has a segmented control, **Terminal | Agent**, and a copy button.
- **Terminal** shows the correct fork flow, using the selected repo and the claimed handle (default `you`):
  ```
  $ gh repo fork Open-Dev-Society/OpenStock --clone
  $ cd OpenStock && git switch -c you/first-pr
  $ gh pr create --fill --draft
  ```
  The `$` is in `--inv-fg-subtle`, the commands in `--inv-fg`, the repo token in `--inv-accent`, and **the handle on a `--mark` chip** with `--mark-fg` text (your highlighter, carried over from the wall). Lines use `white-space: pre-wrap` with a 2ch hanging indent, so nothing clips at 375px. Under them: `Needs the GitHub CLI · cli.github.com` (mono 12, `--inv-fg-subtle`).
- **Agent** shows a copyable prompt in Mona 15/1.6: `Fork Open-Dev-Society/OpenStock, read its README and CONTRIBUTING, pick one open issue labelled "good first issue" or "help wanted", fix it on a branch named you/first-pr, and open a draft pull request that explains the change.` Under it: `Paste into any coding agent.` Don't claim an AGENTS.md exists.
- **Motion:** the first time the bench is 35% in view, the commands print at 9ms per character with 90ms between lines and a block caret blinking (`steps(1)`, 1.06s). They print once. After that, when the repo or handle changes, **only the changed tokens** crossfade (opacity plus a 3px y offset, `--d-2`) under a `--mark` flash that fades out over 900ms `--ease-out`. Tabs: spring pill, panel crossfade `--d-2`, height `--d-3 --ease-in-out`.

## 8. IA and routes

| Route | Nav label | Purpose | Status |
|---|---|---|---|
| `/` | (logo) | The workshop: proof, shelf, wall, bench, word of mouth, closing | redesign |
| `/projects` | Work | Every tool: the shelf and the full index | redesign |
| `/contributors` | People | The full wall and the ledger | redesign |
| `/manifesto` | Manifesto | The idea, long form | redesign |
| `/word-of-mouth` | Word of mouth | Every mention, plus partners and events (`#partners`) | redesign, absorbs `/partners` |
| `/contribute` | **Contribute** (button) | The bench, roles for non-coders, review, conduct, FAQ | redesign |
| `/certificate`, `/certificate/login`, `/certificate/manage` | (not in nav) | Internal, password-gated | tool template, `robots: { index: false }` |
| `/verify/[id]` | (not in nav) | Public certificate check | document template |

- **Redirects** (`next.config.ts` `redirects()`, `permanent: true`): `/partners` → `/word-of-mouth#partners`. Verify that `curl -sI 127.0.0.1:3000/partners` keeps the hash in `location`.
- **Anchors:** the partner CTA keeps `id="partner-cta"`. `/contribute#values` must still land, so put `id="values"` on the conduct section's wrapper and `id="conduct"` on its heading.
- **Nav (every non-tool page):** logo, then Work, People, Manifesto, Word of mouth, then a `★ 21.4k` chip (to the org), then a **Contribute** button. On Home the spring pill follows the section in view and links scroll to `#work`, `#people`, `#start`, `#signal`. On inner pages it marks the route.
- **Remove:** `SidebarPanels`, the dashed `max-w-5xl` frame, and the dot-grid body background and old `@theme` brand colors in `globals.css`. Keep the certificate print block.

## 9. Component inventory

Existing components in `src/components/site/` keep their names; their specs are below. New ones go in the same folder. Everything is a Server Component unless marked **client**.

| Component | Spec |
|---|---|
| `Nav` **client** (exists) | Sticky, 64px. `--bg` at 82% with `backdrop-filter: blur(12px) saturate(1.4)`. A hairline appears after 8px of scroll. Logo (`/logo.png`, 24px) plus `Open Dev Society` (Mona 600/15, wdth 104). Links are Mona 500/14, `--fg-muted` → `--fg`, with the spring pill (`--surface-2`). Stars chip: mono 13, `--shadow-sm`, `--radius-sm`. Contribute is a `Button md primary`. Below 768: logo, Contribute and a menu button; the full-height sheet lists links in `display-3`, then the stars chip and socials, and closes on route change and Escape. |
| `Footer` (exists) | The closing statement on every non-tool page (§6 of section 10), `tone="inverse"`. |
| `Section`, `Container` (exist) | `tone`: `default`, `muted` (People), `inverse` (bench, footer). Padding is `--section-y`. |
| `SectionHeader` (exists) | Becomes **the rail** (section 5): `eyebrow` is the rail label, plus a new `count` prop, then the H2 and `description`. `action` renders under the content, not beside the title. `align="center"` is not used. `as="h1"` uses `display-2`. |
| `Eyebrow` (exists) | The rail label: `meta` in `--fg-subtle`, **not** accent-colored, no index numerals. |
| `Button` (exists) | Heights 44 (md) and 52 (lg), pill, Mona 500/15. Padding-inline 20 (lg 24), with 16 on the arrow side. `primary`: `--accent` bg, `--accent-fg` text, `--accent-hover` on hover, inner top highlight `inset 0 1px 0 oklch(1 0 0 / .18)`. `secondary`: `--surface` with `--shadow-sm`. `ghost`: text with a 2px arrow nudge. In `tone-inverse` the tokens re-point by themselves. Full width below 640. |
| `CopyCommand` **client** (exists) | Geist Mono 13 in a `--surface` chip with `--shadow-sm`, `--radius-sm`, 44px tall. `$` in `--fg-subtle`. Copy icon on the right, with the copy→check morph. Truncates with a fade mask, never wraps. |
| `Card`, `Badge` (exist) | Card: `--surface`, `--radius-md`, `--shadow-md`, padding 20 (24 at lg). Badge: `--radius-sm`, Mona 500/12, height 22; `accent` = `--accent-soft` bg with `--accent-hover` text, `live` = `--live` text on `--live` at 12% alpha. |
| `Quote` (exists, uses `cleanQuote`) | `feature`: `quote-feature` (Newsreader Italic) with hanging punctuation. `compact`: Newsreader Italic 22/1.35. Attribution in `meta`: the *name* in `sign` style, then `· Medium · 2025 ↗` in `--fg-muted`. Quote marks come from CSS `quotes`, never typed in. Text is trimmed of straight and curly quotes at both ends, which fixes C's doubled-quote bug. |
| `StatGroup` / `compact` (exist) | Inline only: number (Mona 600, tabular) plus a label (`--fg-muted`), inside captions, rails and the dateline. **There is no standalone stats strip anywhere.** |
| `Avatar`, `AvatarStack` (exist) | Avatars are circles in stacks and `--radius-sm` squares on the wall. 1px `--img-outline` inset. Stack of 5 × 24px with a 2px `--surface` ring and -6px overlap. Load with `&s=` sized to 2× display. |
| `Print` (new) | A screenshot frame. `--surface` passe-partout of 8px (6 on mobile), `--radius-lg` outside and `--radius-sm` inside, `--shadow-lg`. A 32px top strip shows the real URL in mono 12, `--fg-subtle`; no fake traffic lights. `next/image` with `sizes`. **Caption** row underneath: left is the name (`title`) and what it is (`small`, `--fg-muted`); right is `AvatarStack`, `Signed by` *21 builders* (`sign`, accent), `★ 21.4k · 2.7k forks` (mono 13), and `Open it ↗`. |
| `RepoTile` (new) | `Card` with a 16:10 image (inner `--radius-sm`), or for kitbash an inverse panel with its tagline in `display-3`. Then the name (`title`), tagline (`small`), and a meta row: language dot · `pushed 3d ago` · `N builders` · `★` only if ≥ 50. The whole tile is one link (stretched `::after`) and lifts on hover. |
| `RepoIndex` **client** (filter only, new) | A `SegmentedControl` (`All · For everyone · For builders and agents`), then hairline rows 56px tall, hover `--surface-2`. Each row: name (Mona 600/16) · tagline (`--fg-muted`) · audience (`meta`) · language dot · `pushed 3d ago` (mono 13) · signal (`★ 21.4k` if ≥ 50, else `N builders`) · `↗`. Below 768, two lines per row. `First issues (n)` (accent link, `meta`) shows **only when n > 0**. |
| `SegmentedControl` **client** (new) | `--surface-2` track, `--surface` pill with `--shadow-sm` and the spring. Mona 500/14. `role="tablist"` with arrow keys. In `tone-inverse`, the track is `--inv-bg` and the pill `--inv-surface`. |
| `Wall` **client** (new) | Square seats in 16 columns at ≥ 1024, 12 at ≥ 640, 8 below. 6px gap, `--radius-sm`. Core crew (`src/data/contributors.ts`) get a 2px `--accent-soft` ring. Includes `YourSeat` and the claim field (section 7). Takes `size: "home" \| "page"`; page seats are 1.25×. |
| `Tooltip` **client** (new) | `--inv-bg`, `--inv-fg`, Mona 13/1.4, `--radius-sm`, padding 8/10, max 260px, 6px offset, no arrow. |
| `Bench` **client** (new) | Section 7, signature 2. Takes `repos` (name and open_issues) and reads the handle through a tiny `useSyncExternalStore` over localStorage (no context provider). |
| `Steps` (new) | Ordered list with hairline separators. Each step: a numeral (`display-3`, `--accent`), a title (`title`) and a body (`body`, `--fg-muted`). |
| `SourceLine` (new) | One line of `meta` links separated by ` · `: `Also covered by Daily.dev · Hello GitHub · MAGI//ARCHIVE · Reddit · Threads · Facebook`, then `All 17 mentions →`. |
| `PartnerCard` (new) | `Card`. Logo at 32px height, grayscale and 80% opacity → color on hover (`--d-2`), then one line we wrote (`small`, `--fg-muted`), never clamped. |
| `Ledger` (new) | Hairline table for mentions, contributors, certificates and events. Header row in `meta` `--fg-subtle`, rows 52px, mono for IDs and dates. Below 768 it becomes stacked rows; never a table wider than the screen. |
| `Field` (new) | 44px, `--surface`, `--shadow-sm`, `--radius-sm`, Mona 15. Focus is a 2px `--focus` ring with 2px offset. The label above is `meta` `--fg-muted`; errors go below in `--fg-muted` with an icon. Never red fills. |
| `CertificateDocument` (new) | Shared by `/certificate` (editable) and `/verify/[id]` (read-only). Section 12. |

Data helpers: `compact` already exists in `Stat`. Add `ago(iso)` (`3d ago`, `14h ago`) and `isLive(iso)` (under 24h) in `src/lib/format.ts`.
Catalog: add `src/data/catalog.ts` mapping each repo name to `{ tagline, audience: "everyone" | "builders", shot?: string, featured?: boolean }`. Hide `.github` and `opendevsociety` from public lists. `den` gets an `alpha` Badge.

| Repo | Audience | Tagline (≤ 56 chars, ours, faithful to the README) |
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

Order: **Hero (OpenStock proof) → Work (the shelf) → People (the wall) → Start (the bench) → Word of mouth → closing footer.** The principles move to `/manifesto`, and the footer carries the manifesto line. The path runs proof, then faces, then "how do I get my face there", in three scrolls.

### §1 Hero

- **Content:**
  - Dateline (`meta`, `--fg-muted`): `Est. July 2024 · 15 tools · 24 builders · last commit 14h ago`. The last part comes from max `pushed_at`, with a 6px `--live` dot only when `isLive`. It doesn't pulse.
  - H1 (`display-1`, `max-width: 14ch`, balanced): **Software for everyone, built by** *anyone who shows up.* The italic clause is `sign` style in `--accent`.
  - Lede (`lede`, `--fg-muted`): **A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a pull request and you're one of us.**
  - Actions: `Button lg primary` **Make your first PR →** (to `#start`), then `CopyCommand` `gh repo fork Open-Dev-Society/OpenStock --clone`.
  - `Print` of OpenStock (desktop capture), with its caption signed and the numbers live.
- **Layout (≥ 1024):** cols 1–9 hold the dateline, H1, lede (cols 1–6) and the actions, 96px under the nav. The `Print` spans cols 1–12, 64px under the actions, at 16:10, with its top 200px visible at 1440×900 (Cursor composition). Below 1024 everything stacks, and the print uses the **mobile** OpenStock capture, cropped to 4:5 with `object-position: top`.
- **The premium detail:** the caption is a museum label signed by 21 people in ink, with the real URL in the frame strip. It gives the proof without needing a stats strip.

### §2 Work: the shelf

- **Rail:** `Work` / `15 tools`.
- **H2:** **15 tools. 0 paywalls.**
- **Dek:** **Free to use, free to fork. Pushed to this week: OpenStock, kitbash, openreadme and ports.** Computed from `pushed_at` within 7 days.
- **Content:** three featured `RepoTile`s (cols 4/4/4): **kine-ui** (live-site capture), **openreadme** (live-site capture), **kitbash** (an inverse panel; it's the agent-era tool). Then the `RepoIndex` of all 15 repos: OpenStock first, then by stars, then by `pushed_at`. Then `All tools →` to `/projects`.
- **Mobile:** the featured tiles become a snap scroller (`snap-x snap-mandatory`, cards at 78vw, 12px gap, `scroll-padding-inline: var(--gutter)`), and index rows take two lines.
- **The premium detail:** the **For builders and agents** filter. It shows that much of ODS's recent work (kitbash, zomb, ports, tearcopy, settle-ui) is tooling for building with AI. That's current with facts, not with a chatbot.

### §3 People: the wall (signature 1)

- `tone="muted"`, full bleed.
- **Rail:** `People` / `24 builders`.
- **H2:** **24 people built all of this. Seat 25 is yours.** (N and N+1 are live.)
- **Dek:** **Every merged pull request puts a face on this wall. No interview, no invite.**
- **Content:** the `Wall`, then the claim line, then a one-line masthead in `small` `--fg-muted` with the names in `sign`: `Founded by` *Ravi Pratap Singh*`. Co-founded by` *Priyanshu Bhardwaj*`. Maintained with` *Bipin Kumar Madhur* `and` *Mahin Chauhan*`.` Names link to GitHub. This replaces C's four person cards, so no face appears twice. Then `Everyone, by name →` to `/contributors`.
- **Layout:** at 1440 with 16 columns, 24 faces plus the open seat plus 7 quiet seats fill exactly 2 rows.
- **The premium detail:** the open seat draws its own outline in ink, and you can put your own face in it.

### §4 Start: the bench (signature 2)

- `tone="inverse"` (the inkwell), full bleed.
- **Rail:** `Start` / `3 commands`.
- **H2:** **Three commands from here to the wall.**
- **Content:** `Steps` in cols 1–5:
  1. **Pick a repo.** Chips (`SegmentedControl`, wrapping) for repos with open issues, with counts: `OpenStock 8`, `ports 5`, `kitbash 3`, `booktrace 1`.
  2. **Fork it and branch.**
  3. **Open a draft PR.** A maintainer reviews it in the open.
  4. **Get merged. Your face lands on the wall.** (Links up to `#people`.)

  The `Bench` sits in cols 6–12, `position: sticky; top: 96px`. Under it: `Not a coder? Writers, designers and teachers start here →` to `/contribute`.
- **Mobile:** the bench renders **inside step 1**, right under the chips, so changing the repo visibly changes the commands.
- **The premium detail:** your handle shows on a rose chip in the branch name. It's the same mark as your seat.

### §5 Word of mouth

- **Rail:** `Word of mouth` / `17 mentions`.
- **H2:** **What people wrote when they found it.**
- **Content:**
  - A feature `Quote` (cols 1–8): *"…great tools shouldn't hide behind logins or price tiers."* (Tattva Tarang · Medium · 2025).
  - Two compact quotes stacked in cols 9–12:
    - *"…the democratization of financial information and tools previously available only to institutional investors."* (Mohamed Idbrahim · brightcoding.dev)
    - *"It's more than just an app; it's a movement towards transparency in the financial sector."* (Built At Lightspeed)
  - Exclude the founder's own posts and every "Got mentioned" row. Then the `SourceLine`.
  - 64px later, **Who backs the work** (`title`): three `PartnerCard`s (cols 4/4/4):
    - Siray.ai: `AI infrastructure behind one API.`
    - StellAILoom: `A hub for publishing and finding AI tools.`
    - Atlas Cloud: `One API for hundreds of models.`
  - Then one sentence in `small`: `Community partner at Apretre 3.0 (Resourcio Community) and JWOC 2026 (JGEC).` Then `Partner with us →`.
- **The premium detail:** real quotes set like a printed review, with honest ellipses and never a doubled quote mark.

### §6 Closing (`Footer`, every non-tool page)

- `tone="inverse"`, padding `--section-y`.
- **Statement** (`display-1` at 0.85×, `max-width: 14ch`): **Technology should belong to** *everyone.* The last word is in `sign` style, `--inv-accent`.
- Then in `lede` `--inv-fg-muted`: **So we give ours away. We will never lock knowledge, charge for access, or trade trust for money.** Then `Read the manifesto →`.
- **Actions:** **Make your first PR →** (primary, which reads as light teal on ink), **Join the Discord** (secondary), and a `CopyCommand`.
- **Columns** (`meta` headings in `--inv-fg-subtle`, links in Mona 15 `--inv-fg-muted` → `--inv-fg`):
  - Society: Work, People, Manifesto, Word of mouth, Contribute
  - Credentials: Verify a certificate (an ID `Field` that routes to `/verify/[id]`), Code of conduct
  - Elsewhere: GitHub, Discord, LinkedIn, X, Email
- **Bottom line** (`meta`): `© 2026 Open Dev Society · Founded July 2024 · This site is open source too ↗` (links to the `opendevsociety` repo).

## 11. Page templates

Inner pages all follow: `Nav`, then the page header, then 1–3 `Section`s, then `Footer`. The page header is `SectionHeader as="h1"` (rail plus `display-2` H1 plus dek), with `padding-top: 96px` (64 on mobile).

**`/projects` (Work)**
- H1 **15 tools. 0 paywalls.**
- The OpenStock `Print`, the three featured `RepoTile`s, and the full `RepoIndex` with filter and `First issues (n)` links.
- Last section, **Bring your project**: `Your project. Your vision. Our community.` with three lines on what ODS gives (contributors, visibility, review) and a Discord `Button`.

**`/contributors` (People)**
- H1 **24 people, credited by name.**
- The masthead line, then the `Wall` (page size, with the claim).
- A `Ledger`: avatar 32 · *name* (`sign`) / @login (mono) · contributions (tabular) · repos (up to 3, then `+n`) · `↗`, sorted by contributions.
- It ends with `Seat 25 is open →` to `/contribute`.

**`/manifesto`**
- Long form. Text column at cols 3–10 (about 680px), body 17/1.7.
- Dateline `Manifesto · July 2024`, then H1 **Technology should belong to** *everyone.*
- Opening lede (22px): `Knowledge is hidden behind paywalls. Tools are locked in subscriptions. Newcomers are told they're not good enough. We think there's a better way, and we're building it.`
- **Four rules** as `Steps`, one sentence each:
  - Default to open: `Every line of code and every decision is public.`
  - No permission needed: `No interviews. Fork it and send the PR.`
  - Ship, then improve: `Release early and fix it in the open.`
  - Lift each other: `Everyone teaches, everyone learns.`
- **What we build**: the old list (simple utilities, a gateway to free books, roadmaps, courses…) mapped to real repos as links where they exist; aspirations are labelled `planned`.
- **The promise**: an inverse card at column width. The three "We will never…" lines in `title`, then `Running on transparency, donations and community.`, then a signature line: *Ravi Pratap Singh*, founder (`sign`).
- **Platform, not gatekeeper**: bring your project, with a Discord link.
- Pull quotes are `Quote feature` and break out to cols 2–11.

**`/contribute` (Start)**
- H1 **Your first contribution, from fork to merged.**
- **The bench**: an inverse section, the same component as Home.
- **Not a coder?**: five `Card`s (3 + 2 at lg; cols 4/4/4 then 6/6) for Code, Writing, Design, Teaching and Media. Each has who it's for (`meta`), three concrete tasks (`small` list) and one real link. Fix the dead `href="#"` links and the `[LINK_PENDING]` Discord placeholder noted in the content README.
- **How review works**: `Steps`: open a draft, a maintainer reviews it in public, you iterate, it merges and you're on the wall. No promised turnaround times.
- **Code of conduct** (`id="conduct"`, wrapper `id="values"`): the values as short lines, then a link to the full text on GitHub.
- **Questions**: native `<details>` (summary in `title`, chevron rotates over `--d-3`, `interpolate-size: allow-keywords` where supported).

**`/word-of-mouth`**
- H1 **What people wrote when they found it.**
- The feature `Quote`, then a `SegmentedControl` (All · Articles · Social · Community), then a `Ledger` of every mention: source (`meta`) · *author* · title (one line) · year (mono) · `↗`.
- **Who backs the work** (`id="partners"`): `PartnerCard`s with fuller two-line descriptions (ours), then an events `Ledger`, then the **partner CTA** (`id="partner-cta"`): `Back free software. Partner with us.` and a mailto `Button`.

**Tool template** (`/certificate`, `/certificate/login`, `/certificate/manage`)
- No marketing chrome: a 56px bar with the logo, `Certificates` (Mona 600) and on the right `Manage · New · Sign out`. `--bg` ground, a single `meta` footer line, `robots: { index: false }`.
- Copy is plain sentence case: `AUTHENTICATING...` becomes `Checking…`, `NO_CERTIFICATES_ISSUED_YET` becomes `No certificates yet.`, and the filter placeholder becomes `Filter by ID, name, role or status`. Replace `window.confirm/prompt/alert` with inline confirmations.
- **`/certificate/login`**: a centered `Card` 400px wide. `Sign in to issue certificates` (`title`), one `Field`, a full-width primary `Button`, and the error under the field.
- **`/certificate`**: two panes at ≥ 1024. On the left (cols 1–4), the form: `Field`s for recipient, role (`SegmentedControl`: member · contributor · maintainer · mentor), description, date and issuer, then `Publish` (primary) and `Download PDF` (secondary). On the right (cols 5–12), the live `CertificateDocument` with `--shadow-lg`. Below 1024 the preview comes first.
- **`/certificate/manage`**: a `Ledger` with ID (mono) · *name* · role · issued (mono) · status `Badge` (`live` "Active" / accent-soft "Revoked") · `View` and `Revoke` (inline confirm). A filter `Field` sits above it.

**Document template** (`/verify/[id]`, public)
- A status line in `title` with an icon:
  - `Verified. Issued by Open Dev Society on 12 Mar 2026.` (`--live`)
  - `Revoked on 2 Apr 2026. Reason: …` (`--fg` on `--surface-2` with a 3px `--fg-muted` left rule; never red)
  - Not found: H1 `We couldn't find certificate ODS-…` and a `Field` to try another ID.
- Then the `CertificateDocument` (read-only, `--shadow-lg`).
- Then a details `Ledger`: ID, recipient, role, issued, issuer and @handle, status.
- Actions: `Download PDF` (secondary, runs the existing print-clone flow) and `Copy link`.
- `generateMetadata` keeps the name and role for link previews.

## 12. The certificate document (one A4 landscape page)

- **Keep the print mechanism exactly.** The download button clones `.cert-document` into `#cert-print-clone` on `<body>` and adds `body.printing-cert`. `@media print` in `globals.css` sets `@page { size: A4 landscape; margin: 0 }` and fixes the clone at 297×210mm. Don't change those selectors or that flow. Extract the duplicated markup (in `/certificate` and `/verify`) into `CertificateDocument`.
- **Box:** `aspect-ratio: 297 / 210`, `container-type: inline-size`, every inner size in `cqw` (as now), so the screen and print layouts match. Background `--surface` with `print-color-adjust: exact`. No shadows, blur blobs, grain or filters inside. The tokens resolve because they are on `:root`. Fonts are loaded by `next/font` on `<body>`, which the clone sits inside.
- **Frame:** one hairline inset at 3.2% in `--line`, plus four corner ticks: L-shapes 1.6cqw long and 0.18cqw thick, in `--accent`. This replaces the teal corners, the double border and the dashed border.
- **Top row:** logo (3.4cqw) with `Open Dev Society` (Mona 600, wdth 108, 1.4cqw) on the left. On the right, `Certificate` (Mona 500, 0.95cqw, `--fg-subtle`) above the ID (Geist Mono 1.1cqw).
- **Body:**
  - `This certifies that` (Mona 400, 1.7cqw, `--fg-muted`).
  - The **recipient's name** in Newsreader Italic (opsz 72, 400, `clamp(34px, 6.6cqw, 84px)`, `--fg`, at most 2 lines): the name is signed, not typeset.
  - The role as a Badge (`--accent-soft` with `--accent-hover` text, Mona 600, 1.1cqw).
  - The description (Mona 400, 1.4cqw/1.55, `--fg-muted`, max 60ch).
- **Bottom row:** 3 columns over a top hairline.
  - Left: `Issued` over the date (Geist Mono 1.2cqw).
  - Center: `Verify at` over the URL path `/verify/{id}` on the site's domain (Geist Mono 1.0cqw, `--accent`).
  - Right: the issuer's **signature**, their name in Newsreader Italic 2.2cqw in `--accent` (teal ink) above a hairline, then the name and `@handle` (Mona 500 1.0cqw plus Geist Mono).
- **Check:** Chrome print preview of `Download PDF` on `/verify/[id]` gives exactly 1 page, A4 landscape, with no clipping, for a 2-line name and a 4-line description.

## 13. Copy direction

- **Voice:** a workshop lead who is glad you came. Direct, warm, specific, a little dry.
- **Every claim gets a number or a name.** Numbers are live. If a number would embarrass us (★ 2), show a different true thing (`3 builders`, `pushed 2d ago`).
- **Verbs of making:** build, ship, fork, fix, merge, sign. Never: empower, revolutionize, journey, leverage, unlock, "the future", "next generation".
- **Headlines:** 8 words or fewer, sentence case, ending with a period. One italic `sign` clause per page at most in a headline (the H1 or the closing line).
- **No repetition:** "No paywalls…" appears once on Home (the hero lede).
- **Microcopy:** buttons are verbs (`Make your first PR`, `Claim it`, `Copy`, `Download PDF`). Links end in `→` (internal) or `↗` (external).

| Where | Copy (final) |
|---|---|
| Hero H1 | Software for everyone, built by *anyone who shows up.* |
| Hero lede | A public workshop of developers, designers and writers making free, open-source tools. No paywalls. No interviews. Send a pull request and you're one of us. |
| Work H2 | 15 tools. 0 paywalls. |
| People H2 | 24 people built all of this. Seat 25 is yours. |
| Start H2 | Three commands from here to the wall. |
| Word of mouth H2 | What people wrote when they found it. |
| Partners | Who backs the work |
| Closing | Technology should belong to *everyone.* So we give ours away. |
| Meta title | Open Dev Society: free, open-source software, built in public |
| Meta description | A public workshop of developers, designers and writers building free, open-source tools. 21.4k stars, 24 builders, no paywalls. (Built from live totals.) |

## 14. What to cut from C

- **The look:** the beige paper, kiln orange, Bricolage and the paper grain, replaced by this theme. The `FOREVER FREE` stamp and the rotated paper backing go too.
- The **build sheet** hero card (one repo list shown three times). The OpenStock `Print` replaces it.
- The **stats strip** and `1,000+ members`.
- `ODS·0x` tile labels, the `0n — KICKER` pills with the punched-hole dot, and all uppercase mono kickers.
- The **four person cards**. Faces appear once, on the wall, and names go in the masthead.
- The **40-seat wall** with 36 empty seats.
- `Got mentioned by…` rows, the founder's own posts in Signal, line-clamped partner blurbs, and the full-width event rows.
- The **Principles** section on Home. It moves to `/manifesto` and the closing line.
- The `Snapshot data…` footnote, the `concept c` footer line, and `Let's build the future together, openly.`
- The pinging dot (it becomes a static `--live` dot, shown only when live), and the uniform hover-lift on every card.
- `First issues` links where there are none, and the wrong `git clone` / `checkout -b` flow.

**Keep from C:** the idea and its order (shelf, wall, path), the H1, the interactive first-PR path, the nav's spring pill, the copy→check morph, partner logos going grayscale→color, inset-hairline shadows, `text-wrap` and focus handling, the inverse "promise" card (moved to `/manifesto`), and one section per old route with an escape-hatch link.

## 15. Mobile rules (375–767px)

1. Page padding is `--gutter` (20px at 375). No horizontal page scroll, ever. Only the featured-tile snap scroller scrolls sideways, inside its own container. Grids must declare `grid-cols-1` (or `minmax(0,1fr)`); an implicit column grows to fit a nowrap command chip.
2. The H1 is 44px over 3–4 lines, and the italic clause may take its own line. The lede is 17px. Buttons are full width and the same width, stacked, with the `CopyCommand` below them at full width.
3. The hero print uses the mobile OpenStock capture at 4:5. Its caption stacks: name and tagline, then the signature row.
4. Section rails become one line: `Work · 15 tools`. The dateline wraps with `flex-wrap`, so no orphaned dots.
5. Featured tiles are a 78vw snap scroller. Index rows take 2 lines. `Ledger`s become stacked rows.
6. The wall has 8 columns. The claim field is full width, and seats link straight to profiles (no tooltips on touch).
7. The bench sits inside step 1. Commands wrap with a hanging indent. Terminal | Agent spans full width.
8. Tap targets are at least 44×44px. Chips are 36px tall with 4px vertical hit-slop.
9. Target home height at 390px: **under 7,000px** (C was 10,549).
10. The nav sheet is full height with `display-3` links and a full-width Contribute button at the bottom. It closes on route change and Escape.

## 16. Imagery: real screenshots

Capture once into `public/shots/` with `scripts/capture-shots.mjs` (playwright-core). Install the browser with `PLAYWRIGHT_BROWSERS_PATH=<dir> npx playwright-core install chromium-headless-shell`; the cached chromium-1148 is broken.

| File | URL | Viewport |
|---|---|---|
| `openstock-desktop.jpg` | https://openstock-ods.vercel.app | 1440×900 @2x, network idle plus 1.5s |
| `openstock-mobile.jpg` | same | 390×844 @3x |
| `kine-ui.jpg` | https://kine-ui.vercel.app | 1440×900 @2x |
| `openreadme.jpg` | https://openreadme.vercel.app | 1440×900 @2x |

- Save as JPEG at quality 86; `next/image` serves AVIF/WebP.
- Dismiss cookie banners first. If a capture shows an error or an empty state, use an inverse typographic tile instead (like kitbash).
- `openmind` and `openhaven` homepages return 404: never link or capture them.
- Avatars: `<img>` with `width`/`height`, `loading="lazy"`, `decoding="async"` and a size parameter at 2× display.

## 17. Done means

- `npx tsc --noEmit` and `npm run lint` pass.
- At 1440 and 390: no console errors and no element wider than the viewport. At 1440×900 the hero is complete and the print's top is visible. Home at 390 is under 7,000px.
- Text contrast meets AA using only the token pairs above. Any new pair gets measured.
- Reduced motion: both signatures render in their final state, and nothing translates or blurs.
- Every number traces to `src/lib/github.ts` or a `src/data/*` file.
- `/partners` redirects to `/word-of-mouth#partners`, and `/contribute#values` still lands.
- `/verify/[id]` prints exactly one A4 landscape page.
