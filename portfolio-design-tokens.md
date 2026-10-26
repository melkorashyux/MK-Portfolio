# Portfolio — Design Tokens

## Changelog

**2026-10-25 — Hero redesigned (light version).** Rebuild the hero from the Hero section below. What changed, with the previous values in case you need to roll back:

- Headline: "I design interfaces, and build them." in Title style (Fraunces 192/176, White) → "PRODUCT DESIGNER & BUILDER" in Geist Bold 208/175/-6%, with "PRODUCT" in red.
- Button: orange pill "Let's Connect" (`#FB5607`, radius 152, in the auto-layout flow) → red rectangle "Contact" (`#CC0000`, radius 0), absolutely positioned over the headline's third line.
- Removed: the "Cairo (GMT +2)" clock line. Hero frame gap 96 → 16, hero height 754 → 614.
- Accent color: `#FB5607` → `#CC0000`. New dark text color `#171717`.
- Visibly changed but not re-captured: page background (now light), nav/logo colors, a dotted red "MK" graphic behind the headline. See "Still missing" in the Hero section.

**2026-10-25 — Work section redesigned as "Selected Work" (light version).** Rebuild it from the Selected Work section below. What changed, with the previous values:

- Heading: "Work" in Title style (Fraunces 192/176, White) → "Selected Work" in Geist Bold 132/176/-6%, `#171717`, fixed 129px tall.
- Cards: titles and descriptions went from White to `#171717`, and each card gained a "View Project ↗" link (H3, `#CC0000`, underlined). Card height 489 → 536 and section height 761 stays 761 only because the heading box shrank (176 → 129).
- Image placeholders: 628 × 405 → 627.5 × 405 (content width is now 1296, not 1297).

**2026-10-25 — Timeline redesigned (light version).** Rebuild it from the Timeline section below. What changed, with the previous values:

- Heading: "Timeline" in Title style (Fraunces 192/176, White) → Geist Bold 132/176/-6%, `#171717`.
- Years: Sub Title style (Fraunces 120/126, Neutral Grey) → Geist Light 120/126/-3%, Neutral Grey.
- Descriptions: White → `#171717` (same Geist Bold 32, -4%). Dividers: Dark Grey → Light Gray.
- 2026 copy: "...my own local-first design tool." → "...my own local-first inspiration library tool."
- Position: Y2022 → Y1887. Height unchanged at 1936.

**2026-10-25 — About Me redesigned (light version) and a closing CTA added.** Rebuild it from the About Me and Contact CTA sections below. What changed, with the previous values:

- Heading: Title style (Fraunces 192/176, White) → Geist Bold 132/176/-6%, `#171717` (inferred; the heading wasn't selected).
- Body text: H4 (Geist Regular 20, -3%, White) → Geist Regular 20 with -1% letter spacing, `#171717`. "Design Engineer" and "Other Interests:" stay Extra Bold.
- Picture: the "Picture of me" placeholder stays (405 × 405 here). It was missing from the latest screenshots and is being added back.
- Heights: content row 534/572 → 638, section 806/844 → 910. Position Y4214 → Y4079.
- Copy: paragraphs 3 and 4 were reworded, and paragraph 4 now names the company: Reliant Technologies.
- Added: the closing CTA "Ready for Designing? / m.elkorashy@gmail.com".

Extracted from the Figma "Text styles" panel for the **Portfolio** project.

| Style     | Font     | Style / Weight                                              | Size  | Line Height | Letter Spacing |
|-----------|----------|---------------------------------------------------------------|-------|-------------|-----------------|
| Title     | Fraunces | Weight 600 · Soft 0 · Wonk 0 · Optical size 144 (auto)         | 192px | 176px       | -3%             |
| Sub Title | Fraunces | Weight 600 · Soft 0 · Wonk 0 · Optical size 144 (auto)         | 120px | 126px       | -3%             |
| H1        | Fraunces | Weight 600 · Soft 0 · Wonk 0 · Optical size 144 (auto)         | 72px  | 126px       | -3%             |
| H2        | Geist    | Bold                                                          | 32px  | Auto        | -4%             |
| H3        | Geist    | Bold                                                          | 24px  | Auto        | -4%             |
| H4        | Geist    | Regular                                                       | 20px  | Auto        | -3%             |
| H5        | Geist    | Regular                                                       | 16px  | Auto        | -3%             |
| H6        | Geist    | Regular                                                       | 14px  | Auto        | -3%             |

## Notes

- **Fraunces variable-font axes** (Title, Sub Title, H1): `Weight 600`, `Soft 0`, `Wonk 0`. "Optical size" is set to **automatic**, meaning it tracks the rendered font size rather than a fixed number — Figma currently shows it resolving to **144** for all three styles. That's because Fraunces' optical-size (`opsz`) axis tops out at 144, and all three sizes (192px, 120px, 72px) are large enough to hit that ceiling. In practice you can treat 144 as "maxed out," not a fixed value you need to hardcode per style.
- **"Auto" line height** (H2–H6) means Figma derives it from the font's own metrics rather than a fixed pixel value. If you need an exact px number for CSS, check the computed value in Figma's Inspect panel or set a fixed line height yourself.
- **Several light-version type styles aren't saved as text styles yet** (all unlinked in Figma): hero headline Geist Bold 208/175/-6%; section headings Geist Bold 132/176/-6%; timeline years Geist Light 120/126/-3%; closing CTA Geist SemiBold 120/126/-5%; About body Geist Regular 20/Auto/-1%. See each section.
- **Letter spacing** is stored as a percentage of font size in Figma. Converted to `em` for CSS below (e.g. `-3%` → `-0.03em`).

## CSS custom properties (ready to drop into code)

```css
:root {
  /* Title */
  --font-title-family: "Fraunces", serif;
  --font-title-weight: 600;
  --font-title-size: 192px;
  --font-title-line-height: 176px;
  --font-title-letter-spacing: -0.03em;
  --font-title-variation: "SOFT" 0, "WONK" 0;

  /* Sub Title */
  --font-subtitle-family: "Fraunces", serif;
  --font-subtitle-weight: 600;
  --font-subtitle-size: 120px;
  --font-subtitle-line-height: 126px;
  --font-subtitle-letter-spacing: -0.03em;
  --font-subtitle-variation: "SOFT" 0, "WONK" 0;

  /* H1 */
  --font-h1-family: "Fraunces", serif;
  --font-h1-weight: 600;
  --font-h1-size: 72px;
  --font-h1-line-height: 126px;
  --font-h1-letter-spacing: -0.03em;
  --font-h1-variation: "SOFT" 0, "WONK" 0;

  /* H2 */
  --font-h2-family: "Geist", sans-serif;
  --font-h2-weight: 700;
  --font-h2-size: 32px;
  --font-h2-line-height: normal;
  --font-h2-letter-spacing: -0.04em;

  /* H3 */
  --font-h3-family: "Geist", sans-serif;
  --font-h3-weight: 700;
  --font-h3-size: 24px;
  --font-h3-line-height: normal;
  --font-h3-letter-spacing: -0.04em;

  /* H4 */
  --font-h4-family: "Geist", sans-serif;
  --font-h4-weight: 400;
  --font-h4-size: 20px;
  --font-h4-line-height: normal;
  --font-h4-letter-spacing: -0.03em;

  /* H5 */
  --font-h5-family: "Geist", sans-serif;
  --font-h5-weight: 400;
  --font-h5-size: 16px;
  --font-h5-line-height: normal;
  --font-h5-letter-spacing: -0.03em;

  /* H6 */
  --font-h6-family: "Geist", sans-serif;
  --font-h6-weight: 400;
  --font-h6-size: 14px;
  --font-h6-line-height: normal;
  --font-h6-letter-spacing: -0.03em;
}

/* Apply to Fraunces-based styles (Title, Sub Title, H1) */
.font-title,
.font-subtitle,
.font-h1 {
  font-optical-sizing: auto; /* mirrors Figma's "Set optical size automatically" */
  font-variation-settings: var(--font-title-variation); /* swap per style */
}
```

## Colors

| Name         | Hex       | RGB               |
|--------------|-----------|--------------------|
| White        | `#F2F2F7` | 242, 242, 247      |
| Background   | `#252525` | 37, 37, 37         |
| Dark Grey    | `#4E4E4E` | 78, 78, 78         |
| Neutral Grey | `#A3A3A3` | 163, 163, 163      |
| Light Gray   | `#D1D1D6` | 209, 209, 214      |
| Accent       | `#CC0000` | 204, 0, 0          |
| Ink *(name TBD)* | `#171717` | 23, 23, 23     |

### CSS custom properties

```css
:root {
  --color-white: #F2F2F7;
  --color-background: #252525;
  --color-dark-grey: #4E4E4E;
  --color-neutral-grey: #A3A3A3;
  --color-light-gray: #D1D1D6;
  --color-accent: #CC0000;
  --color-ink: #171717; /* placeholder name; rename to match the Figma variable */
}
```

- **Accent changed** from orange `#FB5607` (retired; it was only used by the old "Let's Connect" button) to red `#CC0000`, the current main accent.
- **Not bound to variables yet.** In the latest hero screenshots `CC0000`, `171717` and `D1D1D6` show as raw hex in Figma's panel instead of variable names. `D1D1D6` matches Light Gray exactly. Update the Accent variable to `CC0000` and add `171717` as a variable so there is one source of truth.
- **Light page background** in the new hero isn't captured yet.

## Layout Grids

Figma layout guides used across the Portfolio project.

| Grid           | Columns | Type    | Width | Margin | Gutter |
|----------------|---------|---------|-------|--------|--------|
| 12-Column Grid | 12      | Stretch | Auto  | 72px   | 16px   |
| 3-Column Grid  | 3       | Stretch | Auto  | 72px   | 40px   |

> Guide colors (`#B700FF` @ 5%, `#FF0004` @ 10%) are just Figma's on-canvas overlay tint for visualizing the grid — not part of the rendered design, so not included in the CSS below.

> **Usage note (inferred):** the Timeline section's row split — 405px year column + 40px gap + 851px description — lands exactly on the 3-column grid (≈405.67px columns, 40px gutter). So the 3-column grid is applied on the desktop frame alongside the 12-column one, not necessarily a separate mobile grid. The About section repeats the same split (851px text / 40px gap / 405px picture).

### CSS custom properties

```css
:root {
  /* 12-column grid */
  --grid-12-columns: 12;
  --grid-12-margin: 72px;
  --grid-12-gutter: 16px;

  /* 3-column grid */
  --grid-3-columns: 3;
  --grid-3-margin: 72px;
  --grid-3-gutter: 40px;
}
```

## Components — Hero Section

Current version: light theme, "Product Designer & Builder". The earlier dark version (Title-style headline, orange pill, Cairo clock) is recorded in the Changelog.

### Structure & spacing

```
Hero Content (frame)                       — Auto layout, vertical, gap 16px, padding 0, 1296 Fill × 614 Hug
 ├─ Eyebrow — "Mostafa Elkorashy"          — 1296 Fill × 31 Hug (carried over, not re-selected)
 ├─ Headline — "PRODUCT / DESIGNER & /
 │   BUILDER"                              — Geist Bold 208 / 175 / -6%, 1296 Fill × 525 Hug, at Y47
 ├─ Subtext — "A UI/UX Designer..."        — 1296 Fill × 26 Hug (derived)
 └─ Contact button                         — absolutely positioned: X891, Y495, 405 × 63 (see below)
```

Arithmetic check:

- Hero height: `31 + 16 + 525 + 16 + 26 = 614` ✓ (the button is not in this sum because it sits outside the auto-layout flow)
- Headline Y: `47 = 31 + 16` ✓ (this confirms the eyebrow height and the 16px gap)
- Headline height: `3 lines × 175 = 525` ✓
- Content width: `1296 = 1440 − 2 × 72` ✓ (exactly the grid's content width; earlier sections show 1297, a 1px rounding difference)

### Elements

| Element | Text style | Fill | Box (W × H) |
|---|---|---|---|
| Headline | Geist Bold 208, line height 175, letter spacing -6%, left / top aligned (not linked to a text style) | Mixed: "PRODUCT" `#CC0000`; "DESIGNER &" and "BUILDER" `#171717` | 1296 Fill × 525 Hug |
| Eyebrow ("Mostafa Elkorashy") | H3 *(carried over)* | `#171717` *(inferred, see note)* | 1296 Fill × 31 Hug |
| Subtext ("A UI/UX Designer...") | H4 *(carried over)* | `#171717` *(inferred)* | 1296 Fill × 26 Hug |
| Logo ("MK") | — (vector mark) | dark in the screenshot, fill not re-selected | 51.96 × 34.91 |
| Nav links | H4 *(carried over)*, now visibly bolder | dark in the screenshot, not re-selected | see nav section below |

The hero frame's selection colors list only `171717`, `CC0000` and `D1D1D6`. `D1D1D6` is the Contact label, so the eyebrow and subtext must be `171717`.

### Headline

Three lines at 175px line height: "PRODUCT" (red), "DESIGNER &" and "BUILDER" (dark). It renders in all caps; it isn't clear whether the text is typed in caps or uses an uppercase transform. At 1296px wide the lines wrap naturally, but use explicit line breaks if you need exactly three lines at other widths.

### Button — "Contact"

| Property | Value |
|---|---|
| Position | X891, Y495 inside the hero frame. It appears absolutely positioned: the "ignore auto layout" toggle is highlighted and the frame height adds up without it |
| Size | 405 Fixed × 63 Hug |
| Alignment | `891 + 405 = 1296`, so it is flush with the right edge of the content area. X891 is the start of the third column on the 3-column grid (`851 + 40`) |
| Vertical | Y495 to 558: it sits in the headline's third line band (397 to 572), to the right of "BUILDER", 14px above the headline's bottom edge |
| Auto layout | Horizontal, gap 10, padding 72 horizontal / 16 vertical |
| Corner radius | 0 (rectangular; previously a full pill) |
| Fill | `#CC0000` (the Accent; shown as raw hex in Figma) |
| Label | "Contact", Geist Bold 24, line height Auto, letter spacing -4%, fill `#D1D1D6`, 89 Hug × 31 Hug, appears underlined (the panel doesn't show it) |

Label arithmetic: the label sits at X158, Y16. `(405 − 89) / 2 = 158` ✓ (centered), and `31 + 2 × 16 = 63` ✓. The 72px horizontal padding no longer drives the width: `89 + 144 = 233`, which is less than 405, so the width is fixed at one grid column.

The label's values match H3 exactly but aren't linked to it, the same situation as the Timeline description and H2.

### CSS

```css
.hero {
  position: relative; /* anchors the absolutely positioned button */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-headline {
  font-family: "Geist", sans-serif;
  font-weight: 700;
  font-size: 208px;
  line-height: 175px;
  letter-spacing: -0.06em;
  text-transform: uppercase; /* assumed: renders all caps; confirm whether typed in caps */
  color: var(--color-ink);
}

.hero-headline .accent {
  color: var(--color-accent); /* "PRODUCT" */
}

.hero-button {
  position: absolute;
  top: 495px;
  right: 0; /* = left: 891px at the 1296px content width */
  width: 405px; /* one column of the 3-column grid */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 72px;
  background: var(--color-accent);
  border-radius: 0;
  color: var(--color-light-gray);
  /* label: Geist Bold 24px, line-height normal, letter-spacing -0.04em */
  text-decoration: underline; /* appears underlined in Figma */
}
```

### Notes

- **Headline isn't a text style.** Raw Geist Bold 208/175/-6% in Figma. Worth saving as a style (for example "Display") so it can't drift.
- **Fixed pixel positions.** The button's top of 495px assumes the headline wraps to three lines at 175px each. If the headline wraps differently, the button needs re-anchoring (for example to the headline's last line).

### Header / Nav row

| Property | Value |
|---|---|
| Layout | Auto layout, horizontal, **space-between** alignment (Figma shows this as `Gap: Auto` — logo pinned left, nav group pinned right, no fixed gap between them) |
| Size | 1296 × 34.91 Hug |
| Padding | 0 |
| Fill / Stroke | None |
| Position | X 72, Y 33 *(relative to its parent — see page padding below)* |

**Page structure.** The outermost frame ("MK Designs landingpage") is a fixed 1440 × 6892 canvas with `Clip content` on — it doesn't expose split Padding fields the way the inner Auto Layout frames do. Instead it shows a single **Spacing: 102px**. I originally read that as the gap between top-level sections, but the measured gap between the Hero and Work sections is **256px**, so 102 is *not* the section gap — treat it as unexplained and ignore it. The real section gap is documented under the Work section below.

That means the header's X72/Y33 isn't coming from a page-level `padding` property — there isn't one at this level. It's the header simply positioned to align with the grid's 72px margin (manually, or via grid snapping). Treat 72px as "content aligns to the grid margin here," not as a padding value to copy onto a page wrapper.

```css
:root {
  --page-width: 1440px;
  --section-gap: 256px; /* confirmed in the light version: Hero → Selected Work (870 = 614 + 256), Selected Work → Timeline (1887 = 870 + 761 + 256), Timeline → About (4079 = 1887 + 1936 + 256) */
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### Nav links sub-group

| Property | Value |
|---|---|
| Layout | Auto layout, horizontal, gap **16px**, padding 0 |
| Size | 421 × 26 Hug |
| Position | X 875, Y 0 *(relative to the header row — `1296 − 421 = 875`, confirming it's pinned to the right edge via the header's space-between alignment)* |
| Fill / Stroke | None |
| Items | Work, Timeline, About, Contact — each its own H4 text layer. In the dark version the fill was White; in the light version they appear dark and bolder, not re-selected |

```css
.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
}
```

### Still missing

- **Page background** for the light version: select the top frame ("MK Designs landingpage") and read its Fill. The `#222222` seen in the Figma page panel is the canvas color, not the design. Selected Work, Timeline and About below are now light too.
- **Dotted red "MK" graphic** behind the headline: not captured (select its layer for fill, size and position). Its bottom edge reaches into the 256px gap below the hero (visible at the top of the Selected Work screenshots).
- **Eyebrow, subtext, nav links and logo** weren't re-selected in the light version (colors and weights are inferred from the screenshot).
- **Contact button states** (hover, focus) and whether the underline is a text decoration.

## Components — Selected Work Section

Current version: light theme. The earlier dark "Work" version is recorded in the Changelog.

### Section spacing

The gap between the hero and this section is **256px**. Cross-check: the section sits at Y870 and the hero is 614 tall, so `870 − 614 = 256` ✓ (assuming the hero frame is at Y0 in the same parent, which is what its panel shows).

### Structure & spacing

```
Selected Work (section frame)              — Auto layout, vertical, gap 96px, padding 0, 1296 Fill × 761 Fixed, at Y870
 ├─ Heading — "Selected Work"              — Geist Bold 132 / 176 / -6%, 1296 Fill × 129 Fixed
 └─ Cards row                              — Auto layout, horizontal, gap 41px, padding 0, 1296 Fill × 536 Hug, at Y225
     ├─ Card — "Visual Brain"              — Auto layout, vertical, gap 16px, padding 0, 627.5 Fill × 536 Hug
     │   ├─ Image                          — 627.5 Fill × 405, fill #D9D9D9 (placeholder)
     │   └─ Text group                     — Auto layout, vertical, gap 16px, padding 0, 627.5 Fill × 115 Hug, at Y421
     │       ├─ Info group                 — Auto layout, vertical, gap 8px, padding 0, 627.5 Fill × 68 Hug
     │       │   ├─ Title                  — 627.5 Fill × 42 Hug (carried over)
     │       │   └─ Description            — 627.5 Fill × 18 Hug (carried over)
     │       └─ Link — "View Project ↗"    — 627.5 Fill × 31 Hug, at Y84
     └─ Card — "Website Builder"           — same structure (assumed identical; only the first card was selected)
```

Arithmetic check:

- Section height: `129 + 96 + 536 = 761` ✓ (the cards row sits at Y225 = `129 + 96`)
- Cards row width: `627.5 + 41 + 627.5 = 1296` ✓
- Card height: `405 + 16 + 115 = 536` ✓ (image height is derived: the text group sits at Y421 = `405 + 16`)
- Text group height: `68 + 16 + 31 = 115` ✓ (the link sits at Y84 = `68 + 16`)
- Info group height: `42 + 8 + 18 = 68` ✓ (the title and description heights are carried over from the dark version, and still add up)

### Elements

| Element | Text style | Fill | Box (W × H) |
|---|---|---|---|
| Heading ("Selected Work") | Geist Bold 132, line height 176, letter spacing -6%, left aligned, vertically centered, fixed size (not linked to a text style) | `#171717` | 1296 Fill × 129 Fixed |
| Card title | H2 *(carried over)* | `#171717` | 627.5 Fill × 42 Hug |
| Card description | H6 *(carried over)* | `#171717` | 627.5 Fill × 18 Hug |
| "View Project ↗" link | H3 (the panel shows `H3 · 24/Auto(3)`; I can't tell what the "(3)" means), appears underlined, ends with a ↗ arrow | `#CC0000` (the Accent, raw hex in Figma) | 627.5 Fill × 31 Hug |
| Image placeholder | — | `#D9D9D9` | 627.5 Fill × 405 |

The title and description fills are `#171717` by elimination: the selection colors for their group list only `171717`. Both cards currently show the same description ("A local-first inspiration library I designed and built."), probably placeholder copy for the second one.

### CSS

```css
.selected-work {
  display: flex;
  flex-direction: column;
  gap: 96px;
  /* Figma has a fixed 761px height; use auto so it follows the content */
}

.selected-work-heading {
  height: 129px;
  display: flex;
  align-items: center; /* the 176px line box overflows the 129px box equally above and below, as in Figma */
  font-family: "Geist", sans-serif;
  font-weight: 700;
  font-size: 132px;
  line-height: 176px;
  letter-spacing: -0.06em;
  color: var(--color-ink);
}

.selected-work-cards {
  display: flex;
  gap: 41px;
}

.work-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.work-card-image {
  height: 405px;
  background: #D9D9D9; /* placeholder until real project images */
}

.work-card-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.work-card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--color-ink);
  /* title: H2 values; description: H6 values */
}

.work-card-link {
  color: var(--color-accent);
  text-decoration: underline; /* appears underlined in Figma */
  /* H3 values: Geist Bold 24px, line-height normal, letter-spacing -0.04em */
}
```

### Notes

- **Heading box.** The heading is a fixed 129px box with a 176px line height, centered vertically, the same overflow trick as the Timeline year row. It also shares the hero headline's -6% letter spacing, so the two could be saved as text styles (hero: 208/175, this one: 132/176).
- **Fixed section height.** Figma shows 761 Fixed for the section instead of Hug. It matches the content today, but it will clip or overflow if the content changes; Hug is probably what's intended.
- **Frame name.** The section frame is named "Container (Frame 24)" in Figma; renaming it (for example "Selected Work") will make the structure clearer for whoever builds from it.
- **41px card gap.** Same as before: it lets the two Fill-width cards share the row, and each card is 627.5 at the 1296px content width.
- **Placeholders.** `#D9D9D9` is Figma's default rectangle grey, not part of the palette; it stands in for real project images.

### Still missing

- **Card and link states** (hover, focus, whether the whole card or only the link is clickable): not designed yet.
- **Second card.** Only the first card was selected; the second is assumed identical.
- **Link arrow.** It isn't clear whether "↗" is a text character or an icon.

## Components — Timeline Section

Current version: light theme. The earlier dark version is recorded in the Changelog.

### Section spacing

The gap between Selected Work and Timeline is **256px**. Cross-check: Selected Work sits at Y870 and is 761 tall (ends at 1631), and Timeline sits at Y1887; `1887 − 1631 = 256` ✓.

### Structure & spacing

```
Timeline (section frame)                 — Auto layout, vertical, gap 96px, padding 0, 1296 Fill × 1936 Hug, at Y1887
 ├─ Heading — "Timeline"                 — Geist Bold 132 / 176 / -6%, 1296 Fill × 176 Fixed
 └─ List                                 — Auto layout, vertical, gap 72px, padding 0, 1664 Hug (carried over; confirmed by the arithmetic below)
     ├─ Row (one per year, 7 rows)       — Auto layout, vertical, gap 72px, padding 0, children right-aligned, 1296 Fill × 154 Hug
     │   ├─ Content row                  — Auto layout, horizontal, gap 40px, padding 0, items vertically centered, 1296 Fill × 82 Fixed
     │   │   ├─ Year                     — Geist Light 120 / 126 / -3%, Neutral Grey, 405 Fixed × 126 Hug
     │   │   └─ Description              — Geist Bold 32 / Auto / -4%, #171717, 851 × 84 Fixed
     │   └─ Divider                      — stroke Light Gray (size and weight carried over: 851 × 0, 1px, centered)
     └─ Last row (2026)                  — 1296 Fill × 82 Hug, content row only, no divider
```

Arithmetic check:

- Section height: `176 + 96 + 1664 = 1936` ✓
- Row height: `82 + 72 + 0 = 154` ✓
- Content row width: `405 + 40 + 851 = 1296` ✓
- List height: `7 × 154 + 82 + 7 × 72 = 1664` ✓, and the 2026 row sits at Y1582 = `7 × (154 + 72)` ✓. The last row is a plain 82px content row, which confirms it has no divider
- Description at X445 = `405 + 40` ✓, Y−1 = `(82 − 84) / 2` ✓; year at Y−22 = `(82 − 126) / 2` ✓

### Elements

| Element | Text style | Fill / Stroke | Box (W × H) |
|---|---|---|---|
| Heading ("Timeline") | Geist Bold 132, line height 176, letter spacing -6%, left / top aligned, fixed size (not linked to a text style) | `#171717` | 1296 Fill × 176 Fixed |
| Year | Geist Light 120, line height 126, letter spacing -3% (not linked; same size, line height and spacing as Sub Title, but Geist Light instead of Fraunces) | Neutral Grey | 405 Fixed × 126 Hug |
| Description | Geist Bold 32, line height Auto, letter spacing -4% (same values as H2, deliberately not linked) | `#171717` | 851 × 84 Fixed |
| Divider | — | Stroke: Light Gray (a variable) | 851 × 0, right-aligned under the description column |

The divider's color comes from the row's selection colors: the only color in a row that isn't the year (Neutral Grey) or the description (`#171717`) is Light Gray. Its weight and size weren't re-selected, so they're carried over from the dark version.

### Content

| Year | Description |
|---|---|
| 2017 | Started at the Faculty of Applied Arts, majoring in Graphic Design. |
| 2019 | Started my career as a Freelance Logo Designer. |
| 2020 | Moved into UI/UX Design. |
| 2021 | Freelance UI/UX (Projects and Part-time) across multiple Clients, and the first Fulltime job. |
| 2022 | Joined Ynmo as a Fulltime Product Designer; graduated the same year. |
| 2023 | Mandatory Army Service. |
| 2024 | Rejoined Ynmo as a Product Designer. |
| 2026 | Started coding; designed and built Visual Brain, my own local-first inspiration library tool. |

The 2021 row follows the wording you asked for in this doc; the Figma screenshots still show the earlier wording ("...across multiple Clients.").

### CSS

```css
.timeline {
  display: flex;
  flex-direction: column;
  gap: 96px;
}

.timeline-heading {
  height: 176px;
  font-family: "Geist", sans-serif;
  font-weight: 700;
  font-size: 132px;
  line-height: 176px;
  letter-spacing: -0.06em;
  color: var(--color-ink);
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 72px;
}

.timeline-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* right-aligns the divider under the description column */
  gap: 72px;
}

.timeline-row-content {
  align-self: stretch;
  display: flex;
  align-items: center; /* the 126px year overflows the fixed 82px row equally above and below */
  gap: 40px;
  height: 82px;
}

.timeline-year {
  flex: 0 0 405px;
  font-family: "Geist", sans-serif;
  font-weight: 300; /* Light */
  font-size: 120px;
  line-height: 126px;
  letter-spacing: -0.03em;
  color: var(--color-neutral-grey);
}

.timeline-description {
  flex: 0 0 851px;
  color: var(--color-ink);
  /* Geist Bold 32px, line-height normal, letter-spacing -0.04em (H2 values). Detached from H2 in Figma on purpose; verify its first line top-aligns with the year numerals. */
}

.timeline-divider {
  width: 851px;
  height: 0;
  border-top: 1px solid var(--color-light-gray); /* adds 1px to layout; Figma's 0-height line adds none */
}

.timeline-row:last-child .timeline-divider {
  display: none;
}
```

### Notes

- **Heading.** Same type values as the Selected Work heading (Geist Bold 132 / 176 / -6%, `#171717`), but the box is different: this one is a 176px fixed box, top aligned, so the text doesn't overflow; the Selected Work heading is a 129px box, vertically centered. If you want them to behave identically, one of them needs changing, and the distance from heading text to content will differ by about 23px until then.
- **Year.** Now Geist Light instead of the Fraunces Sub Title. It isn't a saved style, so consider saving it (for example "Year").
- **Fixed row height.** The content row is a fixed 82px while the year text is 126px tall and the description is 84px, so both are vertically centered and overflow their row (year by 22px above and below, description by 1px). `align-items: center` on a fixed-height flex row reproduces that.
- **Grid alignment.** The 405 / 40 / 851 split matches the 3-column grid: the year takes one column, the description takes the other two. The divider spans only the description column.
- **Description style.** The description's values are identical to H2, but the text is deliberately **not** linked to the H2 style in Figma: linking it breaks the top alignment with the year (cause not identified). In code, use H2's values, but treat the visual alignment as the requirement: the first line of the description should sit level with the top of the year numerals. If the browser render is off, nudge the description (a small `margin-top` or `transform`) rather than changing its type values.
- **Divider contrast.** Light Gray (`#D1D1D6`) is very close to the light page background, so the dividers are barely visible in the screenshots. That may be intentional.

### Still missing

- **Divider layer** wasn't selected in the light version (stroke weight and position are carried over).

## Components — About Me Section

Current version: light theme. The earlier dark version is recorded in the Changelog.

### Section spacing

The gap between Timeline and About Me is **256px**. Cross-check: Timeline sits at Y1887 and is 1936 tall (ends at 3823), and About Me sits at Y4079; `4079 − 3823 = 256` ✓.

### Structure & spacing

```
About Me (section frame)                 — Auto layout, vertical, gap 96px, padding 0, 1296 Fill × 910 Hug, at Y4079
 ├─ Heading — "About Me"                 — Geist Bold 132 / 176 / -6%, 1296 Fill × 176 (derived; style inferred, see notes)
 └─ Content row                          — Auto layout, horizontal, gap 40px, padding 0, 1296 Fill × 638 Hug, at Y272
     ├─ Body text                        — Geist Regular 20 / Auto / -1%, #171717, 851 Fixed × 638 Hug
     └─ Picture placeholder              — 405 Fill × 405, #D9D9D9, radius 0 (carried over from the dark version, not re-selected)
```

Arithmetic check:

- Section height: `176 + 96 + 638 = 910` ✓ (the heading height is derived from this; the content row sits at Y272 = `176 + 96`)
- Body text: 25 lines (20 text lines and 5 blank lines) in 638px, which is about 25.5px per line
- Row width: `851 + 40 + 405 = 1296` ✓ (the picture width is derived; the dark version showed 406 at a 1297 content width). The text is taller than the picture (638 vs 405), so the row height follows the text

### Elements

| Element | Text style | Fill | Box (W × H) |
|---|---|---|---|
| Heading ("About Me") | Geist Bold 132 / 176 / -6% *(inferred: it matches the Timeline and Selected Work headings and the section height adds up with 176)* | `#171717` | 1296 Fill × 176 *(derived)* |
| Body text | Geist Regular 20, line height Auto, letter spacing **-1%** (not linked to a text style; H4 is -3%), left / top aligned | `#171717` | 851 Fixed × 638 Hug |
| "Design Engineer" | Geist **Extra Bold** (800) 20, same line height and spacing | `#171717` | inline |
| "Other Interests:" | Geist **Extra Bold** (800) 20 (not selected individually) | `#171717` | inline |
| Picture placeholder | — (centered "Picture of me" label) | `#D9D9D9` | 405 Fill × 405, corner radius 0 *(carried over from the dark version, where it was 406 × 405; not re-selected in the light version)* |

The text is `#171717` (the only color in the section while the picture was removed). The content row's alignment grid read as vertically centered in the screenshots without the picture; with the picture back, top alignment is assumed, as in the dark version, so re-check it.

### Content

The text is one text node; paragraphs are separated by blank lines, and "Other Interests:" and the line below it are one paragraph with a line break.

> I've been obsessed with technology for as long as I can remember. Nokia phones and Windows XP were sort of my childhood, then came gaming; MMORPGs in particular where I actually learned a lot of my English, which did help me later in career.
>
> That obsession followed me to High school when I was aiming for CS degree but life pointed me to Applied Arts instead, where I got to be a Graphic Designer and handle computers in different ways.
>
> I started as a generalist, learning the fundamentals across every corner of design. Then in 2020 with the lockdown I got interested in User Interface design with my background in Graphic design I thought it would be an easy approach but it was just the start of something much bigger and more challenging.
>
> But that's when the English I learned from gaming actually was useful because in 2021 I started my first Fulltime job as a UI/UX Designer for a company called Reliant Technologies in New Jersey, USA, and found out that the remote working lifestyle can work, and have been a remote worker ever since.
>
> Now it's 2026 and I think we've reached the age of the **Design Engineer**. Design and production shouldn't be two different species. When a designer steps into the front-end, writing the HTML and CSS themselves, every pixel lines up on both sides of the handoff. That's the gap I want to close.
>
> **Other Interests:**
> Cars · Motorcycles · Gaming · Lifting · Photography

Bold in the quote above = Geist Extra Bold (800); the rest is Regular. Figma still has a blank company name in paragraph 4 ("called  in New Jersey") and shows "Design Engineer" as Bold; update both there to match this doc.

### CSS

```css
.about {
  display: flex;
  flex-direction: column;
  gap: 96px;
}

.about-heading {
  /* same as .timeline-heading */
  height: 176px;
  font-family: "Geist", sans-serif;
  font-weight: 700;
  font-size: 132px;
  line-height: 176px;
  letter-spacing: -0.06em;
  color: var(--color-ink);
}

.about-content {
  display: flex;
  align-items: flex-start; /* assumed top, as in the dark version */
  gap: 40px;
}

.about-text {
  flex: 0 0 851px;
  font-family: "Geist", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: normal; /* Figma "Auto" */
  letter-spacing: -0.01em;
  color: var(--color-ink);
}

.about-text p {
  margin: 0;
}

.about-text p + p {
  margin-top: 1lh; /* one blank line, as in the single Figma text node */
}

.about-text strong {
  font-weight: 800; /* Extra Bold: "Design Engineer" and "Other Interests:" */
}

.about-picture {
  flex: 1;
  height: 405px;
  background: #D9D9D9; /* placeholder until the real photo */
}
```

### Notes

- **Picture is back.** The "Picture of me" placeholder returns with its dark-version values (`#D9D9D9`, radius 0, centered label). Select it in the light version to confirm its fill and size.
- **Letter spacing.** The body stays at -1% for readability, so it isn't H4 (-3%); treat the raw values as the spec.
- **Emphasis weight.** Decided: Extra Bold (800) for "Design Engineer" and "Other Interests:". Figma currently shows Bold for "Design Engineer".
- **Heading.** The heading wasn't selected, so its style is inferred from its look and the 176px height.

### Still missing

- **Picture placeholder** selected in the light version (fill, size, radius, label).
- **Heading selection** to confirm its style.

## Components — Contact CTA

A closing call to action below the About section: two lines of large text. The nav's "Contact" item and the hero's Contact button presumably point here.

### Structure & spacing

```
Contact CTA (not selected as a group)    — two text layers, 1296 wide, 268 tall together
 ├─ "Ready for Designing?"                — Geist SemiBold 120 / 126 / -5%, #171717, 1296 Fixed × 126 Hug
 └─ "m.elkorashy@gmail.com"              — same style, 1296 Fixed × 126 Hug
```

Arithmetic: `268 = 126 + 16 + 126`, so the two lines are 16px apart (derived; the frame holding them wasn't selected). The gap between About Me (ends at Y4989) and this block looks like about 256px in the screenshots, but I didn't measure it.

### Elements

| Element | Text style | Fill | Box (W × H) |
|---|---|---|---|
| "Ready for Designing?" | Geist SemiBold 120, line height 126, letter spacing -5%, left / top aligned, auto height (not linked to a text style) | `#171717` | 1296 Fixed × 126 Hug |
| Email | same | `#171717` | 1296 Fixed × 126 Hug |

### CSS

```css
.contact-cta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: "Geist", sans-serif;
  font-weight: 600; /* SemiBold */
  font-size: 120px;
  line-height: 126px;
  letter-spacing: -0.05em;
  color: var(--color-ink);
}

.contact-cta a {
  color: inherit; /* assumed: the email is a mailto link; not designed yet */
}
```

### Notes (kept as designed for now)

Both points below are known and accepted for now; revisit later.

- **Width.** The email is roughly 1270px wide at 120px (estimated from the screenshot) inside a 1296px column, so there is almost no room to spare, and a fallback font could make it wrap. It will need to scale down at narrower widths.
- **Bottom edge.** In the screenshot the text runs to the bottom edge of the page frame, with no visible bottom padding.

### Still missing

- The frame or group holding the two lines, and the exact gap from About Me.
- Whether the email is a link, and its hover and focus states.
- The page frame's final height and bottom padding.
