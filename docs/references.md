# References for the home uplift

Studied 2026-11-10 with the Inspo archive (`recommend`, `search_screens`, `get_screen`, full-page captures, `get_reference_jsx`). We take **composition, rhythm and treatment** from these sites, never their look. Our materials stay the same: bone paper, cobalt ink, one highlighter, Mona Sans, Newsreader Italic and Geist Mono.

The problem these references answer: the home was clean but flat. Every section used the same eyebrow rail and big heading, the shelf was mostly a table, and only the dark bands had any atmosphere.

| # | Site | URL | What we take |
|---|---|---|---|
| 1 | **Cursor** | https://cursor.com | **The plate.** Every product screenshot is mounted on a textured, painted panel (a rounded "plate") instead of floating on the page, and the UI is cropped at the plate's bottom edge so it reads as a window into a working product. We use it as the **ink plate**: deep cobalt-to-ink, a soft top light, a fine fibre texture and a faint blueprint grid. All our captures are dark UIs, so on bone paper they need a ground of their own. Also from Cursor: a modest left-aligned headline and a visual that owns the lower two thirds of the fold. |
| 2 | **Linear** | https://linear.app | **The split section head.** The H2 sits in the left 7 columns, the dek and the section's link in the right 5, aligned to the H2's baseline. It replaces our one repeated rail on Work and Start. We also take the screenshot that bleeds past the container and is cropped at the bottom, and the hairline logo/number strip right under the hero. |
| 3 | **Stripe** | https://stripe.com | **The stat row and the bento.** Four or five real figures set at display size, separated by hairlines (`get_reference_jsx stat/row`), straight under the hero visual. Our numbers are live from GitHub. The product grid, where tiles of unequal span each carry a real image, became the project showcase (`features/bento`): the lead tool gets 7 columns and the others extend it. |
| 4 | **Works Studio** | https://works.studio | **Captions as a signature.** In the portfolio grid every image is captioned in two lines, the name in the sans and the role in an italic serif. That is our *signed work* idea exactly: the tool's name, then "signed by 3 builders" in Newsreader. We also borrow the irregular grid where imagery, not cards, carries the section. |
| 5 | **Teenage Engineering** | https://teenageengineering.com | **The product as an object, labelled like an instrument.** Tiny precise labels sit on the object itself (the URL strip on the plate, the mono build line under each tile). Imagery treated as the hero, not decoration. |
| 6 | **Atlassian Design** | https://atlassian.design | **Name tags orbiting the headline.** Small coloured lozenges with a pointer, each carrying a person's name, scattered around the hero. We turned these into the **hero's signature moment**: the real GitHub handles of OpenStock's builders appear as multiplayer cursors on the live screenshot, and one highlighter cursor reads "you". That's built in public and an open seat, in one picture. |
| 7 | **Resend** | https://resend.com | **Atmosphere in the dark band.** One diagonal light and a fine texture make a near-black band feel deep rather than flat. We give the bench band (Start) one cobalt light from the top edge and the same fibre texture as the plate. |
| 8 | Inspo `testimonial/cinematic` | (reference component) | **The quote with a credit roll.** One voice at display size, centred, with the attribution set as a film-credit row under a hairline. The lead quote on Word of mouth uses it, and the other two sit beneath in two columns. |

## What changed because of them

- **Hero:** the H1 keeps its words, and the highlighter now sweeps once across "anyone who shows up", because that clause is *you*. Below it the OpenStock capture sits on the ink plate, cropped at the bottom edge, with the real builders' cursors on it (Cursor, Atlassian, Linear).
- **Proof row:** stars, forks, builders, tools and the last commit as a hairline stat row under the plate (Stripe), live from GitHub.
- **Work:** a split head (Linear), then a showcase where each tool is mounted on a plate and captioned with a signature (Cursor, Stripe bento, Works). The full index follows under its own small heading.
- **People:** a centred head instead of the rail, so the wall reads as the section's single image.
- **Start:** a split head, with cobalt light and texture in the band (Resend).
- **Word of mouth:** the lead quote in a credit-roll layout, then two columns (cinematic reference).
- **Palette:** new `--plate-*` tokens and one `--grain` texture, used only on the plate and on dark bands. Every text pair still passes AA. The highlighter keeps its single meaning, "yours".

Rejected: Stripe's gradient ribbons and Raycast's red glow (decoration that names no one), Framer's portfolio wall (it would dress up a project count of 15 as a catalogue), and Linear's all-dark page (the brief's daylight paper *is* the "in public" idea).
