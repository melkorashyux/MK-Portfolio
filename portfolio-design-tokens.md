# Portfolio — Design Tokens

## Changelog

**2026-11-05 — Case study spacing changed, and the case-study text specs are now confirmed (from Figma).** What changed, with the previous values:

- **Gap between blocks is still 2 rows (240px), but it is no longer 2 rows of squares.** It is now **1 row of squares followed by 1 empty row**, and the empty row is the one directly above the next heading. Before (2026-11-04): both rows showed the cell grid. Checked on 6 gaps in the screenshots (problem → approach, pillars → structure, hero → problem, structure → special, special → outcome, outcome → next project). Positions did not move: the headings are still on R15, R20, R27, R60, R75, R81.
- **The empty row ("flat band")**: `#121212`, a 1px `#272727` line along its top and bottom edge, **no vertical seams**, running the full 1440px (including the two edge columns). The other 1-row spacers are unchanged and still show squares: the row under a heading, the row between structure items, the row between the meta block and the hero image, and the row before the footer.
- **Weights and spacing confirmed** (they were inferred from the PDFs): problem text, approach statement, special-section text and pillar bodies are **Medium 500**, not Regular; structure item titles are **Medium 500**; the next-project link is **-3%**, not -2%; the label color is **`#626161`**, not `#616161`; the item text, outcome description and "Next project" label are Regular 18 / -2%. The hero description and the meta values are Regular 20 at **0%**. New style: Mono Next Link.
- **Confirmed later the same day:** the main page uses the same gap behavior, including Hero → Selected Work (see the Page structure section), and Website Builder has exactly the same text styles as Visual Brain.

**2026-11-04 — Case study page template added (new, dark "grid" version).** Built from the Visual Brain and Website Builder PDF exports; see the Case Study Page section. What it adds:

- A page template on the same 120px cell grid: nav, title and meta block, hero image, problem, approach with three pillars, a structure list (side-image and full-width items), a special section, outcome, next-project link and the Contact footer. The row map covers both pages (87 and 83 rows).
- Rules: headings sit on a highlight rounded up to whole cells; 2-row gaps; text is centered in its cells with a 16px inset; headings and labels are typed in sentence case and shown in capitals (text case Upper).
- New styles (inferred from sizes and widths; weights unverified): Display Case 124 and 116, Mono Label, Mono Meta, Mono Case Body, Mono Pillar, Mono Item Title, Mono Stat; new colors `#626161` (labels) and `#3C3C3C` (placeholder numerals).
- Confirmed: the nav link cells (X960, 1080, 1200, 1320) and that "↗" is a text character in the next-project link.

**2026-11-04 — Contact CTA redesigned and footer added (dark "grid" version).** Rebuild it from the Contact CTA and Footer section below. This completes the dark version: every section is now captured. What changed, with the previous (light, 2026-10-25) values:

- Layout: two loose text layers (1296 wide, 126 tall each, gap 16) → cells on the page grid: line 1 on row 41 (Y4801, an 8-cell highlight), line 2 on row 42 (a 10-cell highlight), an empty row, then three rows (Y5161–5521) with the buttons, the footer text and the MK graphic. The page ends at row 46.
- Headline: "Ready for Designing?" in Geist SemiBold 120/126/-5%, `#171717` → "Got a project in mind?" in Geist Bold 96/121/-4%, and the email line in Geist Bold 101/121/-4%, both `#FFFFFF`.
- Added: a decorative down-left arrow (col 11, row 41); four 2-cell link buttons (Back to top, Github, X (Twitter), LinkedIn; default `#1F1F1F` with green label and icon, hover/click green with a `#1F1F1F` label); a footer text group ("Designed and built by Mostafa Elkorashy" / "Open to freelance & full-time offers remotely"); the MK graphic again (X840).
- Assets: `assets/icon-github.svg`, `icon-x.svg`, `icon-linkedin.svg` (24 / 16 / 24px, recolored with `currentColor`) and `cta-arrow.svg` (120 × 120).

**2026-11-04 — About Me redesigned (dark "grid" version).** Rebuild it from the About Me section below. What changed, with the previous (light, 2026-10-25) values:

- Layout: auto-layout section (gap 96, 1296 wide, 910 tall, at Y4079) with a 176px heading and a content row (text 851 wide + 405 picture, gap 40) → cells on the page grid: heading on row 31 (Y3601, a 6-cell highlight), an empty row, then a 720 × 720 text block (cols 2–7, rows 33–38) and a 480 × 480 block (cols 9–12, rows 33–36).
- Heading: Geist Bold 132/176/-6%, `#171717`, "About Me" → Geist Bold 148/121/**-5%**, `#FFFFFF`, "ABOUT ME" (the -5% is what fits the 6 cells).
- Body: Geist Regular 20/Auto/-1%, `#171717`, 851 wide → Geist Mono Regular 18/23/-2%, `#B8B8B8`, 704 wide inside the 720px block (8px inset). Emphasis: Geist Extra Bold 800 → inline Geist Mono Bold 700, `#FFFFFF`.
- Picture: "Picture of me" placeholder, 405 × 405, `#D9D9D9` → your photo in a 480 × 480 block (cols 9–12, rows 33–36).
- Copy: paragraphs 1 to 4 rewritten; "Photography" removed from the interests.

**2026-11-04 — Timeline redesigned (dark "grid" version).** Rebuild it from the Timeline section below. What changed, with the previous (light, 2026-10-25) values:

- Layout: auto-layout section (gap 96, 1296 wide, 1936 tall, at Y1887) with a 176px heading and 7 rows of 82px content + 72px gap + divider → cells on the page grid: heading on row 19 (Y2161), an empty row, then 8 entry rows of 120px (Y2401–3361), with a 2-row gap after Selected Work.
- Heading: Geist Bold 132/176/-6%, `#171717` → Geist Bold 148/121/-4% (Display), `#FFFFFF`, on a 6-cell highlight.
- Years: Geist Light 120/126/-3%, Neutral Grey, 405 wide → Geist Mono ExtraLight 148/121/-4%, `#09FD42` with layer opacity rising from 10% to 45% (5% per row), in a 3-cell column.
- Descriptions: Geist Bold 32/Auto/-4%, `#171717`, 851 wide → Geist Mono Medium 28/Auto/-2%, `#B8B8B8`, 688 wide inside 6 cells.
- Dividers: a Light Gray line under each row (851 wide) → 1px `#272727` lines at the top and bottom of the cells.
- Copy: 2021 "Freelance UI/UX (Projects and Part-time) across multiple Clients, and the first Fulltime job." → "Freelance UI/UX (Projects, Full-time, and Part-time) across multiple clients."; 2022 "Fulltime" → "full-time".

**2026-11-04 — Selected Work redesigned (dark "grid" version).** Rebuild it from the Selected Work section below. What changed, with the previous (light, 2026-10-25) values:

- Layout: auto-layout section (gap 96, 1296 wide, 761 tall, at Y870) with a 129px heading box and two cards 627.5 wide with a 41px gap → cells on the page grid: heading on row 11 (Y1201), two 480 × 480 cards (cols 2–5 and 7–10) starting on row 13 (Y1441), with an empty column between them.
- Heading: Geist Bold 132/176/-6%, `#171717`, "Selected Work" → Geist Bold 148/121/-4% (the hero's Display values), `#FFFFFF`, "SELECTED WORK", on a 10-cell highlight.
- Image: 627.5 × 405 `#D9D9D9` placeholder → 480 × 360 block of 12 `#1F1F1F` cells.
- Card text: title H2 (Geist Bold 32), description H6 (Geist 14), both `#171717`, gap 8, in a text group with gap 16 → title Geist Mono Bold 28, description Geist Mono Regular 14 in `#B8B8B8`, link Geist Mono Bold 24, all -2%, with gaps 0 and 10, inside a 4-cell text row (`#1F1F1F` with 1px `#272727` lines on its top and bottom edges).
- Link: "View Project ↗" in H3, `#CC0000`, underlined → Geist Mono Bold 24, `#09FD42`, no underline.

**2026-11-04 — Hero redesigned (dark "grid" version).** Rebuild the hero from the Hero section below. Only the hero has been captured in this version; the sections after it are still the light version. What changed, with the previous (light, 2026-10-25) values in case you need to roll back:

- Theme: light page, `#171717` ink, red accent `#CC0000` → `#121212` page, `#FFFFFF` text, green accent `#09FD42`.
- Structure: auto-layout stack (frame gap 16, height 614, content 1296 wide inside 72px margins) → a visible 120 × 120 cell grid, 12 across, with text and boxes snapped to cells. Highlight cells `#1F1F1F` sit behind the name, the headline lines and the subtext.
- Headline: Geist Bold 208/175/-6%, "PRODUCT" `#CC0000`, "DESIGNER &" and "BUILDER" `#171717` → Geist Bold 148/121/-4%, all `#FFFFFF`, with "&" as its own layer in `#09FD42` at 40%.
- Header: row 1296 × 34.91 at X72 Y33 (space-between), eyebrow "Mostafa Elkorashy" in H3, nav links in H4 with gap 16 (421 × 26) → MK logo centered in cell 1, name in Geist Mono Light 28 on a 3-cell highlight, nav links in Geist Mono Bold 20 centered in four 120px cells.
- Subtext: H4 → Geist Mono Regular 20, 0% letter spacing, on a 4-cell highlight.
- Button: red rectangle `#CC0000`, 405 × 63, absolutely positioned at X891 Y495, label "Contact" in Geist Bold 24 / -4%, `#D1D1D6`, underlined → 360 × 120 (3 cells), label Geist Mono Bold 36 with a long arrow. Default `#1F1F1F` with a green label; hover `#09FD42` with a `#1F1F1F` label.
- Dotted "MK" graphic: red and never captured → green (`#09FD42` at 80%), now captured, with the PNG and the logo SVG saved in `assets/`.
- Hero height: 614 → 960 (8 rows; inferred from the 2-row section gap, the hero frame wasn't selected).
- Retired for the hero: `#CC0000`, `#171717` and the light page.

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
- Added: the closing CTA "Ready for Designing? / hi@mostafaelkorashy.com".

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

### Dark-version styles (2026-11-04)

None of these are saved as Figma text styles yet; the Text styles panel still lists only the table above. The names are proposed.

| Proposed name | Font       | Weight       | Size  | Line height | Letter spacing | Used for              |
|---------------|------------|--------------|-------|-------------|----------------|-----------------------|
| Display       | Geist      | Bold 700     | 148px | 121px       | -4%            | Hero headline, "&", Selected Work heading |
| Mono Name     | Geist Mono | Light 300    | 28px  | Auto        | -2%            | Name in the header    |
| Mono Nav      | Geist Mono | Bold 700     | 20px  | Auto        | -3%            | Nav links             |
| Mono Body     | Geist Mono | Regular 400  | 20px  | Auto        | 0%             | Hero subtext          |
| Mono Button   | Geist Mono | Bold 700     | 36px  | Auto        | -4%            | Contact button label  |
| Mono Card Title | Geist Mono | Bold 700   | 28px  | Auto        | -2%            | Selected Work card title (the same as Mono Name but Bold) |
| Mono Card Text | Geist Mono | Regular 400 | 14px  | Auto        | -2%            | Selected Work card description |
| Mono Link     | Geist Mono | Bold 700     | 24px  | Auto        | -2%            | "View Project ↗"      |
| Mono Year     | Geist Mono | ExtraLight 200 | 148px | 121px     | -4%            | Timeline year numerals |
| Mono Timeline | Geist Mono | Medium 500   | 28px  | Auto        | -2%            | Timeline descriptions  |
| Display Tight | Geist      | Bold 700     | 148px | 121px       | -5%            | About Me heading (the tighter spacing fits 6 cells) |
| Display CTA 1 | Geist      | Bold 700     | 96px  | 121px       | -4%            | Contact CTA line 1     |
| Display CTA 2 | Geist      | Bold 700     | 101px | 121px       | -4%            | Contact CTA line 2 (email) |
| Mono Text     | Geist Mono | Regular 400  | 18px  | Auto (23px) | -2%            | About body, social button labels, footer line 2 |
| Mono Text Strong | Geist Mono | SemiBold 600 | 18px | Auto (23px) | -2%           | "Back to top", footer line 1 |
| Mono Text Bold | Geist Mono | Bold 700     | 18px  | Auto (23px) | -2%            | Bold words in the About text ("Design Engineer", "Other Interests:") |
| Display Case  | Geist      | Bold 700     | 124px (116px for one long heading) | 121px | -4% | Case-study headings (shown in capitals). **Confirmed in Figma** for 124 (title, "The problem", "3000px → 440px"); the 116 variant is from the PDF |
| Mono Label    | Geist Mono | Regular 400  | 20px  | Auto (26px) | 0%             | Case-study meta and pillar labels, `#626161`, capitals. Confirmed |
| Mono Meta     | Geist Mono | Regular 400  | 20px  | Auto (26px) | 0%             | Hero description and meta values, `#FFFFFF`. Confirmed |
| Mono Case Body | Geist Mono | Medium 500  | 20px  | Auto (26px) | -2%            | Problem, approach statement and special-section text, `#B8B8B8`; the special-section sub-heads are Bold 700, `#FFFFFF`. Confirmed |
| Mono Pillar   | Geist Mono | Medium 500   | 16px  | Auto (21px) | -2%            | Approach pillar text, `#B8B8B8`. Confirmed |
| Mono Item Title | Geist Mono | Medium 500 | 24px  | Auto (31px) | -2%            | Structure item titles, `#B8B8B8`, capitals. Confirmed |
| Mono Stat     | Geist Mono | Light 300    | 120px | 111px       | -2%            | Outcome stat, `#B8B8B8`, capitals. Confirmed |
| Mono Next Link | Geist Mono | Light 300   | 120px | 111px       | -3%            | Next-project link, `#FFFFFF`, capitals. Confirmed (the stat is -2%, the link is -3%) |

The structure item text, the outcome description and the "Next project" label use **Mono Text** (Regular 18 / Auto 23 / -2%, `#B8B8B8`).

## Notes

- **Fraunces variable-font axes** (Title, Sub Title, H1): `Weight 600`, `Soft 0`, `Wonk 0`. "Optical size" is set to **automatic**, meaning it tracks the rendered font size rather than a fixed number — Figma currently shows it resolving to **144** for all three styles. That's because Fraunces' optical-size (`opsz`) axis tops out at 144, and all three sizes (192px, 120px, 72px) are large enough to hit that ceiling. In practice you can treat 144 as "maxed out," not a fixed value you need to hardcode per style.
- **"Auto" line height** (H2–H6) means Figma derives it from the font's own metrics rather than a fixed pixel value. If you need an exact px number for CSS, check the computed value in Figma's Inspect panel or set a fixed line height yourself.
- **Several light-version type styles aren't saved as text styles yet** (all unlinked in Figma): hero headline Geist Bold 208/175/-6%; section headings Geist Bold 132/176/-6%; timeline years Geist Light 120/126/-3%; closing CTA Geist SemiBold 120/126/-5%; About body Geist Regular 20/Auto/-1%. See each section.
- **Geist Mono is new to the project** (dark hero). Its "Auto" line height is 9/7 of the font size (about 1.2857). The boxes confirm it: 28 → 36, 14 → 18, 24 → 31, 20 → 26, 36 → 47, 18 → 23 (Figma rounds to whole pixels; 18 gives 23.14 → 23, so it isn't always rounding up). CSS `normal` should match if the same font file loads; if it doesn't, use `line-height: 1.2857`. Load weights 200, 300, 400, 500, 600 and 700.
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

Dark-version hero styles (2026-11-04):

```css
:root {
  --font-mono: "Geist Mono", ui-monospace, monospace;

  /* Display */
  --font-display-family: "Geist", sans-serif;
  --font-display-weight: 700;
  --font-display-size: 148px;
  --font-display-line-height: 121px;
  --font-display-letter-spacing: -0.04em;

  /* Mono styles: line height is `normal` (Figma "Auto") for all four */
  --font-mono-name-weight: 300;   --font-mono-name-size: 28px;   --font-mono-name-letter-spacing: -0.02em;
  --font-mono-nav-weight: 700;    --font-mono-nav-size: 20px;    --font-mono-nav-letter-spacing: -0.03em;
  --font-mono-body-weight: 400;   --font-mono-body-size: 20px;   --font-mono-body-letter-spacing: 0;
  --font-mono-button-weight: 700; --font-mono-button-size: 36px; --font-mono-button-letter-spacing: -0.04em;
  --font-mono-card-title-weight: 700; --font-mono-card-title-size: 28px; --font-mono-card-title-letter-spacing: -0.02em;
  --font-mono-card-text-weight: 400;  --font-mono-card-text-size: 14px;  --font-mono-card-text-letter-spacing: -0.02em;
  --font-mono-link-weight: 700;       --font-mono-link-size: 24px;       --font-mono-link-letter-spacing: -0.02em;
  --font-mono-year-weight: 200;       --font-mono-year-size: 148px;      --font-mono-year-line-height: 121px; --font-mono-year-letter-spacing: -0.04em;
  --font-mono-timeline-weight: 500;   --font-mono-timeline-size: 28px;   --font-mono-timeline-letter-spacing: -0.02em;

  /* About Me and Contact (Display Tight and the CTA lines reuse Display's family, weight and 121px line height) */
  --font-display-tight-letter-spacing: -0.05em;
  --font-display-cta-1-size: 96px;  --font-display-cta-2-size: 101px;  /* letter spacing -0.04em */
  --font-mono-text-weight: 400;       --font-mono-text-size: 18px;   --font-mono-text-line-height: 23px; --font-mono-text-letter-spacing: -0.02em;
  --font-mono-text-strong-weight: 600; /* same size, line height and spacing as Mono Text */
  --font-mono-text-bold-weight: 700;   /* About bold words */

  /* Case-study pages (sizes read from the PDFs; weights and spacing inferred, see that section) */
  --font-case-heading-size: 124px;   /* 116px for the longest heading; Geist Bold, 121px line height, -0.04em assumed */
  --font-mono-label-size: 20px;      /* 0% spacing; pillar text is 16px, item titles 24px, stat and link 120px, all -0.02em */
}
```

## Colors

### Dark version (current, 2026-11-04)

| Name (proposed) | Hex       | RGB            | Used for |
|-----------------|-----------|----------------|----------|
| Page / base cell | `#121212` | 18, 18, 18    | Page background, base and clear cells |
| Cell highlight  | `#1F1F1F` | 31, 31, 31     | Highlight cells, default button fill, hover button label |
| Grid line       | `#272727` | 39, 39, 39     | 1px stroke on base cells |
| White (pure)    | `#FFFFFF` | 255, 255, 255  | Text and logo (differs from the light version's White `#F2F2F7`) |
| Accent green    | `#09FD42` | 9, 253, 66     | **The only green.** Hover / click fill of the hero button and the Contact buttons; default labels and icons; "&" at 40%; MK graphic at 80%; card links; the CTA arrow at 20% |
| Muted text      | `#B8B8B8` | 184, 184, 184  | Card descriptions, Timeline descriptions, About body, footer line 2, case-study body text |
| Label text      | `#626161` | 98, 97, 97     | Case-study meta labels and pillar labels |
| Placeholder numeral | `#3C3C3C` | 60, 60, 60 | The 1 to 7 numbers on the case-study image placeholders |

```css
:root {
  --color-page: #121212;
  --color-cell-highlight: #1F1F1F;
  --color-grid-line: #272727;
  --color-white-pure: #FFFFFF;
  --color-accent-green: #09FD42;
  --color-text-muted: #B8B8B8;
  --color-text-label: #626161;
  --color-placeholder-number: #3C3C3C;
}
```

- **Opacity sits on the fill, not the color:** "&" is `#09FD42` at 40%; the MK graphic is `#09FD42` at 80% (baked into the PNG). The Timeline year numerals are the exception: `#09FD42` at 100% fill with the *layer* opacity at 10% to 45%.
- **Not bound to variables.** All five show as raw hex in Figma's panel. Create variables so there is one source of truth.
- **Green is the dark version's accent** (`--color-accent-green`). `--color-accent` below is still red and belongs to the retired light version.

### Light version (retired: no section uses it any more)

| Name         | Hex       | RGB               |
|--------------|-----------|--------------------|
| White        | `#F2F2F7` | 242, 242, 247      |
| Background   | `#252525` | 37, 37, 37         |
| Dark Grey    | `#4E4E4E` | 78, 78, 78         |
| Neutral Grey | `#A3A3A3` | 163, 163, 163      |
| Light Gray   | `#D1D1D6` | 209, 209, 214      |
| Accent       | `#CC0000` | 204, 0, 0          |
| Ink *(name TBD)* | `#171717` | 23, 23, 23     |

### CSS custom properties (light version)

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

> **Cell grid (dark version, 2026-11-04).** The hero doesn't sit on the 12-column (margin 72, gutter 16) or 3-column grid. It uses a cell grid: 120 × 120 cells, 12 across (`1440 / 12`), no margin or gutter. See the Hero section for the cell types and the map. It isn't known yet whether the 12- and 3-column layout grids are still applied in this version.

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

Current version: **dark "grid" theme** (captured 2026-11-04). The previous light version and the dark version before it are recorded in the Changelog.

> **Scope.** This is the dark "grid" version, and it now covers the whole page (hero, Selected Work, Timeline, About Me, Contact CTA and footer). The light version survives only in the Changelog and the light tables, as a roll-back reference.

### The cell grid

The hero is built on a visible grid of **120 × 120 cells, 12 across** (`1440 / 12 = 120`, edge to edge, no margin or gutter). Everything snaps to it: text sits on highlighted cells, and boxes (button, graphic) cover whole cells.

| Cell type | Fill | Stroke | Used for |
|---|---|---|---|
| Base | `#121212` | 1px `#272727`, centered | Everything not highlighted |
| Highlight | `#1F1F1F` | none | Blocks behind the name, headline lines and subtext |
| Clear | `#121212` | none | The 4 × 3 block under the MK graphic, so no grid lines show through it |

Rows start 1px down: row tops are at `Y = 1 + 120 × n` (1, 121, 241, 361, 481, 601, 721…). That is a Figma artifact; in code a 1px offset on the grid background is enough.

**Grid map** (columns 1–12 start at X 0, 120, 240 … 1320; rows 1–7 start at Y 1, 121 … 721). Extents of the highlights were measured from the screenshots; only the name cell was selected directly.

```
        1  2  3  4  5  6  7  8  9  10 11 12
R1  Y1    L  N  N  N  .  .  .  .  W  T  A  C    L logo · N name highlight · W/T/A/C nav links
R2  Y121  .  H  H  H  H  H  H  .  .  .  .  .    H headline highlight: "PRODUCT" (cols 2–7)
R3  Y241  .  H  H  H  H  H  H  &  .  .  .  .    "DESIGNER" + "&" (cols 2–8, & in col 8)
R4  Y361  .  H  H  H  H  H  .  .  .  .  .  .    "BUILDER" (cols 2–6)
R5  Y481  .  S  S  S  S  .  .  .  M  M  M  M    S subtext highlight (cols 2–5) · M MK graphic block
R6  Y601  .  .  .  .  .  .  .  .  M  M  M  M
R7  Y721  .  B  B  B  .  .  .  .  M  M  M  M    B Contact button (cols 2–4)
R8+ Y841  empty base cells (the grid keeps going below; hero height not captured)
```

Arithmetic checks, all consistent with the measured values:

- Logo centered in cell 1: `(120 − 51.96) / 2 = 34` → X34 ✓; `1 + (120 − 34.91) / 2 = 43.5` → Y43 ✓
- Name and subtext sit 34px inside their highlight: `120 + 34 = 154` ✓ (same inset as the logo)
- Name vertically centered in row 1: `1 + (120 − 36) / 2 = 43` ✓. Subtext in row 5: `481 + (120 − 78) / 2 = 502` ✓
- Nav text centered in 120px cells vertically: `(120 − 26) / 2 = 47` ✓
- Headline height: `3 × 121 = 363` ✓. Subtext: `3 lines × 26 = 78` ✓
- Button label centered: `(360 − 224) / 2 = 68` ✓, `(120 − 47) / 2 = 36.5` ✓
- MK graphic: 477 × 365 at 3x = 1431 × 1095, which is exactly the exported PNG size ✓

### Elements

Values are what Figma shows. Where the build target differs (snap-to-grid), the next table lists it.

| Element | Position (X, Y) | Size | Text style | Fill |
|---|---|---|---|---|
| Logo "MK" (vector group) | 34, 43 | 51.96 × 34.91 | — | `#FFFFFF` |
| Name "Mostafa Elkorashy" | 154, 43 | 277 × 36 Hug | Geist Mono Light 28, line height Auto, -2% | `#FFFFFF` |
| Nav "Work" | 959, 47 | 121 Fixed × 26 Hug | Geist Mono Bold 20, Auto, -3%, centered in its cell | `#FFFFFF` |
| Nav "Timeline" | 1080, 47 | 120 Fixed × 26 Hug | same | `#FFFFFF` |
| Nav "About", "Contact" | 1200 / 1320, 47 *(inferred)* | ~120 × 26 | same *(not selected)* | `#FFFFFF` *(inferred)* |
| Headline | 116, 119 | 717 × 363 Fixed width | Geist Bold 148, line height 121, -4%, left / top | `#FFFFFF` |
| "&" (separate layer) | 843, 239 | 105 × 121 Hug | same as headline | `#09FD42` at **40%** fill opacity (layer opacity 100%) |
| Subtext | 154, 502 | 410 × 78 Fixed width | Geist Mono Regular 20, Auto, 0%, left / top | `#FFFFFF` |
| Contact button | 115, 719 | 360 × 120 | see Button below | see Button below |
| MK graphic frame | 955, 479 | 477 × 365 | — | see MK graphic below |

Headline text: "PRODUCT / DESIGNER / BUILDER" on three lines ("&" is its own layer after "DESIGNER"). It renders in capitals; whether it is typed that way or transformed is unknown. Subtext: "A UI/UX Designer who crossed into front-end, so design and build never fall out of sync."

### Snap to grid (your decision: snap everything)

| Element | Figma now | Build target |
|---|---|---|
| Contact button | X115, Y719 | **X120, Y721** (cols 2–4, row 7) |
| MK graphic frame | X955, Y479, 477 × 365 | **X960, Y481, 480 × 360** (cols 9–12, rows 5–7); the latest screenshot already shows it filling that block |
| Headline text box | X116, Y119 | **X120, Y121** (col 2, row 2). The -4px X looks like an optical offset for the "P" side bearing; after snapping, the P stem sits roughly 4px inside the highlight edge (measured from the screenshot) |
| "&" | X843, Y239 | Keep at 3px inside cell 8 (`840 + 3`), same baseline as "DESIGNER" |

In the latest full-frame screenshot the button already appears to sit at X120 / Y721 and the MK graphic to fill its 4 × 3 block (measured from the image); the headline and "&" still need updating in Figma.

### Header

Row 1 (Y1–121): logo in cell 1, name on a 3-cell highlight (cols 2–4), nav links in cols 9–12. Cells 5–8 stay base cells. The logo is a vector group; use `assets/mk-logo.svg` (52 × 35 viewBox, one path, `fill="white"`; inline it with `fill="currentColor"` so it follows the text color).

### Headline

Three lines, each exactly one row tall (121 line height against 120 rows, so about 1px drift per line; the third line sits 2px low against its cell). Highlight behind each line is whole cells: line 1 cols 2–7, line 2 cols 2–8, line 3 cols 2–6. "DESIGNER" nearly fills the 717 box (it ends at about X824), so use explicit line breaks rather than relying on wrapping.

### Button — "Contact"

| Property | Value |
|---|---|
| Frame | 360 × 120 (3 × 1 cells), radius 0, no stroke. Position X120, Y721 after snapping |
| Auto layout | Horizontal, gap 10, padding 72 horizontal / 16 vertical, centered both ways. The width is fixed, and `224 + 144 = 368 > 360`, so the padding doesn't drive anything: the label is simply centered (`(360 − 224) / 2 = 68`) |
| Label | "Contact" plus a long arrow, one text layer, 224 × 47 Hug, Geist Mono Bold 36, line height Auto, -4% |

| State | Fill | Label and arrow |
|---|---|---|
| Default | `#1F1F1F` (confirmed by sampling the screenshot: same as the highlight cells) | `#09FD42` *(inferred: it renders identical to the hover fill)* |
| Hover | `#09FD42` | `#1F1F1F` |

Confirmed from the two-variant selection (752 × 120): its selection colors list only `#09FD42` and `#1F1F1F`, so the hover label is `#1F1F1F` (not `#121212`), and the default label is `#09FD42`. The two variants sit side by side 32px apart (`752 = 360 + 32 + 360`), so the hover variant is at about X512; that's just variant placement, not a layout position. Focus, active, pressed and the transition are not designed yet.

**The arrow (unverified).** It is about 60px wide, roughly three monospace characters (`3 × (21.6 − 1.44) ≈ 60`), and `142 ("Contact") + 20 (space) + 62 ≈ 224` matches the text width. My guess is the text is `Contact -->` and Geist Mono renders `-->` as a long arrow ligature. I couldn't test it here (the font package wouldn't download). If the raw characters are different, or the ligature doesn't appear in the browser, draw the arrow as an inline SVG about 60 × 14 instead.

### MK graphic

| Property | Value |
|---|---|
| Frame | Figma: X955, Y479, 477 × 365, constraints Right / Top, **Clip content on**, frame fill hidden. Build: X960, Y481, 480 × 360 |
| Content | Dotted "MK" monogram in `#09FD42`, mostly at 80% opacity (the PNG's dominant pixel is `rgb(9, 252, 66)` at alpha 204 = 80%, with lighter dots fading out) |
| Asset | `assets/mk-graphic@3x.png`: 1431 × 1095, transparent RGBA (97.6% transparent), exported at 3x of the 477 × 365 frame |
| Under it | 12 clear cells (`#121212`, no stroke) covering cols 9–12 × rows 5–7. The neighbours' grid lines still show on the block's top and left edges |

Aspect ratio: the PNG is 1.307 and the snapped block is 1.333, a 2% difference. Use `object-fit: fill` (the distortion is invisible in dotted art), and re-export at 1440 × 1080 if the Figma frame is resized to 480 × 360. Whether the graphic animates is unknown.

### CSS

```css
:root {
  --cell: 120px; /* Figma: 1440 / 12. Fluid behavior is still to be decided */
  /* colors: see Colors (dark version); fonts: see Typography (dark-version hero styles) */
}

.hero {
  position: relative;
  width: 1440px; /* fixed for now; hero height not captured */
  display: grid;
  grid-template-columns: repeat(12, var(--cell));
  grid-auto-rows: var(--cell);
  padding-top: 1px; /* Figma's grid rows start at Y1 */
  background-color: var(--color-page);
  background-image:
    linear-gradient(var(--color-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px);
  background-size: var(--cell) var(--cell);
  background-position: 0 1px;
  color: var(--color-white-pure);
}

/* Row 1: header */
.hero-logo   { grid-column: 1; grid-row: 1; display: grid; place-items: center; }
.hero-name   { grid-column: 2 / 5; grid-row: 1; display: flex; align-items: center; padding-left: 34px;
               background: var(--color-cell-highlight);
               font: 300 28px/normal var(--font-mono); letter-spacing: -0.02em; }
.hero-nav    { display: contents; } /* the four links become direct grid items */
.hero-nav a  { grid-row: 1; display: flex; align-items: center; justify-content: center;
               font: 700 20px/normal var(--font-mono); letter-spacing: -0.03em; color: inherit; text-decoration: none; }
.hero-nav a:nth-child(1) { grid-column: 9; }  /* Work */
.hero-nav a:nth-child(2) { grid-column: 10; } /* Timeline */
.hero-nav a:nth-child(3) { grid-column: 11; } /* About */
.hero-nav a:nth-child(4) { grid-column: 12; } /* Contact */

/* Rows 2–4: headline, one line per row */
.hero-headline-line { display: flex; align-items: center; position: relative;
                      background: var(--color-cell-highlight);
                      font: 700 148px/121px "Geist", sans-serif; letter-spacing: -0.04em; text-transform: uppercase; }
.hero-headline-line--1 { grid-column: 2 / 8; grid-row: 2; } /* PRODUCT, cols 2–7 */
.hero-headline-line--2 { grid-column: 2 / 9; grid-row: 3; } /* DESIGNER &, cols 2–8 */
.hero-headline-line--3 { grid-column: 2 / 7; grid-row: 4; } /* BUILDER, cols 2–6 */
.hero-amp { position: absolute; left: calc(6 * var(--cell) + 3px); /* cell 8 starts at X840 = 120 + 720 */
            color: rgb(9 253 66 / 0.4); }

/* Row 5: subtext */
.hero-subtext { grid-column: 2 / 6; grid-row: 5; display: flex; align-items: center; padding-left: 34px;
                background: var(--color-cell-highlight);
                font: 400 20px/normal var(--font-mono); letter-spacing: 0; }
.hero-subtext p { width: 410px; margin: 0; }

/* Row 7: button */
.hero-button { grid-column: 2 / 5; grid-row: 7; display: flex; align-items: center; justify-content: center; gap: 10px;
               padding: 16px 72px; white-space: nowrap; /* keeps the arrow on the label's line */
               background: var(--color-cell-highlight); color: var(--color-accent-green); border-radius: 0;
               font: 700 36px/normal var(--font-mono); letter-spacing: -0.04em;
               font-variant-ligatures: normal; /* the arrow, if it is the "-->" ligature */ }
.hero-button:hover { background: var(--color-accent-green); color: var(--color-cell-highlight); }

/* Rows 5–7, cols 9–12: MK graphic over a clear block */
.hero-mk { grid-column: 9 / 13; grid-row: 5 / 8; background: var(--color-page); /* hides the grid lines */
           margin: 1px 0 0 1px; /* leave the neighbours' lines on the top and left edges */ }
.hero-mk img { display: block; width: 100%; height: 100%; object-fit: fill; }
```

### Page structure (shared across versions)

The outermost frame is a fixed 1440-wide canvas with `Clip content` on. In the light version it showed a single **Spacing: 102px** that doesn't match anything (the measured section gap was 256px), so treat 102 as unexplained and ignore it. In the dark version the gap between sections is **2 rows (240px)** (since 2026-11-05 every one of those gaps is **1 row of squares followed by 1 empty "flat" row**, the flat row being the one right above the next section's heading; the sections didn't move): the hero is rows 1–8 (960px, inferred), rows 9–10 are the gap, and the Selected Work heading is on row 11 (`1 + 960 + 240 = 1201` ✓). Confirmed again by the Timeline: Selected Work ends at Y1921 and Timeline starts at Y2161 (`1921 + 240`). Confirmed a third and fourth time: the Timeline ends at Y3361 and About Me starts at Y3601, and About Me ends at Y4561 and the Contact CTA starts at Y4801. The `--section-gap` value below comes from the light version's measurements and is retired; its cross-check Y positions (870, 1887, 4079) no longer apply.

**Full page row map (dark version).** Row `n` starts at `Y = 1 + 120 × (n − 1)`.

| Section | Rows | Y range | Height |
|---|---|---|---|
| Hero | 1–8 (inferred) | 1–961 | 960 |
| *gap* | 9 cells · 10 FLAT | 961–1201 | 240 |
| Selected Work | 11–16 | 1201–1921 | 720 |
| *gap* | 17 cells · 18 FLAT | 1921–2161 | 240 |
| Timeline | 19–28 | 2161–3361 | 1200 |
| *gap* | 29 cells · 30 FLAT | 3361–3601 | 240 |
| About Me | 31–38 | 3601–4561 | 960 |
| *gap* | 39 cells · 40 FLAT | 4561–4801 | 240 |
| Contact CTA and footer | 41–46 | 4801–5521 | 720 |

The page frame ends at Y5521 (46 rows); the frame itself wasn't selected.

**Gap recipe (changed 2026-11-05).** Each 2-row gap is a row of squares (the normal grid) followed by a **flat band**: `#121212`, a 1px `#272727` line on its top and bottom edge only, no vertical seams, full 1440px width. The hero → Selected Work gap is included (row 9 squares, row 10 flat). Measured on the case-study page (6 gaps); confirmed by you for the main page. Same band as the case-study page:

```css
.page-section { position: relative; }
.page-section + .page-section { margin-top: var(--section-gap-grid); }   /* 240px */
.page-section + .page-section::before {                                  /* the flat row, right above the next section */
  content: ""; position: absolute; left: 0; right: 0; top: calc(-1 * var(--cell)); height: var(--cell);
  background: var(--color-page);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line);
  pointer-events: none;
}
```

```css
:root {
  --page-width: 1440px;
  --section-gap-grid: calc(2 * var(--cell)); /* dark version: 240px = 2 rows between sections */
  --section-gap: 256px; /* light version: Hero → Selected Work (870 = 614 + 256), Selected Work → Timeline (1887 = 870 + 761 + 256), Timeline → About (4079 = 1887 + 1936 + 256) */
}
```

### Notes

- **Nothing here is a saved text style.** The Figma Text styles panel still lists only the old Title, Sub Title and H1–H6. The five hero styles are in the Typography section as proposed names.
- **White differs.** The hero text is pure `#FFFFFF`; the existing "White" token is `#F2F2F7`.
- **Green is the dark version's accent** (`--color-accent-green`). `--color-accent` stays red but belongs to the retired light version.
- **Auto line height** for Geist Mono is 9/7 of the font size (see Typography); CSS `normal` should match if the same font file loads.

### Still missing

- **The hero frame itself:** its fill and exact height. The grid does continue behind the next section (Selected Work sits on rows 11–16). With the 2-row section gap, the hero should be 8 rows (960px), so row 8 is an empty bottom row; confirm. The `#222222` in the Figma page panel is the canvas color, not the design.
- **Arrow characters** (see Button above).
- **Responsive behavior:** fixed 120px cells versus `100vw / 12`, and fixed versus fluid headline size. To be decided.
- **Nav:** hover, active and sticky behavior. (The link positions are confirmed by the case-study PDFs: cells at X960, 1080, 1200 and 1320, each 120 wide, text centered.)
- **Button focus, active and transition**, and whether the MK graphic animates.
- **Headline:** typed in capitals or transformed; line height 121 versus the 120 rows (set Figma to 120 for an exact fit).
- **Highlight extents** were measured from screenshots; select a few of the highlight cells to confirm them.
- **Layout grids:** whether the old 12-column (margin 72, gutter 16) and 3-column grids are still used in this version.

## Components — Selected Work Section

Current version: **dark "grid" theme** (captured 2026-11-04). The previous light version is recorded in the Changelog.

### Where it sits

The cell grid is one continuous page background (row tops at `Y = 1 + 120 × n`), and sections are placed on it. The heading is at Y1201, which is **row 11**. The gap between sections is **2 rows (240px)**: the hero's last content row is row 7 (the button, Y721–841), row 8 is its empty bottom row, and rows 9–10 (Y961–1201) are the gap. That makes the hero 8 rows (960px) tall; the hero frame itself hasn't been selected, so the 960 is inferred.

**Grid map** for this section (columns start at X 0, 120 … 1320). Card 2's columns are measured from the screenshots, and you confirmed it matches card 1.

```
        1  2  3  4  5  6  7  8  9  10 11 12
R11 Y1201  .  H  H  H  H  H  H  H  H  H  H  .    H heading highlight, cols 2–11 (X120–1320)
R12 Y1321  .  .  .  .  .  .  .  .  .  .  .  .    empty
R13 Y1441  .  I  I  I  I  .  J  J  J  J  .  .    I card 1 image, J card 2 image (no stroke)
R14 Y1561  .  I  I  I  I  .  J  J  J  J  .  .
R15 Y1681  .  I  I  I  I  .  J  J  J  J  .  .
R16 Y1801  .  T  T  T  T  .  U  U  U  U  .  .    T / U text cells (with stroke)
```

Each card is 4 × 4 cells (480 × 480): an image block of 4 × 3 cells (480 × 360) and a text row of 4 × 1 cells (480 × 120). Card 1 covers cols 2–5 (X120–600), card 2 covers cols 7–10 (X720–1200), and col 6 is the empty column between them.

| Cell type | Fill | Stroke |
|---|---|---|
| Heading highlight (10 cells, X120–1320) | `#1F1F1F` | none |
| Image block (12 cells per card, placeholder for the project image) | `#1F1F1F` | none |
| Card text row (4 cells per card) | `#1F1F1F` | 1px `#272727`, centered, on the top and bottom edges only: there are no vertical seams between the 4 cells (measured from the screenshot pixels) |
| Cell after the heading (X1320) | `#121212` | 1px `#272727` (a normal base cell) |

Arithmetic checks, all consistent:

- Heading: `119 + 1201 = 1320` ✓ (ends on a cell edge); `10 cells × 120 = 1200` ✓ (X120–1320)
- Image block: the 12 selected cells measure 480 × 360 ✓; text row 480 × 120 ✓
- Text group: `54 + 10 + 31 = 95` ✓; info group `36 + 0 + 18 = 54` ✓ (the link sits at Y64 = `54 + 10` ✓)
- Text group is vertically centered in its row: `1801 + (120 − 95) / 2 = 1813.5` → Y1814 ✓
- Text group X136 = `120 + 16` ✓. Figma shows width 447 (a 17px right inset); **decided: 448**, so the insets are 16 on both sides (`16 + 448 + 16 = 480` ✓)

### Elements

| Element | Position (X, Y) | Size | Text style | Fill |
|---|---|---|---|---|
| Heading "SELECTED WORK" | 119, 1200 | 1201 Fixed width × 121 | Geist Bold 148, line height 121, -4%, left / top (same values as Display) | `#FFFFFF` |
| Text group (frame) | 136, 1814 | 448 *(Figma shows 447)* × 95 Hug | — | none |
| Info group (frame) | 0, 0 inside the text group | 448 Fill × 54 Hug | — | none |
| Title "Visual Brain" | 0, 0 inside the info group | 448 Fill × 36 Hug | Geist Mono Bold 28, Auto, -2% | `#FFFFFF` |
| Description "A local-first inspiration library I designed and built." | 0, 36 inside the info group | 448 Fill × 18 Hug | Geist Mono Regular 14, Auto, -2% | `#B8B8B8` |
| Link "View Project ↗" | 0, 64 inside the text group | 448 Fill × 31 Hug | Geist Mono Bold 24, Auto, -2% | `#09FD42` |

The text group is a vertical auto-layout frame (gap 10, padding 0, children left-aligned). The info group is a vertical auto-layout frame inside it (gap 0, padding 0). The link has no underline in the screenshots. The "↗" is a text character (confirmed), so it stays in the link's text. **Only the link is clickable**, not the whole card.

Card 2 ("Website Builder") has the same structure, styles and description copy as card 1 (confirmed; the copy is probably placeholder). Its text group is at X736 (`720 + 16`), Y1814.

### CSS

```css
/* The grid background lives on the page wrapper once there is more than one section; .hero keeps only its cells */
.selected-work {
  display: grid;
  grid-template-columns: repeat(12, var(--cell));
  grid-auto-rows: var(--cell);
  /* starts at row 11 (Y1201) of the page grid */
}

.sw-heading {
  grid-column: 2 / 12;  /* cols 2–11, X120–1320 */
  grid-row: 1;
  display: flex;
  align-items: center;
  background: var(--color-cell-highlight);
  color: var(--color-white-pure);
  font: 700 148px/121px "Geist", sans-serif;
  letter-spacing: -0.04em;
  text-transform: uppercase; /* assumed: confirm whether typed in caps */
}

.sw-card {
  grid-row: 3 / 7;      /* row 2 (Y1321) is empty; images rows 3–5, text row 6 */
  display: grid;
  grid-template-rows: calc(3 * var(--cell)) var(--cell); /* image block 360, text row 120 */
}
.sw-card--1 { grid-column: 2 / 6; }   /* cols 2–5, X120–600 */
.sw-card--2 { grid-column: 7 / 11; }  /* cols 7–10, X720–1200 */

.sw-card-image {
  background: var(--color-cell-highlight); /* placeholder: 12 cells, no stroke */
}
.sw-card-image img { display: block; width: 100%; height: 100%; object-fit: cover; }

.sw-card-text {
  display: flex;
  align-items: center; /* the 95px group is centered in the 120px row */
  padding: 0 16px;
  background-color: var(--color-cell-highlight);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line); /* top and bottom lines only, no vertical seams */
}

.sw-card-group { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.sw-card-info  { display: flex; flex-direction: column; gap: 0; }

.sw-card-title { margin: 0; color: var(--color-white-pure);
                 font: 700 28px/normal var(--font-mono); letter-spacing: -0.02em; }
.sw-card-desc  { margin: 0; color: var(--color-text-muted);
                 font: 400 14px/normal var(--font-mono); letter-spacing: -0.02em; }
.sw-card-link  { color: var(--color-accent-green); text-decoration: none;
                 font: 700 24px/normal var(--font-mono); letter-spacing: -0.02em; }
```

### Notes

- **Three new Geist Mono styles** (card title, card description, card link) are in the Typography section. None is saved as a Figma text style. The title matches "Mono Name" except for the weight (Bold instead of Light).
- **`#B8B8B8`** is a new muted-text color (description). See Colors.
- **Heading** uses the same values as the hero headline (Display). Its X119 / Y1200 is 1px off the cell origin (120 / 1201); snap it the same way as the hero.
- **Image placeholders** are plain highlight cells. Real project images would need to fill 480 × 360 (4:3).

### Still missing

- **Link states** (hover, focus) aren't designed yet. Card hover isn't needed, since only the link is clickable.
- **Heading text:** typed in capitals or transformed.
- **Hero frame height** (inferred as 1200) and whether the section has its own frame.
- **Real project images** and their aspect ratio and fit.

## Components — Timeline Section

Current version: **dark "grid" theme** (captured 2026-11-04). The previous light version is recorded in the Changelog.

### Where it sits

The heading is at Y2161, which is **row 19**. Selected Work ends at Y1921 (its text row is Y1801–1921), so `1921 + 240 = 2161` ✓: this confirms the **2-row (240px) gap between sections**. The section is 10 rows (1200px) tall: heading row 19, one empty row 20, then 8 rows of timeline entries (rows 21–28, Y2401–3361). The next section would start at Y3601 (two rows after 3361).

**Grid map** (columns start at X 0, 120 … 1320). Only the cells noted in the table below were selected; the rest is measured from the screenshots and by sampling pixels.

```
        1  2  3  4  5  6  7  8  9  10 11 12
R19 Y2161  .  H  H  H  H  H  H  .  .  .  .  .    H heading highlight, cols 2–7 (X120–840)
R20 Y2281  .  .  .  .  .  .  .  .  .  .  .  .    empty
R21 Y2401  .  Y  Y  Y  .  D  D  D  D  D  D  .    2017   Y year cells (cols 2–4, X120–480)
R22 Y2521  .  Y  Y  Y  .  D  D  D  D  D  D  .    2019   D description cells (cols 6–11, X600–1320)
R23 Y2641  .  Y  Y  Y  .  D  D  D  D  D  D  .    2020
R24 Y2761  .  Y  Y  Y  .  D  D  D  D  D  D  .    2021
R25 Y2881  .  Y  Y  Y  .  D  D  D  D  D  D  .    2022
R26 Y3001  .  Y  Y  Y  .  D  D  D  D  D  D  .    2023
R27 Y3121  .  Y  Y  Y  .  D  D  D  D  D  D  .    2024
R28 Y3241  .  Y  Y  Y  .  D  D  D  D  D  D  .    2026
```

Column 5 (X480–600) between the years and the descriptions is empty (base cells).

| Cell type | Fill | Stroke |
|---|---|---|
| Heading highlight (6 cells, X120–840) | `#1F1F1F` | none |
| Cell after the heading (X840) | `#121212` | 1px `#272727` (a normal base cell) |
| Year cells (3 per row) | `#1F1F1F` (sampled from the screenshot) | 1px `#272727` lines on the top and bottom edges only |
| Description cells (6 per row; 6 cells selected in rows 1 and 2, 720 × 120) | `#1F1F1F` | 1px `#272727`, centered, on the top and bottom edges only (row 2 shows the stroke; row 1 shows none of its own, but the line is there from its neighbours) |

There are **no vertical seams** between the cells in the year or description columns (sampled at several cell boundaries). Only the horizontal row lines show.

Arithmetic checks, all consistent:

- Heading row: `1 + 120 × 18 = 2161` ✓; the highlight is 6 cells: the last one is at X720 and ends at 840 ✓
- List start: `2161 + 120 + 120 = 2401` ✓ (heading row, one empty row)
- Year X131 = `120 + (360 − 338) / 2` ✓ (centered in the 3-cell column)
- Description X616 = `600 + 16` ✓; `616 + 688 = 1304 = 1320 − 16` ✓ (16px inset on both sides)
- Row spacing 120 ✓ (year Y values step by 120 apart from one 121 step: 2397, 2518, 2638 …)
- Description heights: 1 line = 36, 2 lines = 72 ✓ (28px at 1.2857 line height)

### Elements

| Element | Position (X, Y) | Size | Text style | Fill |
|---|---|---|---|---|
| Heading "TIMELINE" | 123, 2159 | 639 Hug × 121 | Geist Bold 148, line height 121, -4%, left / top (same as Display) | `#FFFFFF` |
| Year numerals | 131, row top − 3 (row 1: − 4) | 338 Hug × 121 | Geist Mono **ExtraLight 200** 148, line height 121, -4%, left / top | `#09FD42` at 100% fill, with **layer opacity** 10% to 45% (below) |
| Description | 616, centered in the row (Figma: 2px above exact center) | 688 Fixed × 36 or 72 Hug | Geist Mono **Medium 500** 28, line height Auto, -2%, left / top | `#B8B8B8` |

**Year opacity ramp.** The opacity is on the text layer (Appearance), not the fill. It rises by 5% per row:

| Row | Year | Row top Y | Year Y (Figma) | Layer opacity | Description lines | Description Y (Figma) |
|---|---|---|---|---|---|---|
| 1 | 2017 | 2401 | 2397 | 10% | 2 | 2423 |
| 2 | 2019 | 2521 | 2518 | 15% | 2 | 2543 |
| 3 | 2020 | 2641 | 2638 | 20% | 1 | 2681 |
| 4 | 2021 | 2761 | 2758 | 25% | 2 | 2783 |
| 5 | 2022 | 2881 | 2878 | 30% | 2 | 2903 |
| 6 | 2023 | 3001 | 2998 | 35% | 1 | 3041 |
| 7 | 2024 | 3121 | 3118 | 40% | 1 | 3161 |
| 8 | 2026 | 3241 | 3238 | 45% | 3 *(not selected)* | — |

The description Y values are all exactly 2px above a perfect vertical center (`row top + (120 − height) / 2`), so build them centered. The year numerals are 121px tall in a 120px row, placed 3px above the row top, so they fill their row and touch the next one.

### Content

| Year | Description |
|---|---|
| 2017 | Started at the Faculty of Applied Arts, majoring in Graphic Design. |
| 2019 | Started my career as a Freelance Logo Designer. |
| 2020 | Moved into UI/UX Design. |
| 2021 | Freelance UI/UX (Projects, Full-time, and Part-time) across multiple clients. |
| 2022 | Joined Ynmo as a full-time Product Designer; graduated the same year. |
| 2023 | Mandatory Army Service. |
| 2024 | Rejoined Ynmo as a Product Designer. |
| 2026 | Started coding; designed and built Visual Brain, my own local-first inspiration library tool. |

At 688px wide and 28px Geist Mono (16.24px per character), these wrap exactly as in the screenshots (2017, 2019, 2021 and 2022 on two lines, 2026 on three), so use natural wrapping.

### CSS

```css
.timeline {
  display: grid;
  grid-template-columns: repeat(12, var(--cell));
  grid-auto-rows: var(--cell);
  /* sits on the page grid, starting at row 19 (Y2161) */
}

.tl-heading {
  grid-column: 2 / 8;  /* cols 2–7, X120–840 */
  grid-row: 1;
  display: flex;
  align-items: center;
  background: var(--color-cell-highlight);
  color: var(--color-white-pure);
  font: 700 148px/121px "Geist", sans-serif;
  letter-spacing: -0.04em;
  text-transform: uppercase; /* assumed: confirm whether typed in caps */
}

.tl-list {
  grid-column: 1 / -1;
  grid-row: 3 / span 8;   /* row 2 (Y2281) is empty; entries start at row 3 = Y2401 */
  display: grid;
  grid-template-columns: subgrid;
  grid-auto-rows: var(--cell);
}

.tl-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}

.tl-year {
  grid-column: 2 / 5;  /* cols 2–4, X120–480 */
  display: flex;
  justify-content: center;  /* the 338px numerals sit centered in the 360px column */
  align-items: flex-start;
  background: var(--color-cell-highlight);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line);
}

.tl-year span {
  margin-top: -3px;
  font: 200 148px/121px var(--font-mono);
  letter-spacing: -0.04em;
  color: var(--color-accent-green);
  opacity: calc(0.1 + 0.05 * var(--i)); /* --i = 0 … 7 on each row: 10% … 45% */
}

.tl-desc {
  grid-column: 6 / 12;  /* cols 6–11, X600–1320 */
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: var(--color-cell-highlight);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line);
}

.tl-desc p {
  margin: 0;
  font: 500 28px/normal var(--font-mono);
  letter-spacing: -0.02em;
  color: var(--color-text-muted);
}
```

Markup: each `.tl-row` gets `style="--i: 0"` … `"--i: 7"`, with a `.tl-year > span` and a `.tl-desc > p` inside.

### Notes

- **Two new Geist Mono styles** (Mono Year: ExtraLight 148; Mono Timeline: Medium 28) are in the Typography section. Neither is a saved Figma text style. The heading uses the Display values again.
- **Fixed row height.** Every entry sits in one 120px row. The 2026 entry takes 3 lines (108px), so it just fits; a 4th line (144px) would overflow. If entries grow, rows should grow in whole cells (240px) to keep the grid aligned.
- **Copy changes from the light version:** the 2021 line no longer mentions "the first Fulltime job" (the About text still does), and "Fulltime" became "full-time" in 2022.
- **Heading offset.** Figma has X123 / Y2159 (3px right of and 2px above the cell origin); snap it to X120 as with the other headings.

### Still missing

- **Rows 3 to 8** weren't selected; their cells are assumed to match rows 1 and 2 (X600–1320). The **2026 description** text (3 lines, expected at X616 and centered) wasn't selected either.
- **Year column cells** weren't selected; the fill (`#1F1F1F`) and the line style were sampled from the screenshot.
- **Heading text:** typed in capitals or transformed.
- **Offsets:** whether the year's −3px and the description's −2px are intended (the build uses them as measured and centered, respectively).
- **Interaction:** whether the opacity ramp is static (as designed) or reacts to scroll or hover.
- **Responsive behavior** of the rows and the two columns.

## Components — About Me Section

Current version: **dark "grid" theme** (captured 2026-11-04). The previous light version is recorded in the Changelog.

### Where it sits

The heading is at Y3598, which is **row 31** (row top `1 + 120 × 30 = 3601`, so the text sits 3px above it). The Timeline's last row is Y3241–3361, so `3361 + 240 = 3601` ✓: the usual **2-row (240px) gap**. The section is 8 rows (960px) tall: heading row 31, one empty row 32, then the content on rows 33–38 (Y3841–4561). The next section (Contact CTA) starts at Y4801 (`4561 + 240` ✓, confirmed by its heading).

**Grid map** (columns start at X 0, 120 … 1320). Cell fills were sampled from the screenshots; only the cells noted in the table were selected.

```
        1  2  3  4  5  6  7  8  9  10 11 12
R31 Y3601  .  H  H  H  H  H  H  .  .  .  .  .    H heading highlight, cols 2–7 (X120–840)
R32 Y3721  .  .  .  .  .  .  .  .  .  .  .  .    empty
R33 Y3841  .  T  T  T  T  T  T  .  P  P  P  P    T text block, cols 2–7 (720 × 720)
R34 Y3961  .  T  T  T  T  T  T  .  P  P  P  P    P right block, cols 9–12 (480 × 480)
R35 Y4081  .  T  T  T  T  T  T  .  P  P  P  P
R36 Y4201  .  T  T  T  T  T  T  .  P  P  P  P
R37 Y4321  .  T  T  T  T  T  T  .  .  .  .  .
R38 Y4441  .  T  T  T  T  T  T  .  .  .  .  .
```

| Cell type | Fill | Stroke |
|---|---|---|
| Heading highlight (6 cells, X120–840) | `#1F1F1F` | none |
| Text block (36 cells, 6 × 6; the 6 cells of column 7 were selected) | `#1F1F1F` | none (the stroke section is empty) |
| Right block (16 cells, 4 × 4, X960–1440, Y3841–4321) | `#1F1F1F`, flat across all 16 (pixel scan, no grid lines visible) | the 7 selected cells (top row and right column) list a 1px `#272727` center stroke, but it doesn't show in the render |
| Column 8 (X840–960) and column 1 | `#121212` | 1px `#272727` (normal base cells) |

The 480 × 480 block is **your photo** (confirmed). Until the image exists it is a flat `#1F1F1F` square. The 7 selected cells (the top row and the right column below it) and the inner 3 × 3 area are not distinguishable in the render, so build one 480 × 480 picture slot. The tiny pink dot in each selected cell is a Figma selection marker, not a design element.

Arithmetic checks, all consistent:

- Heading row: `1 + 120 × 30 = 3601` ✓. Heading X118 + width 722 = 840 ✓ (the text ends on the edge of the 6-cell highlight)
- **Text block width:** 704 + 2 × 8 = 720 ✓, so the intended inset is 8px per side. Figma has X127 (7px) and a right gap of 9px, so it's 1px off; built with an 8px inset on all four sides (X128, Y3849)
- **Text height:** 644 = 28 lines × 23px ✓ (see Content for the line count)
- **Wrapping:** 704px / 10.44px per character (18px Geist Mono at -2%: `18 × 0.58`) = 67.4 characters per line. Wrapped greedily at 67 characters, the five paragraphs take 4, 3, 5, 4 and 5 lines, and with the 5 blank lines and the 2 "Other Interests" lines that's 28 ✓. 66 characters per line would give 4, 4, 5, 4, 5, so the width is confirmed
- Text top: Y3845 = row top 3841 + 4. The text ends at 4489, which leaves 72px empty at the bottom of the 720px block
- Right block: `960 + 480 = 1440` ✓ (flush with the right edge of the page); column 8 is the empty gap between the two blocks (`120 + 720 + 120 + 480 = 1440` ✓)

### Elements

| Element | Position (X, Y) | Size | Text style | Fill |
|---|---|---|---|---|
| Heading "ABOUT ME" | 118, 3598 | 722 Hug × 121 | Geist Bold 148, line height 121, **-5%**, left / top | `#FFFFFF` |
| Body text (one text layer) | 127, 3845 | 704 Fixed width × 644 Hug (fixed width, auto height) | Geist Mono Regular 18, line height Auto (23px per line), -2%, left / top | `#B8B8B8`; the bold parts `#FFFFFF` |
| Bold parts: "Design Engineer" (paragraph 5) and "Other Interests:" | inline | — | Geist Mono **Bold 700** 18, same size, line height and spacing | `#FFFFFF` |
| Photo | 960, 3841 | 480 × 480 | — | your photo (`#1F1F1F` placeholder until the image is added) |

**The heading's -5%** is different from the -4% of the other headings. It's needed: at -4% the 8 glyphs would add about 12px (`8 × 0.01 × 148`), making the text about 734px wide, which no longer fits the 720px (6-cell) highlight. Keep -5% here.

**Bold weight.** Selecting the words individually shows **Geist Mono Bold 700**, `#FFFFFF`, for "Design Engineer" and "Other Interests:"; the rest is Regular 400, `#B8B8B8`. (Whole-layer selection shows "Mixed".) This is Mono Text Bold, a different weight from the SemiBold 600 used for "Back to top" and the footer.

### Content

The body is one text layer. Paragraphs are separated by one blank line (a real empty line of 23px, not paragraph spacing). "Other Interests:" and the line below it are separated by a single line break.

> I've been obsessed with technology for as long as I can remember. Nokia phones and Windows XP were sort of my childhood. Then came gaming, MMORPGs in particular, which is where I learned a lot of my English. That helped me later in my career.
>
> That obsession followed me to high school, when I was aiming for a CS degree, but life pointed me to Applied Arts instead, where I got to be a graphic designer and handle computers in different ways.
>
> I started as a generalist, learning the fundamentals across every corner of design. Then, in 2020, the lockdown got me interested in user interface design. With my background in graphic design, I thought it would be an easy move, but it was just the start of something much bigger and more challenging.
>
> That's when the English I learned from gaming finally paid off. In 2021, I started my first full-time job as a UI/UX designer at Reliant Technologies in New Jersey, USA. I found out that remote work really can work, and I've been remote ever since.
>
> Now it's 2026 and I think we've reached the age of the **Design Engineer**. Design and production shouldn't be two different species. When a designer steps into the front-end, writing the HTML and CSS themselves, every pixel lines up on both sides of the handoff. That's the gap I want to close.
>
> **Other Interests:**
> Cars · Motorcycles · Gaming · Lifting

Changes from the light version: paragraphs 1 to 4 were rewritten (shorter sentences, "full-time", "designer", lower-case "high school" and "graphic"); paragraph 5 is the same; "Photography" was removed from the interests. Use natural wrapping: the width wraps exactly as in Figma.

### CSS

```css
.about {
  display: grid;
  grid-template-columns: repeat(12, var(--cell));
  grid-auto-rows: var(--cell);
  /* sits on the page grid, starting at row 31 (Y3601) */
}

.about-heading {
  grid-column: 2 / 8;   /* cols 2–7, X120–840 */
  grid-row: 1;
  display: flex;
  align-items: center;
  background: var(--color-cell-highlight);
  color: var(--color-white-pure);
  font: 700 148px/121px "Geist", sans-serif;
  letter-spacing: -0.05em;   /* -5%: needed to fit 6 cells */
  white-space: nowrap;
  text-transform: uppercase; /* assumed: confirm whether typed in caps */
}

.about-text {
  grid-column: 2 / 8;   /* cols 2–7 */
  grid-row: 3 / span 6; /* row 2 (Y3721) is empty; rows 33–38 */
  padding: 8px;         /* 8px on all sides: 704 wide; the text ends well inside the 720px block */
  background: var(--color-cell-highlight);
  font: 400 18px/23px var(--font-mono);
  letter-spacing: -0.02em;
  color: var(--color-text-muted);
}

.about-text p { margin: 0; }
.about-text p + p { margin-top: 23px; } /* one blank line */
.about-text strong { font-weight: 700; color: var(--color-white-pure); }

.about-picture {
  grid-column: 9 / 13;  /* cols 9–12, X960–1440 */
  grid-row: 3 / span 4; /* rows 33–36 */
  background: var(--color-cell-highlight); /* placeholder */
}
.about-picture img { display: block; width: 100%; height: 100%; object-fit: cover; }
```

Markup: the last paragraph is `<p><strong>Other Interests:</strong><br>Cars · Motorcycles · Gaming · Lifting</p>`.

### Notes

- **Two new Geist Mono styles** (Mono Text: Regular 18; Mono Text Strong: SemiBold 18; Mono Text Bold: Bold 18) and **Display Tight** (Geist Bold 148/121/-5%) are in the Typography section. None is a saved Figma text style.
- **Line height** for the body is set to a fixed 23px. It's what Figma's "Auto" gives at 18px (644 / 28 lines), and it keeps the block at 644px. CSS `normal` may give 23.14px (648px in total).
- **Offsets.** The heading is at X118 / Y3598 (2px left of and 3px above the cell origin); snap it to X120 like the other headings.
- **Photo.** One 480 × 480 picture slot (cols 9–12, rows 33–36), flush with the right edge of the page. Use a square crop (`object-fit: cover`).
- **Alignment.** Everything is built aligned to the grid: the text block has an even 8px inset (Figma has 7 / 9 / 4), and the heading is snapped to X120.

### Still missing

- **The photo file** (square, at least 960 × 960 for sharpness on high-density screens) and its alt text.
- **Heading text:** typed in capitals or transformed.
- **Responsive behavior** of the text block and the right block.

## Components — Contact CTA and Footer

Current version: **dark "grid" theme** (captured 2026-11-04). The previous light version (two lines of text) is recorded in the Changelog. This is the last section of the page: it holds the closing call to action, the four link buttons and the footer text. The nav's "Contact" item and the hero's Contact button presumably point here.

### Where it sits

About Me ends at Y4561, and the first line of the CTA is at Y4799, which is **row 41** (row top `1 + 120 × 40 = 4801`, the text sits 2px above it): `4561 + 240 = 4801` ✓, the usual **2-row gap**. The section is 6 rows (720px): rows 41–42 the two headline lines, row 43 empty, rows 44–46 the buttons, footer text and MK graphic (Y5161–5521). The page frame appears to end at Y5521 (read off the screenshots; the frame wasn't selected), so the whole page is 46 rows.

**Grid map** (columns start at X 0, 120 … 1320). Cell fills were sampled from the screenshots; the cells noted in the table were selected.

```
        1  2  3  4  5  6  7  8  9  10 11 12
R41 Y4801  .  H  H  H  H  H  H  H  H  .  A  .    H line 1 highlight, cols 2–9 (X120–1080); A arrow, col 11
R42 Y4921  .  H  H  H  H  H  H  H  H  H  H  .    H line 2 highlight, cols 2–11 (X120–1320)
R43 Y5041  .  .  .  .  .  .  .  .  .  .  .  .    empty
R44 Y5161  .  B  B  .  .  .  .  M  M  M  M  .    B "Back to top" (cols 2–3); M MK graphic (cols 8–11, rows 44–46)
R45 Y5281  .  G  G  X  X  L  L  M  M  M  M  .    G Github, X X (Twitter), L LinkedIn (two cells each)
R46 Y5401  .  f  f  f  f  f  f  M  M  M  M  .    f footer text, on plain base cells
```

| Cell type | Fill | Stroke |
|---|---|---|
| Headline highlight (8 cells in line 1, 10 in line 2; 120 × 120 rectangles) | `#1F1F1F` | none |
| Button cells (2 cells per button, 240 × 120: Back to top, Github, X, LinkedIn), default | `#1F1F1F` | 1px `#272727`, center. The Back-to-top cells were selected and list it; no seam shows inside a button, and a faint vertical line (sampled `#242424`) separates neighbouring buttons |
| Button cells, **hover / click** | `#09FD42` | as above |
| MK frame (480 × 360) | `#121212` ("clear" cell, same as the hero) | none |
| Footer text row | none (plain base cells, `#121212`, 1px `#272727`) | — |

Arithmetic checks, all consistent:

- Rows: `1 + 120 × 40 = 4801`, `+ 120 = 4921`, `+ 240 = 5161` (the buttons start after the empty row 43) ✓. The buttons' second row starts at Y5281 and the footer row at Y5401, which ends at 5521 ✓
- Button content: Github `24 + 24 + 63 = 111` and `(240 − 111) / 2 = 64.5` ✓ (icon X64.5, text X112.5); X `16 + 24 + 116 = 156`, `(240 − 156) / 2 = 42` ✓ (icon X42, text X82); LinkedIn `24 + 24 + 84 = 132`, `(240 − 132) / 2 = 54` ✓ (icon X54, text X102)
- Text widths at 18px Geist Mono (10.44px per character): "Github" 6 × 10.44 = 63 ✓, "LinkedIn" 8 × 10.44 = 84 ✓, "Back to top ↑" 13 × 10.44 = 136 ✓ (so "↑" is one mono-width character), "Open to freelance & full-time offers remotely" 45 × 10.44 = 470 ✓. "X (Twitter)" is 11 × 10.44 = 115 but measures 116 (1px, ignored)
- Back to top: `172 = 120 + (240 − 136) / 2` ✓
- Footer frame: `23 + 16 + 23 = 62` ✓
- Headline widths: line 1 is 948 inside the 960 highlight (8 cells), line 2 is 1126 inside 1200 (10 cells)
- MK frame: X840 + 480 = 1320 ✓, Y5161 + 360 = 5521 ✓ (rows 44–46)

### Elements

| Element | Position (X, Y) | Size | Text style | Fill |
|---|---|---|---|---|
| Headline line 1 "Got a project in mind?" | 120, 4799 | 948 Hug × 121 | Geist Bold **96**, line height 121, -4%, left / top | `#FFFFFF` |
| Headline line 2 "hi@mostafaelkorashy.com" | 120, 4919 | 1126 Hug × 121 | Geist Bold **101**, line height 121, -4%, left / top | `#FFFFFF` |
| Arrow | 1200, 4801 | 120 × 120 frame (rotated 180° in Figma; the exported SVG already has the rotation baked in), clip content | — (`assets/cta-arrow.svg`) | `#09FD42` at 20% |
| Button "Back to top ↑" (text) | 172, 5206 | 136 Hug × 23 | Geist Mono **SemiBold 600** 18, Auto, -2% | `#09FD42` |
| Button "Github" (frame) | 120, 5324 | 240 Fixed × 24 Hug, horizontal auto layout, gap 24, padding 0, centered | — | none |
| ↳ icon / label | 64.5 / 112.5 inside the frame | 24 × 24 / 63 × 23 | label: Geist Mono Regular 18, Auto, -2% | `#09FD42` |
| Button "X (Twitter)" (frame) | 360, 5324 | 240 Fixed × 23 Hug, same layout | — | none |
| ↳ icon / label | 42 (Y3.5) / 82 inside the frame | 16 × 16 / 116 × 23 | same label style | `#09FD42` |
| Button "LinkedIn" (frame) | 600, 5324 | 240 Fixed × 24 Hug, same layout | — | none |
| ↳ icon / label | 54 / 102 inside the frame | 24 × 24 / 84 × 23 | same label style | shown in the hover state: `#1F1F1F` |
| Footer (frame) | 172, 5428 | 470 Hug × 62 Hug, vertical auto layout, gap 16, padding 0, left-aligned | — | none |
| ↳ line 1 "Designed and built by Mostafa Elkorashy" | 0, 0 | 470 Fill × 23 | Geist Mono **SemiBold 600** 18, Auto, -2% | `#FFFFFF` |
| ↳ line 2 "Open to freelance & full-time offers remotely" | 0, 39 | 470 Fill × 23 | Geist Mono Regular 18, Auto, -2% | `#B8B8B8` |
| MK graphic (frame) | 840, 5161 | 480 × 360, clip content, constraints Right / Top | — | `#121212` (the dotted MK image, as in the hero) |

The icon frames (GitHub 24, X 16, LinkedIn 24) have a hidden white fill, and their vectors take the label color, so recolor them with `currentColor`. **Assets** (in `assets/`): `icon-github.svg` (24 × 24), `icon-x.svg` (16 × 16) and `icon-linkedin.svg` (24 × 24) are your exports with the fill changed to `currentColor`, so the label color (green by default, `#1F1F1F` on hover) recolors them. `cta-arrow.svg` (120 × 120) is your export unchanged, with the `#09FD42` at 20% fill built in. Inline the three icons as `<svg>` (or use a CSS mask) so `currentColor` works; a plain `<img>` won't recolor them.

**Button states.** Your note says the LinkedIn button shows how **all four** buttons (Github, X, LinkedIn, Back to top) look when hovered or clicked. So:

| State | Cell fill | Icon and label |
|---|---|---|
| Default | `#1F1F1F` | `#09FD42` |
| Hover / click | `#09FD42` | `#1F1F1F` |

Every green in the design is `#09FD42` (confirmed), including the hover fill. The screenshot pixel samples lighter (`#6BF75D`); that was treated as a capture artifact and `#09FD42` is used. There is no separate pressed or focus design, so click uses the hover look.

**The arrow** (col 11, row 41) points down-left toward the email, a decorative cue. It's a 120 × 120 frame rotated 180° in Figma; the exported `cta-arrow.svg` already shows the final orientation (checked by rendering it), so **don't rotate it again** in code. Its color is `#09FD42` at 20% opacity, built into the file.

**Alignment.** Figma has the content slightly above the exact center (headline lines 2px above their row tops, button content about 5px above the center of its cell, "Back to top" 3.5px, footer 2px). The build **centers everything exactly** in its cells; those Figma offsets are not reproduced.

### Content

| Element | Text |
|---|---|
| Line 1 | Got a project in mind? |
| Line 2 | hi@mostafaelkorashy.com |
| Buttons | Back to top ↑ · Github · X (Twitter) · LinkedIn |
| Footer line 1 | Designed and built by Mostafa Elkorashy |
| Footer line 2 | Open to freelance & full-time offers remotely |

The old light-version headline was "Ready for Designing?"; the email line is unchanged. The link targets are not designed: the email is presumably `mailto:`, the three socials open the profiles in a new tab, and "Back to top" scrolls to the top of the page.

### CSS

```css
.contact {
  display: grid;
  grid-template-columns: repeat(12, var(--cell));
  grid-template-rows: repeat(6, var(--cell));
  /* sits on the page grid, starting at row 41 (Y4801) */
}

.cta-line {
  margin: 0;
  display: flex;
  align-items: center;
  background: var(--color-cell-highlight);
  color: var(--color-white-pure);
  font-family: "Geist", sans-serif;
  font-weight: 700;
  line-height: 121px;
  letter-spacing: -0.04em;
  white-space: nowrap;
}
.cta-line a { color: inherit; text-decoration: none; }
.cta-line--1 { grid-column: 2 / 10; grid-row: 1; font-size: 96px; }   /* cols 2–9 */
.cta-line--2 { grid-column: 2 / 12; grid-row: 2; font-size: 101px; }  /* cols 2–11 */

.cta-arrow {
  grid-column: 11;
  grid-row: 1;
  width: var(--cell);
  height: var(--cell);
  color: rgb(9 253 66 / 0.2); /* #09FD42 at 20% */
}

.cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: var(--color-cell-highlight);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line);
  color: var(--color-accent-green);
  font: 400 18px/normal var(--font-mono);
  letter-spacing: -0.02em;
  text-decoration: none;
}
.cta-btn svg { flex: none; fill: currentColor; }
.cta-btn:hover,
.cta-btn:focus-visible {
  background: var(--color-accent-green);
  color: var(--color-cell-highlight);
}

.cta-btn--top    { grid-column: 2 / 4; grid-row: 4; font-weight: 600; }
.cta-btn--github { grid-column: 2 / 4; grid-row: 5; }
.cta-btn--x      { grid-column: 4 / 6; grid-row: 5; }
.cta-btn--linkedin { grid-column: 6 / 8; grid-row: 5; }
.cta-btn--github svg, .cta-btn--linkedin svg { width: 24px; height: 24px; }
.cta-btn--x svg { width: 16px; height: 16px; }

.cta-footer {
  grid-column: 2 / 8;
  grid-row: 6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 0 0 0 52px; /* X172 = 120 + 52, aligned with the "Back to top" label; vertically centered */
  font: 400 18px/normal var(--font-mono);
  letter-spacing: -0.02em;
  color: var(--color-text-muted);
}
.cta-footer strong { font-weight: 600; color: var(--color-white-pure); }
.cta-footer p { margin: 0; }

.cta-mk {
  grid-column: 8 / 12;  /* cols 8–11, X840–1320 */
  grid-row: 4 / 7;      /* rows 44–46 */
  background: var(--color-page);
  overflow: hidden;
}
.cta-mk img { display: block; width: 100%; height: 100%; object-fit: cover; }
```

### Notes

- **Four new styles** are in the Typography section: Display CTA 1 (Geist Bold 96/121/-4%), Display CTA 2 (Geist Bold 101/121/-4%), Mono Text (Regular 18/Auto/-2%) and Mono Text Strong (SemiBold 600 18/Auto/-2%). None is a saved Figma text style.
- **Two different headline sizes.** The sizes (96 and 101) look tuned so that each line fills its highlight: line 1 is 948 of 960 and line 2 is 1126 of 1200. Keep them as designed.
- **Footer text and MK sit on the same rows.** The footer text (cols 2–7) has no highlight; the MK frame occupies rows 44–46 on the right. The MK frame is at X840 here, versus X960 in the hero.
- **The 2-row gap** above the CTA is confirmed (Y4561 → Y4801).

### Still missing

- **Link targets** for the three socials, the email (`mailto:`), and whether "Back to top" scrolls smoothly.
- **Focus and active states** (hover and click are assumed identical).
- **MK frame:** assumed the same image as the hero's (it was not re-selected); it sits at X840 here and X960 in the hero.
- **Page frame height** (assumed 5521) and whether anything sits below the footer.
- **Responsive behavior** of the headline (the email line is 1126px wide at 101px) and the button row.

## Components — Case Study Page (template)

Source: two Figma PDF exports (**Visual Brain**, 1440 × 10441, and **Website Builder**, 1440 × 9957; Figma, one tall page each, so 1 PDF unit = 1 Figma px). Cell fills, positions, text sizes and text colors were read from the vector data; the copy was extracted as typed. Everything here is the **dark "grid" version** and sits on the same 120px cell grid as the main page (`Y = 1 + 120 × (row − 1)`).

**Updated 2026-11-05:** the text styles below are now **confirmed from Figma's panel** (one selected layer of each kind), and the section gap changed (rule 1). What is still open (see Still missing): auto-layout and constraints, the Website Builder page, and the real image content (all seven images per page are still `#1F1F1F` placeholders with a number).

### Rules that hold on both pages

1. **Section gap = 2 rows (240px): 1 row of squares, then 1 empty row.** (Changed 2026-11-05; it used to be 2 rows of squares.) Every block still starts 2 rows after the previous one ends, but the second row of the gap, the one directly above the next heading, is a **flat band**: no vertical seams, only the 1px lines along its top and bottom edge. The first row keeps the squares. The other 1-row spacers (under a heading, between structure items, between the meta block and the hero image, before the footer) are unchanged and still show squares.
2. **Heading highlight = the text's right edge rounded up to a whole cell.** Heading text X is about 120 − 2; for example "Visual brain" ends at X932, so the highlight runs to X960 (7 cells, cols 2–8). Checked on all 10 headings, e.g. "Approach" (ends 778 → 6 cells), "Outcome" (717 → 5 cells), "3000px → 440px" (1122 → 9 cells), "Website builder" (1160 → 9 cells).
3. **Headings sit on one row, then 1 empty row, then the content.**
4. **Headings are typed in sentence case and shown in capitals** ("Visual brain", "The problem", "structure", "3000px → 440px"): the Figma text case is set to Upper (or CSS `text-transform: uppercase`). This also answers the open "typed or transformed?" question for the main-page headings, which are very likely the same.
5. **Text sits in `#1F1F1F` cells, inset 16px left and right, vertically centered in its row**, except where stated (meta group, special-section text: top-aligned with 16px). Centering was checked on about 12 text blocks to within 1px.
6. **Labels and titles in the cells are typed in sentence case too** ("Role & Company", "Local first", "Export for Claude") and shown in capitals.
7. **Hand-sized cells.** Some cells are one cell wider than the rule gives ("SEO settings" title, the "98+" stat). Treat the cell counts below as the design, not as a computed value.

### Page row map (Visual Brain; Website Builder differences in the next table)

`FLAT` marks the empty row of a section gap (see rule 1). Everything marked `empty` or left blank otherwise still shows squares.

```
Row   Y      What
R1    1      Nav (same as the main page: MK logo cell, name on a highlight, 4 link cells at X960 / 1080 / 1200 / 1320)
R2    121    empty
R3    241    TITLE heading, cols 2–8 (7 cells)
R4    361    description cols 2–7 · DURATION cols 10–11 (spans R4–R5)
R5    481    ROLE & COMPANY cols 2–4 · DELIVERABLES cols 7–9 (+ duration's lower half, so cols 7–11 read as one box)
R6    601    empty
R7–12 721    HERO IMAGE 1, cols 2–11 (1200 × 720)
R13 cells · R14 FLAT      gap
R15   1681   THE PROBLEM heading, cols 2–8 (7 cells)
R16   1801   empty
R17   1921   problem text, cols 2–11 (10 cells, one row)
R18 cells · R19 FLAT      gap
R20   2281   APPROACH heading, cols 2–7 (6 cells)
R21   2401   empty
R22   2521   statement, cols 2–10 (9 cells)
R23   2641   pillar LABELS: cols 1–3 · 5–7 · 9–11 (3 cells each, 1-cell gaps)
R24   2761   pillar BODIES: cols 2–4 · 6–8 · 10–12 (shifted one column right of the labels)
R25 cells · R26 FLAT      gap
R27   3121   STRUCTURE heading, cols 2–7
R28   3241   empty
R29–32       item 1 "Capture": title R29 (cols 2–3), text R30 (cols 2–6), image 2 on the right R29–32 (cols 8–12 = 600 × 480)
R33          empty
R34–37       item 2 "Folders": same recipe, image 3
R38          empty
R39–47       item 3 "AI analysis" (full width): title R39 (cols 2–3), text R40 (cols 2–11), empty R41, image 4 R42–47 (cols 2–11 = 1200 × 720)
R48          empty
R49–52       item 4 "Browsing": side recipe, image 5
R53          empty
R54–57       item 5 "Export for Claude": side recipe (title 3 cells), image 6
R58 cells · R59 FLAT      gap
R60   7081   SPECIAL heading "3000px → 440px", cols 2–10 (9 cells)
R61          empty
R62–65       text box, cols 2–9 (8 × 4 cells = 960 × 480), top-aligned
R66          empty
R67–72       image 7, cols 2–11 (1200 × 720)
R73 cells · R74 FLAT      gap
R75   8881   OUTCOME heading, cols 2–6 (5 cells)
R76          empty
R77–78       stat "OPEN / SOURCE" (R77 cols 2–4, R78 cols 2–5) · description R78 cols 7–11
R79 cells · R80 FLAT      gap
R81   9601   "NEXT PROJECT" label, cols 2–3
R82   9721   next-project link, cols 2–11 ("WEBSITE BUILDER ↗")
R83          empty
R84–86       footer (the same block as the Contact section: Back to top R84, buttons R85, footer text R86, MK frame cols 8–11)
R87          empty last row; page height 10441 = 1 + 87 × 120 ✓
```

| | Visual Brain | Website Builder |
|---|---|---|
| Page height | 10441 (87 rows) | 9957 (83 rows would be 9961, so the frame is **4px short** of the grid) |
| Title highlight | 7 cells (cols 2–8) | 9 cells (cols 2–10) |
| Description | 2 lines | 3 lines |
| Problem text | 3 lines | 2 lines |
| Approach statement | 1 line | 3 lines |
| Structure items | Capture, Folders, **AI analysis (full width)**, Browsing, Export for Claude | Basic information, Website setup, **Adding content (full width)**, Color customization, SEO settings |
| Special section | R60 (9 cells), text box R62–65, image R67–72 (720 tall) | R60 (10 cells, **116px** type so it fits), text R62 (9 cells, 1 row), image R64–70 (**840 tall**) |
| Outcome | stat "OPEN SOURCE" (2 lines), description cols 7–11 | stat "98+" (1 line), description cols 6–10 |
| Next project | R81–82, link 10 cells | R77–78, link 9 cells (text ends X1112) |
| Footer | R84–86 | R80–82, then 1 empty row |

### Cell recipes

| Element | Cells | Fill / stroke |
|---|---|---|
| Heading highlight, text cells, meta cells, pillar cells, stat cells, label cells | as listed in the row map | `#1F1F1F`; stroke follows the main-page cells (1px `#272727` lines on top and bottom) |
| Image placeholders (7 per page) | hero and full-width: 10 × 6 cells (1200 × 720, WB image 7: 10 × 7); side images: 5 × 4 cells (600 × 480), flush with the right edge (X840–1440) | `#1F1F1F`, no stroke; a centered number (1 to 7) in `#3C3C3C` |
| Background | everything else | `#121212` base cells with the 1px `#272727` grid |
| **Flat band** (the second row of every section gap) | full width, cols 1–12 (1440 × 120) | `#121212`, 1px `#272727` line on the top and bottom edge only, **no vertical seams**. Measured on 6 gaps; the fill is the same as the base cells |

Side images start at X840 and end at the page edge X1440, like the main page's right-hand blocks.

### Elements

Text styles are **confirmed from Figma** (Visual Brain, one layer of each kind). Positions are the Figma X / Y of the text layer. All text is Geist Mono unless noted; "Auto" line height is 1.3 × the size (20 → 26, 18 → 23, 16 → 21, 24 → 31); every layer is left / top aligned.

| Element | Figma X, Y · size | Style | Color |
|---|---|---|---|
| Title / section headings | X118–122, Y1 above the row top (e.g. Y241 on R3, 7080 on R60) · hug, 121 tall | Geist Bold 124 / 121 / -4%, uppercase (116 for one long Website Builder heading, from the PDF) | `#FFFFFF` |
| Hero description | 137, 395 · 686 fixed × 52 | Regular 20, 0% | `#FFFFFF` |
| Meta labels ("Duration", "Role & Company", "Deliverables") | Duration 1097, 378 · 205 × 26 | Regular 20, 0%, uppercase (Role X137; Deliverables X745, 24px, from the PDF) | `#626161` |
| Meta values ("1 Week", role, deliverables) | 1097, 412 · 72 × 26 (34px below the label) | Regular 20, 0% | `#FFFFFF` |
| Problem text | 136, 1941 · 1159 fixed × 78 (3 lines) | Medium 500 20, -2% | `#B8B8B8` |
| Approach statement | 136, 2568 · 1064 × 26 | Medium 500 20, -2% | `#B8B8B8` |
| Pillar labels ("Local first") | 60, 2688 · 132 × 26 (cell start + 60; X60, 540, 1020) | Regular 20, 0%, uppercase | `#626161` |
| Pillar bodies | 136, 2790 · 332 fixed × 63 (3 lines; X136 / 616 / 1096) | Medium 500 16, -2% | `#B8B8B8` |
| Structure item title ("Capture") | 136, 3405 · 183 × 31 | Medium 500 24, -2%, uppercase | `#B8B8B8` |
| Structure item text | 136, 3506 · 564 fixed × 69 (3 lines) | Regular 18, -2% (Mono Text) | `#B8B8B8` |
| Special section text | 136, 7337 · 928 fixed × 416 (16px inset; 960 − 32 = 928 ✓; top-aligned) | Medium 500 20, -2%; the three sub-heads ("Resized once, cached" …) are **Bold 700 20, -2%** | text `#B8B8B8`, sub-heads `#FFFFFF` |
| Outcome stat ("OPEN SOURCE", "98+") | 136, 9135 · 420 × 222 (2 lines, 111 apart) | Light 300 120 / 111 / -2%, uppercase | `#B8B8B8` |
| Outcome description | 736, 9278 · 560 fixed × 46 (R78, centered; Website Builder X616) | Regular 18, -2% (Mono Text) | `#B8B8B8` |
| "NEXT PROJECT" label | 136, 9649 · 126 × 23 (`12 × 10.44 = 125` ✓) | Regular 18, -2%, uppercase (Mono Text) | `#B8B8B8` |
| Next-project link | 136, 9725 · 1200 fixed × 111 | Light 300 120 / 111 / **-3%**, uppercase; ends with the character "↗" | `#FFFFFF` |
| Image numerals | centered in the image | 120px, 0% (from the PDF) | `#3C3C3C` |
| Footer | identical to the Contact section | | |

**Checks.** The panel values agree with the earlier width measurements: Mono advance is 0.6 em minus the letter spacing, so the 18px text is 10.44 per character (`"NEXT PROJECT"`: 126 ✓), the 20px meta text at 0% is 12 per character, and the 120px text at -2% is 69.6 (-3%: 68.4). The Medium weight on the body text is what the screenshots show for the whole layer (the problem text, statement and special-section text); the "Mixed" bold sub-heads were read by selecting one of them (Bold 700, `#FFFFFF`).

### Content fields

Both case studies fill the same fields:

| Field | Visual Brain | Website Builder |
|---|---|---|
| Title | Visual brain | Website builder |
| Description | A local-first library that saves, sorts, and tags design inspiration, all on your own machine. | A guided website builder that lets non-technical daycare owners publish their own site, without knowing what a "hero section" is. |
| Duration | 1 Week | 4 months |
| Role & Company | Designer and Developer / Personal Project | Product Designer @ Ynmo |
| Deliverables | Chrome extension, desktop library, local and cloud AI analysis | Builder flow, 9 section variants, responsive specs |
| Problem | (1 paragraph) | (1 paragraph) |
| Approach | 1 statement + 3 pillars (label + 3-line text) | 1 paragraph + 3 pillars |
| Structure | 5 items, each a title, a text and an image | 5 items |
| Special section | "3000px → 440px": 2 paragraphs + 3 bold sub-heads | "3 layouts × 3 styles": 1 paragraph |
| Outcome | stat "OPEN SOURCE", text "Free for any designer to use, or to take apart." and the placeholder "[Link to the repo]" | stat "98+", text "websites built and published by daycare and center owners with no technical background." |
| Next project | WEBSITE BUILDER ↗ | VISUAL BRAIN ↗ |

The full copy is in the two PDFs (and `case-studies/visual-brain.md`). The numbered images 1 to 7 map to the text in order: 1 hero, 2 to 6 the five structure items, 7 the special section.

### CSS

```css
/* A case-study page is a stack of blocks on the same 12-column cell grid. The nav and the footer are the main page's. */
.cs-block {
  display: grid;
  grid-template-columns: repeat(12, var(--cell));
  grid-auto-rows: var(--cell);
}
.cs-block { position: relative; }
.cs-block + .cs-block { margin-top: calc(2 * var(--cell)); } /* the 2-row gap; later rules override it inside the structure list */
/* The gap is 1 row of squares + 1 flat row. The page background draws the squares; this band covers the seams in the row above the block. */
.cs-block + .cs-block::before {
  content: ""; position: absolute; left: 0; right: 0; top: calc(-1 * var(--cell)); height: var(--cell);
  background: var(--color-page);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line);
  pointer-events: none;
}

.cs-cell { /* any highlighted text cell */
  display: flex; align-items: center; padding: 0 16px;
  background: var(--color-cell-highlight);
  box-shadow: inset 0 1px var(--color-grid-line), inset 0 -1px var(--color-grid-line);
}

.cs-heading {                       /* --n = cells, rounded up from the text width */
  grid-column: 2 / span var(--n); grid-row: 1; margin: 0;
  display: flex; align-items: center;
  background: var(--color-cell-highlight); color: var(--color-white-pure);
  font: 700 124px/121px "Geist", sans-serif;  /* 116px for the longest heading; spacing -4% assumed */
  letter-spacing: -0.04em; text-transform: uppercase; white-space: nowrap;
}

.cs-label { color: var(--color-text-label); text-transform: uppercase; font: 400 20px/normal var(--font-mono); letter-spacing: 0; }
.cs-body  { color: var(--color-text-muted); font: 500 20px/normal var(--font-mono); letter-spacing: -0.02em; }

/* Intro: title R3, meta R4–5, image R7–12 (the nav is R1, R2 is empty) */
.cs-intro .cs-heading   { grid-row: 1; }
.cs-desc     { grid-column: 2 / 8;  grid-row: 2; color: #fff; font: 400 20px/normal var(--font-mono); }
.cs-duration { grid-column: 10 / 12; grid-row: 2 / 4; }
.cs-role     { grid-column: 2 / 5;  grid-row: 3; }
.cs-deliv    { grid-column: 7 / 10; grid-row: 3; }
.cs-meta     { display: flex; flex-direction: column; justify-content: flex-start; gap: 8px; padding: 16px; background: var(--color-cell-highlight); color: #fff; font: 400 20px/normal var(--font-mono); }
.cs-image    { background: var(--color-cell-highlight); }          /* real images: object-fit: cover */
.cs-image--hero { grid-column: 2 / 12; grid-row: 5 / 11; }          /* 1200 × 720 */

/* Text blocks */
.cs-text      { grid-column: 2 / 12; grid-row: 3; }                  /* problem; one row, centered text */
.cs-statement { grid-column: 2 / 11; grid-row: 3; }                  /* approach statement, 9 cells */
.cs-pillars   { grid-row: 4 / 6; }                                   /* labels R23, bodies R24 */
.cs-pillar-label { grid-row: 4; padding-left: 60px; }                /* cols 1–3, 5–7, 9–11 */
.cs-pillar-body  { grid-row: 5; font: 500 16px/normal var(--font-mono); letter-spacing: -0.02em; }  /* cols 2–4, 6–8, 10–12 */

/* Structure items */
.cs-item .cs-item-title       { grid-column: 2 / span var(--t); grid-row: 1; }  /* 2 or 3 cells */
.cs-item--side .cs-item-text  { grid-column: 2 / 7;  grid-row: 2; font: 400 18px/normal var(--font-mono); letter-spacing: -0.02em; }
.cs-item--side .cs-image      { grid-column: 8 / 13; grid-row: 1 / 5; }          /* 600 × 480, flush right */
.cs-item--full .cs-item-text  { grid-column: 2 / 12; grid-row: 2; }
.cs-item--full .cs-image      { grid-column: 2 / 12; grid-row: 4 / 10; }          /* 1200 × 720 */
.cs-item + .cs-item,
.cs-block--head + .cs-item { margin-top: var(--cell); }                  /* 1 empty row between items, and after the STRUCTURE heading */
.cs-item + .cs-item::before,
.cs-block--head + .cs-item::before,
.cs-block--footer::before { content: none; }                       /* those spacers keep their squares: no flat band */

/* Special section */
.cs-special-text { grid-column: 2 / 10; grid-row: 3 / 7; align-items: flex-start; padding: 16px; } /* VB: 8 × 4 cells; WB: 9 × 1 cell, centered */
.cs-special-text strong { color: #fff; font-weight: 700; }

/* Outcome */
.cs-stat      { font: 300 120px/111px var(--font-mono); letter-spacing: -0.02em; color: var(--color-text-muted); text-transform: uppercase; }
.cs-outcome-text { font: 400 18px/normal var(--font-mono); letter-spacing: -0.02em; }  /* starts one column after the stat, 5 cells */

/* Next project */
.cs-next-label { grid-column: 2 / 4; font: 400 18px/normal var(--font-mono); text-transform: uppercase; }
.cs-next-link  { grid-column: 2 / span var(--n); font: 300 120px/111px var(--font-mono); letter-spacing: -0.03em; color: #fff; text-transform: uppercase; }
```

The footer is the Contact section's footer block (Back to top, three buttons, footer text, MK graphic), preceded by one empty row, with one extra empty row after it.

### Notes

- **Reuses the main-page grid.** Same 120px cells, same nav and footer, and the same 240px between blocks, but the gap is now 1 row of squares + 1 flat row (rule 1). The main page uses the same gap (confirmed). Nothing here needs a new color except `#626161` (meta and pillar labels) and `#3C3C3C` (placeholder numerals).
- **Heading cell counts** can be computed from the text width at build time (round up to the next 120px) or set per page with `--n`.
- **Footer in a PDF.** The green button labels and icons export as a flat grey in this PDF; the render shows the proper green `#09FD42`. Use the Contact section's values.
- **Nav links are now confirmed:** the four link cells start at X960, 1080, 1200 and 1320, each 120 wide, with the text centered ("Work" starts at X996, "Contact" at X1340).

### Still missing

- **Real images:** the seven placeholders per page, their aspect ratios (600 × 480 is 5:4, the 1200 × 720 slots are 5:3, Website Builder's image 7 is 10:7) and whether they zoom or caption.
- **Link behavior:** the "[Link to the repo]" target, the next-project link, and the work cards' links into these pages.
- **Hover states** for the next-project link and the nav.
- **Deliverables inset** (X745 versus 737 = 16px) and the 4px shortfall of the Website Builder frame height.
- **Responsive behavior:** how the staggered pillars, side images and 120px headings collapse.
