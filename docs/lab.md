# Open Dev Society: the visual language

**"Lab" is the LOOK, not the language.** The site borrows the visual vocabulary of a lab or instrument: a living reaction–diffusion field, 1-bit dither, mono labels on plates, hairline grids, live readouts. The words stay plain and direct for the real audience: **developers** (find a project, contribute), **founders** (bring a project, get contributors and visibility, keep ownership) and **creators** (designers, writers and educators who want to build in public).

Never use lab jargon in visible copy: no experiments/EXP-ids, researchers/R-numbers, working paper, protocol, citations, specimen, "join the lab". Call things what they are: **Projects, Contributors, Manifesto, Contribute, What people say, Partners, Certificates**.

The home hero (`src/components/site/lab-hero/`) is the visual reference: a live field, a condensed headline, emerald corner plates, and square filled buttons.

## Never

Split heroes (headline left, card right). Card grids with rounded shadows. Pill buttons. Dashboards of stat tiles. Gradient blobs. Emoji. Section after section with the same eyebrow-plus-heading template. Anything that reads as a SaaS template. Lab-roleplay copy.

## Materials

- **Paper:** `--bg` off-white. **Ink:** `--fg` teal-black. **Emerald:** `--accent` #10777b for buttons, links, the corner plates and bands that ask you to act. **Teal:** `--accent-brand` #288488 for the field and dither. **Rose:** `--mark` #d03c5c, only for "you / your spot / new"; `--mark-ink` for rose text. `--line` for hairlines. `.tone-inverse` (ink) and `.tone-emerald` re-point tokens for dark and emerald bands. Tokens live in `src/app/globals.css`; never hard-code.
- **Type:**
  - Display: Mona Sans (`--font-sans`) at `font-stretch: 75%`, weight 800, tight leading. Use it for page titles and big numbers.
  - Body: Mona Sans at normal width, 16–18px, about 65ch.
  - Labels: Geist Mono (`--font-mono`), 11–13px, for metadata, counts, dates and tables.
  - Newsreader Italic (`--font-sign`) only for a person's name or signature, sparingly.
- **Dither:** the signature texture. Project screenshots and avatars render 1-bit or duotone dithered through `src/components/site/lab/Dither.tsx` (it can "develop" from coarse to fine on hover). Static first paint, no CLS, alt text kept.
- **Plates:** small mono labels on a rectangle, like the hero corners. Use them for status, counts and dates.
- **Edges:** bands meet through `src/components/site/lab/DitherEdge.tsx`, a 1-bit dissolve.
- **Buttons:** `LabButton` (`src/components/site/lab-hero/LabButton.tsx`) only, with square corners.

## Structure

- Sections are full-width bands (paper, emerald or ink) joined by dither edges, not boxes on a background.
- Section heads: an optional small mono line with real metadata (e.g. `PROJECTS · 15 · updated 20h ago`), then a plain display title. Vary the composition between sections.
- Each section shows at most one live thing from real data (`getWorkshop()` in `src/lib/workshop.ts`, `src/lib/github.ts`). No invented numbers. `prefers-reduced-motion` gets the final state. CLS 0.

## Pages (plain names; URLs unchanged)

| Route | Page | For |
|---|---|---|
| `/` | Home | Everyone: what ODS is, the projects, the people, how to start |
| `/projects` | Projects | Developers and founders: every project, its status, stars, contributors and activity |
| `/contributors` | Contributors | Everyone: the people who build ODS, with a spot left open for you |
| `/manifesto` | Manifesto | Everyone: what we believe and promise |
| `/contribute` | Contribute | Developers and creators: a step-by-step first contribution, roles for non-coders, code of conduct |
| `/word-of-mouth` | What people say | Founders and partners: press mentions, partners, events |
| footer | Footer | Links, socials, verify a certificate |
