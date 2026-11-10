# ODS·LAB: the visual language

Open Dev Society presents itself as a **lab**. The home hero (`src/components/site/lab-hero/`) is the reference for everything: a live reaction–diffusion field (EXP-000, after Turing, 1952), 1-bit Bayer dither in logo teal, a condensed headline, small mono instrument plates, and square filled buttons. Every page is a **lab artefact**, not a restyled marketing page.

## Never

Split heroes (headline left, card right). Card grids with rounded shadows. Pill buttons. Dashboards of stat tiles. Gradient blobs. Emoji. Section after section with the same eyebrow-plus-heading template. Anything that reads as a SaaS template.

## Materials

- **Paper:** `--bg` off-white. **Ink:** `--fg` teal-black. **Teal:** `--accent-brand` #288488 for fields and dither, `--accent` #10777b for text, links and buttons. **Rose:** `--mark` #d03c5c, used only for "yours / you / vacant / new". `--mark-ink` for rose text. `--line` for hairlines. Tokens live in `src/app/globals.css`; never hard-code.
- **Type:**
  - Display: Mona Sans (`--font-sans`) at `font-stretch: 75%`, weight 800, tight leading, like the hero H1. Use it for page titles and big numbers only.
  - Body: Mona Sans at normal width, 16–18px, about 65ch.
  - Instrument text: Geist Mono (`--font-mono`), 12–13px, for labels, IDs, metadata and tables.
  - Newsreader Italic (`--font-sign`) is allowed only for a person's name or signature, sparingly.
- **Dither:** the signature texture. Images (project screenshots, avatars) are shown 1-bit or duotone dithered (teal on paper; rose for "you"), never as raw photos. Use one shared component, `src/components/site/lab/Dither.tsx` (ordered Bayer 4×4/8×8 at least; it may offer Atkinson). It must render a static frame on the server or first paint, with no layout shift, `prefers-reduced-motion` respected, and alt text kept.
- **Plates:** small mono labels on a `--bg` rectangle with a 1px `--line` hairline, as in the hero corners. Use them for IDs, status and measurements.
- **Buttons:** `LabButton` (`src/components/site/lab-hero/LabButton.tsx`): primary is solid teal, secondary is a paper plate with an ink hairline. Square corners. No other button styles.
- **Rules:** 1px `--line` hairlines and an occasional double rule. Grids are visible, as in a lab notebook or a specimen sheet.

## Structure

- **Section heads** are lab records, not eyebrow-plus-heading: a mono record line (`§02 · EXPERIMENTS · 15 records · updated 20h ago`), then a display title. Vary the composition between sections; don't repeat one template.
- **IDs:** experiments are `EXP-001…` in order of stars (OpenStock = EXP-001), researchers are `R-01…` in join order, the manifesto is `ODS-WP-001`, the contribution guide is `PROTOCOL 01`, and citations are `[1]…`. Keep the numbering in one place: `src/lib/lab.ts` (owned by the Experiments agent; others import from it).
- **Real data only:** `getWorkshop()` in `src/lib/workshop.ts` and `src/lib/github.ts`. No invented numbers.
- **Motion:** quiet. One meaningful motion per page at most, such as an image "developing" from coarse to fine dither, a field growing, or a counter ticking. `prefers-reduced-motion` gets the final state. CLS 0.

## Pages

| Route | Artefact | Core idea |
|---|---|---|
| `/` | Lab home | Hero EXP-000, then a short excerpt of each artefact below |
| `/projects` | **Experiments**, a lab log | Each tool is an experiment record (ID, status running/paused/archived from push recency, started, subjects = stars, researchers, language). Its dithered screenshot develops on hover. |
| `/contributors` | **Researchers**, a roster | ID badges with duotone-dithered GitHub avatars, R-numbers, joined date, experiments worked on. One rose vacant badge, "R-25 · you", links to Protocol 01. |
| `/manifesto` | **Working Paper ODS-WP-001** | Typeset as a preprint: paper number, version, date, authors (founders, signed), abstract, numbered sections, footnotes, references. |
| `/contribute` | **Protocol 01: First contribution** | A lab protocol: purpose, materials, procedure (the real fork → branch → PR steps, with copyable commands), expected results, safety notes (the code of conduct, keeping `id="values"` and `id="conduct"`), and FAQ as "troubleshooting". |
| `/word-of-mouth` | **Citations** | A bibliography of real mentions (`[1] Author. "quote". Source, year.`), filterable, plus partners as "Funding & acknowledgements" at `#partners` (keep `id="partner-cta"`). |
| footer | **Colophon** | Set in, printed with, lab address, links, verify a certificate. |
