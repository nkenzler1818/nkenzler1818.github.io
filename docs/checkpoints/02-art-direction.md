# Checkpoint 2: Art Direction

About page rebuild, step 6. Art director deliverable. Branch `portfolio-flow-redesign`.

Companion artifact: **`docs/checkpoints/style-tile.html`**, viewable at
`http://127.0.0.1:8080/docs/checkpoints/style-tile.html`. That file links the
real `css/style.css`, so every token in it is the token the builder pastes in.
It has been rendered and iterated at 1440px and 375px. Nothing in this document
describes something I have not seen on screen.

---

## 0. Design Read and dials

**Reading this as:** a career-portfolio About page for technical hiring managers
and the recruiters who screen for them, with a dark-tech editorial language,
leaning toward native CSS on the existing static shell plus a single GSAP
ScrollTrigger reveal grammar, with real photography carrying the argument.

Confirmed, unchanged from the working decision.

| Dial | Value | Reasoning |
|---|---|---|
| `DESIGN_VARIANCE` | **7** | Portfolio preset is 8. "Very clean" pulls it to 7. The variance is spent on layout family, not on ornament: ten sections, ten grids, zero decoration. |
| `MOTION_INTENSITY` | **7** | Confirmed. One reveal grammar applied consistently, one pin on the whole page, one load sequence. High intensity spent on pacing, not on effects. |
| `VISUAL_DENSITY` | **3** | Confirmed. 144px between sections at desktop, 1.72 body line height, 66ch measure. Density is the pace control. |

**Eyebrows: zero.** Confirmed, no reason to spend any. The budget would allow 3
across 10 sections. Every heading in the approved copy already names its own
subject, so an eyebrow above it would restate the heading. Keeping zero also
means the mechanical Pre-Flight eyebrow count cannot fail.

---

## 1. The signature idea

**The aperture.**

Every image on this page begins as a closed charcoal panel and opens. Two
shutters the same `#1F1F1F` as the plate meet at the centre line and slide to
the edges under scroll scrub, while the image behind eases from `scale(1.05)` to
`scale(1)`. Nothing but `translateY` and `scale` moves.

It is the page's own thesis performed ten times: a panel comes off and you see
inside. It is also the pace control. An image is not readable until you have
scrolled it open, which produces the deliberate cinematic scroll Nate is buying
without a single line of scroll-jack, without trapping anybody, and without a
scroll listener.

Because the gesture is identical everywhere, its **one variation carries
meaning**. In section 6, the page's only two-image moment, each vault plate gets
a single full-height cover instead of a two-piece iris, and the two covers sweep
in opposite directions: `vault-early` clears upward, `vault-now` clears downward.
The comparison assembles as a matched pair rather than arriving twice. That is
the moment somebody describes to someone else.

Nothing else on the page is allowed to be memorable. Everything around the
aperture is deliberately quiet.

**Why this and not the alternatives.** A scroll-drawn hairline spine down the
left rail was the other candidate. Cut: `taste` 9.F bans hairline grids as
decoration, it encodes nothing true about the content, and it would have been a
second thing competing with the first.

---

## 2. Type system

Plus Jakarta Sans for everything structural. JetBrains Mono for captions, dates,
record meta, and exactly one figure. No third face, no serif.

### The scale, as CSS custom properties

```css
:root {
  /* type */
  --ab-t-display:   clamp(2.50rem, 1.55rem + 3.80vw, 3.75rem);  /* 40 to 60 */
  --ab-t-turn:      clamp(2.00rem, 1.45rem + 2.20vw, 3.25rem);  /* 32 to 52 */
  --ab-t-h2:        clamp(1.75rem, 1.25rem + 2.00vw, 2.50rem);  /* 28 to 40 */
  --ab-t-lede:      clamp(1.125rem, 1.02rem + 0.42vw, 1.3125rem); /* 18 to 21 */
  --ab-t-body:      1.0625rem;   /* 17 */
  --ab-t-card:      1rem;        /* 16 */
  --ab-t-meta:      0.8125rem;   /* 13 */
  --ab-t-cap:       0.75rem;     /* 12 */
}
```

| Role | Size | Weight | Line height | Tracking | Measure | Where |
|---|---|---|---|---|---|---|
| display | 40 to 60 | 600 | 1.08 | -0.028em | 700px hard | section 1 H1, once |
| turn | 32 to 52 | 600 | 1.10 | -0.024em | 22ch, centred | section 8 H2, once |
| h2 | 28 to 40 | 600 | 1.12 | -0.02em | 20ch | sections 2, 3, 5, 6, 7, 9, 10 |
| lede | 18 to 21 | 400 | 1.55 | -0.005em | 46ch | section 1 subhead, section 8 body |
| body | 17 | 400 | 1.72 | 0 | 66ch | all body copy |
| card | 16 | 400 | 1.65 | 0 | 60ch | section 5 build cards |
| record title | 16 | 500 | 1.40 | 0 | 40ch | section 9 degree and role names |
| meta | 13 | 400 | 1.65 | 0 | 60ch | small prose |
| caption | 12 mono | 400 | 1.50 | +0.015em | 60ch | every image caption, record meta, dates |

**Three sizes carry the whole argument.** Display (60) is the thesis. Turn (52)
is the honest self-assessment, and it is the second-largest type on the page
because it is the second most important sentence on the page. Everything else is
h2 (40). The hierarchy is a statement about the content, not a decorative ramp.

`text-wrap: balance` on display, turn, and h2. Verified live: display breaks to
2 lines at 700px and 3 lines at 312px, turn to 1 line, h2 to 2 lines.

`font-variant-numeric: tabular-nums` on all mono.

### Weight ceiling is 600, and this is a real finding

`css/style.css` declares `@font-face` for **400, 500 and 600 only**. It then sets
`h1-h6 { font-weight: 700 }` and `.projects-heading { font-weight: 800 }`. Both
are currently rendering as browser-synthesised faux bold sitewide.
`PlusJakartaSans-Bold.ttf` is already sitting in
`Project Files/Fonts/Plus_Jakarta_Sans/static/`, unused.

Everything in this direction is designed at 600 and looks correct at 600.
Recommendation, in order: add the missing 700 `@font-face` rule (one block, the
file already exists) and leave the rest of the site alone, but keep the About
page at 600 regardless. Do not raise the About page to 700 without the face.

### Type colour

```css
--ab-ink-1: #F5F5F5;                    /* display, turn, h2, record titles     13.0:1 */
--ab-ink-2: rgba(245, 245, 245, 0.82);  /* all body copy                         9.3:1 */
--ab-ink-3: rgba(245, 245, 245, 0.55);  /* captions, record meta                 4.9:1 */
```

Three steps, no fourth. A 38% step lands at 3.2:1 against `#2A2A2A` and fails
AA, so it does not exist as a token. Ratios measured against the page ground.

---

## 3. The accent, and where it is forbidden

The locked accent stays `#c084fc` per the resolved conflict (`taste` 11.C: an
existing brand token that is already purple stays purple). What changes is how
much of it there is.

Sitewide, `style.css` paints **every heading** `#c084fc`. On this page that is
switched off and headings go ink-1. Precedent already exists on the site:
`.projects-heading` is `#f5f5f5`.

**Allowed, four places, and that is the whole list.**

1. Primary button fill `#7c46af` with white text (6.3:1). Section 10 only.
2. Inline text links in body copy: ink-1 with a `rgba(192,132,252,0.45)`
   underline at 1px and 3px offset, going full `#c084fc` on hover and focus.
3. The two SignifyMD figures in section 4, set in JetBrains Mono 500 at
   `#c084fc` (5.4:1). The page's only non-link accent, on the page's quietest
   layout, in the one place the argument needs a spike. The copy doc says the
   number appears once and has to land, so it gets the page's one colour event.
4. The nav pill and the footer headings, which belong to the shell and are not
   mine to change.

**Forbidden.**

- Section headings, display type, turn type, body copy.
- Plate borders, hairlines, captions, dividers, the section 9 column rule.
- Hover glows, outer glows, box shadows tinted purple, any gradient anywhere.
- Any other numeral on the page, including every date in section 9. Section 4's
  figures are accented precisely because nothing else is.

Focus rings are `2px solid #c084fc` at `outline-offset: 3px`. That is an
accessibility affordance, not decoration, and it is exempt.

---

## 4. Surface, hairline, radius

```css
--ab-page:     #2A2A2A;                    /* body ground */
--ab-plate:    #1F1F1F;                    /* image plates, shutters, nav, cards */
--ab-hair:     rgba(255, 255, 255, 0.10);  /* every rule on the page */
--ab-hair-lit: rgba(255, 255, 255, 0.16);  /* hover only */
--ab-r:        0.5rem;                     /* 8px  everything */
--ab-r-inner:  4px;                        /* screenshot inside a screen plate */
```

**Two surfaces, and that is all.** Ground `#2A2A2A` and plate `#1F1F1F`. There
is no third elevation, no tinted section background, no card-inside-a-card. The
`box-shadow: 0 4px 20px rgba(0,0,0,0.3)` that `.project-pane` carries is **not**
used on this page: the plates are recessed windows, not raised cards, and a drop
shadow would contradict that.

**One hairline value.** `1px rgba(255,255,255,0.10)` on plate borders, on the
section 9 column rule, and on the secondary CTA underline. Nowhere else. There
are no section dividers: 144px of ground is the divider.

**One radius: 8px.** Not a new number. It is the radius `.project-pane`,
`.project-card`, `.blog-card`, `.btn-dark-purple`, and `.nav-link` already use,
so the About page's plates and buttons are the same shape as every other page on
the site. The only second radius is 4px on a screenshot nested inside an 8px
plate, which is the correct inner-radius relationship and not a second system.

Shape Consistency Lock: **satisfied by inheritance, not by invention.**

---

## 5. Imagery treatment: the colour-temperature problem

Eleven assets from five light sources: warm kitchen tungsten, cool blue RGB, red
and teal studio gels, a dark IDE, and one light-themed web app. Raw, they do not
read as one page.

They are unified **structurally**, not cosmetically. Every asset sits in the same
plate. The plate then splits into two classes.

### The plate

```css
.ab-plate {
  position: relative;
  overflow: hidden;
  border-radius: var(--ab-r);
  background: var(--ab-plate);
  border: 1px solid var(--ab-hair);
  isolation: isolate;          /* keeps the blend layer inside the plate */
  box-sizing: border-box;
}
.ab-plate > img { display: block; width: 100%; height: 100%; object-fit: cover; }
```

### Photo class, three layers

`pc-motherboard`, `pc-finished`, `k9-studio`, `desk-setup`, `grad-stage`. The
image bleeds to the plate edge.

```css
/* 1. tonal envelope. every photograph lands in the same low brightness
      band as the page, which is what makes a set of photographs a set. */
.ab-plate--photo > img {
  filter: saturate(0.62) contrast(1.12) brightness(0.86);
}

/* 2. temperature lock. one cool slate wash in soft-light pulls warm kitchen
      tungsten down and cool RGB up until they meet in the middle. */
.ab-plate--photo::before {
  content: "";
  position: absolute; inset: 0; z-index: 1;
  pointer-events: none;
  background: #39405A;
  mix-blend-mode: soft-light;
  opacity: 0.50;
}

/* 3. ground weld. a flat 22% of the page's own colour on every image, so
      every image literally contains the page, plus a bottom gradient so
      nothing ends on a hard bright line. Gradient fade, never blur. */
.ab-plate--photo::after {
  content: "";
  position: absolute; inset: 0; z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(to top,    rgba(42, 42, 42, 0.62) 0%, rgba(42, 42, 42, 0) 40%),
    linear-gradient(to bottom, rgba(31, 31, 31, 0.34) 0%, rgba(31, 31, 31, 0) 22%),
    rgba(42, 42, 42, 0.22);
}
```

Paint order inside the plate is img, then `::before`, then `::after`, then the
shutters at `z-index: 3`. Both pseudo-elements are `pointer-events: none`.

This is deliberately **not** a duotone. `k9-studio`'s approved caption names the
red and teal gels, so those hues have to survive. Verified on screen: the
motherboard's warm oak table reads cool grey-brown, the studio red drops to a
muted maroon with the teal rim still legible, and the two now sit in the same
tonal band as each other and as the page.

This is also the reason there is no vignette and no grain. `taste` 6.E is right
that a grain layer over scrolling content costs GPU repaints for nothing, and a
vignette on top of a ground weld would be two devices doing one job.

### Screen class, one structural fix

`rag-app`, `olympus-dashboard`, `craft-vscode`, `vault-early`, `vault-now`. The
image gets an **8px charcoal bezel** and never touches the plate edge.

```css
.ab-plate--screen { padding: 8px; }
.ab-plate--screen > img {
  border-radius: var(--ab-r-inner);
  filter: brightness(0.88) saturate(0.82) contrast(1.03);
}
```

The bezel is the answer, not the filter. A screenshot with charcoal on all four
sides reads as content in a window; a screenshot bleeding to a rounded edge reads
as a hole punched in the page. It also gives the four screenshots a visual class
of their own without needing a fake browser chrome bar, a traffic-light dot row,
or any other device-frame ornament, all of which are Tells.

### The light asset

`rag-app` is a light-themed web app with a teal header. It is the hardest asset
on the page and it needs its own line.

```css
.ab-plate--screen-light > img {
  filter: brightness(0.80) saturate(0.72) contrast(1.04);
}
.ab-plate--screen-light::after {
  content: "";
  position: absolute; inset: 8px; z-index: 2;
  border-radius: var(--ab-r-inner);
  pointer-events: none;
  background: rgba(31, 31, 31, 0.16);
}
```

Paper white goes from `#FFF` to roughly `#B0B0B0`. Inside the screenshot the
contrast ratio between its own dark text and its own background stays above 5:1,
because `filter: brightness()` scales both. It reads as a lit window in a dark
room, which is honest, because that is what it is.

**Because that knock-down costs real legibility on the page's only screenshot of
the capstone, the `rag-app` plate is wired into the existing
`.image-lightbox-overlay` component so the untouched original is one click away.**
That component already exists in `css/style.css`, so this is reuse, not new
surface.

### Framing, crops, and one asset that goes unused

| Asset | Class | Aspect in the plate | Crop note |
|---|---|---|---|
| `pc-motherboard` | photo | 3:4 | native portrait, no crop |
| `pc-finished` | photo | 16:10 | `object-position: 50% 42%`, holds the glass panel through the three fans |
| `k9-studio` | photo | 4:5 | crop in from the native 5:4, keeps the dog centred on the platform |
| `desk-setup` | photo | 21:9 | native ultra-wide, no crop. Its purple deskmat is the one asset whose native colour already agrees with the accent, and it still takes the standard treatment with no exception |
| `vault-early` | screen | 1:1 | crop to a square from the portrait, centred on the sparse node field |
| `vault-now` | screen | 1:1 | crop to a square, centred on the dense sphere. Both must be the same square so the comparison is honest |
| `rag-app` | screen light | 16:9 | native, no crop |
| `olympus-dashboard` | screen | 16:9 | crop in from the native ultra-wide, holds the left rail and the agent cards |
| `craft-vscode` | screen | 4:3 | crop from the native portrait, holds the editor gutter and the CSS |
| `grad-stage` | photo | 21:9 | the source already carries letterbox bars; crop inside them so no black bar survives |
| `k9-night` | **unused** | | Held in reserve and staying there. Section 3 is the only place it fits, and using it would make section 3 a two-image section. Section 6 has to be the page's only two-image moment or the signature stops being a signature. |

Every `<img>` ships `width`, `height`, and
`srcset="…-sm.webp 800w, ….webp 1600w"` with a real `sizes`. The hero image gets
`fetchpriority="high"`; everything below the fold gets `loading="lazy"`.
Dimensions are mandatory, both for CLS and because ScrollTrigger computes
positions from layout.

**No captions or labels are ever overlaid on an image.** Captions sit outside the
plate, 14px below it, in mono ink-3. Alt text is the approved alt text from the
copy doc, verbatim.

---

## 6. Spacing and vertical rhythm

8px base. Section padding is the pace control.

```css
--ab-sect:   clamp(5rem, 3rem + 6vw, 9rem);   /* 80 to 144 */
--ab-col:    864px;                            /* max-w-4xl, the text column */
--ab-wide:   min(1120px, 100vw - 2rem);        /* the breakout */
--ab-narrow: 620px;                            /* section 4 */
--ab-mid:    700px;                            /* section 8 */
```

| Gap | Value |
|---|---|
| between sections | `--ab-sect`, 144px at desktop |
| around sections 4 and 8 | `calc(var(--ab-sect) * 1.35)`, 194px. The two breath points get the two biggest gaps, so the pace is set by space before any motion touches it |
| display to lede | 28px |
| h2 to body | 20px |
| paragraph to paragraph | 20px |
| text block to plate | 40px |
| plate to caption | 14px |
| record item to record item | 22px |

**Column breakouts.** Sections 2, 4, 5 text, 6, 8, 9, 10 hold `--ab-col` or
narrower. Sections 1, 3, 5's lead artifact, and 7 break to `--ab-wide`.

**One deliberate revision to the approved wireframe.** The wireframe puts
section 1 in `--ab-col` at `1.15fr / .85fr`, which gives the display type a
447px measure. Verified in the browser: the H1 needs 700px to break in two lines
at 60px, and would otherwise need to drop to 52px, at which point it is no longer
the largest type on the page. Section 1 therefore breaks to `--ab-wide` with
`grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr)` and a 3.5rem gap,
giving roughly 700px of type against a 364px portrait. Flow, hierarchy, and
layout family are unchanged.

---

## 7. Buttons and links

One button on the page. Everything else is a link, so there is no ambiguity
about which action is the action.

| Rank | Style | Label |
|---|---|---|
| Primary | `#7c46af` fill, white 600, 8px radius, `0.9rem 1.5rem`, `:active { translateY(1px) }` | `See the work` |
| Secondary | ghost link, ink-2, 1px hairline underline, goes ink-1 with an accent underline on hover | `Read the resume` |
| Tertiary | inline link, ink-1 with a 45% accent underline | `Email me` |

All three labels are three words or fewer and cannot wrap at any width.
`touch-action: manipulation` on all interactive elements. Focus is
`2px solid #c084fc` at 3px offset, never `outline: none`.

---

## 8. What this direction explicitly refuses

- No gradients, no glows, no glassmorphism, no `backdrop-filter` anywhere. The
  vault ruling stands: separation is a solid gradient fade into the page colour.
- No `mask-image`. The vault ruling stands: it stops clipping cleanly once a
  transform promotes an element to its own layer.
- No grain, no noise, no vignette, no scanlines, no fake device chrome.
- No eyebrows, no section numbers, no decorative dots, no middle dots, no locale
  or time strips, no scroll cues, no version stamps.
- No generated imagery. Nate's call, and every texture in this direction is
  either a real photograph or a CSS filter, blend, or gradient.
- No em-dashes, including in CSS comments and alt text.
- No third surface, no fourth ink, no second radius system, no second accent.

---

## 9. Findings the builder or Nate needs to act on

1. **Faux bold, sitewide.** `h1-h6 { font-weight: 700 }` and
   `.projects-heading { font-weight: 800 }` have no matching `@font-face`. The
   Bold TTF is already on disk. Add the 700 face, or accept synthesised bold on
   the other pages. The About page is designed at 600 either way.
2. **Duplicate CTA intent between section 10 and the shell footer.** Section 10
   closes with `Email me`; the footer's Misc column says `Get in Touch`. Same
   intent, two labels, roughly one screen apart. The copy is approved and the
   footer is the shell, so I am not changing either unilaterally. Recommendation:
   change the footer link text to `Email me`. One word, no structural change.
3. **`k9-night` is not used.** Reason given in section 5. If Nate wants it on the
   page, the honest place is the Projects page photography work, not here.
4. **`rag-app` legibility.** The knock-down is the right call for the page, but
   it does cost detail on the capstone screenshot. The lightbox wiring is the
   mitigation and should not be treated as optional.
5. **The copy needs no visual rewrites.** Every approved line fits the type
   system at its assigned size and measure. Nothing was cut, softened, or
   re-broken. The only copy-adjacent request is finding 2 above, which is footer
   text and outside the approved copy doc.
