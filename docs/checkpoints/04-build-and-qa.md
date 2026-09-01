# Checkpoint 4: The built page, and what needs your word

About page rebuild, steps 8 to 11. Branch `portfolio-flow-redesign`.
**Nothing is pushed. `main` is untouched.**

Run `python -m http.server 8080 --bind 127.0.0.1` from the repo root, then open
`http://127.0.0.1:8080/pages/about.html`.

---

## Read this part first: seven things that need your decision

Everything below this section is reference. These seven are the ones only you can
settle. Each is a small edit, and I have said where.

### 1. The capstone scope claim (the important one)

Your vault contradicts itself about the pharmacovigilance RAG:

- `projects/pharmacovigilance-rag/MEMORY.md:19` says "Nate's role: lead architect
  and code implementation."
- `projects/pharmacovigilance-rag/MEMORY.md:23` says "Only cell 35 (Gradio UI) was
  authored by Nate; cells 0 to 34 are the group's architecture."

The first draft of the copy said "I led the architecture and built the interface."
I took the narrower reading, because a cell-level audit is more specific than a
role label, and because scope honesty is this page's entire argument. The card now
reads:

> Group project, and I was the marketing student on a team of MIS majors. I built
> the interface. The reason I can describe the rest of it is that I made myself
> follow how it worked.

I think this is a **better** line than the architecture claim. It cannot collapse
in an interview, and it is the translator positioning stated as fact instead of
asserted. But if the truth is genuinely broader, tell me and I will restore it.
Section 5, card 1.

### 2. Naming NVIDIA on the page

The Project Olympus card says it runs on "NVIDIA NIM inference." The brief says the
target employer is never named. I kept it, reading it as a stack fact rather than
positioning: it is true, it is visible in your own dashboard screenshot, and it is
the highest-signal detail on the page for a technical reader while staying neutral
for everyone else. **One word to cut if you disagree.** Section 5, card 2.

### 3. The line admitting AI assistance

> I write the CSS by hand with an assistant open next to me.

Honest, and it defuses the "does he actually code" question before it is asked.
It is also the kind of thing you might not want stated. Section 5, card 3.

### 4. The About page no longer has an "About Me" title

Every other page opens with the 72px page title. This one opens with the thesis
line as the H1. That is deliberate: v1 was scrapped partly for stacking a near-72px
thesis under a 72px "About Me," and the copy is written so the H1 *is* the thesis.
It does mean About now differs from its siblings. Worth a look at whether that
reads as intentional or as a missing title.

### 5. The footer says "Get in Touch," the page says "my email is at the bottom"

The art director flagged duplicate CTA intent between the page's `Email me` and the
footer's `Get in Touch`. Since you said the footer stays untouched, I fixed it by
removing the page's email link instead. The copy still says "My email is at the
bottom and I answer it," which now points at a link labelled `Get in Touch`. It
reads fine. Relabelling the footer link to `Email me` would close it completely,
and that is a one-word footer change I did not make without asking.

### 6. Three graduation photos, one used

`grad-stage` (crossing the Eller stage) is on the page in the record section.
`IMG_0680` (with family) and `IMG_1124` (the arena) are converted and sitting in
`images/about/` unused. Also unused: `k9-night`. The art director's call was that
one K9 photo does the job and the second belongs on the Projects page instead.

### 7. The 47 percent is not on the page

The copy says the list produced 600 verified leads and converted 280. It does not
state the 47 percent, on the grounds that 280 of 600 is legible and stating it adds
a metrics-deck flavour. Say the word and it goes back in. Section 4.

---

## What was built

Ten sections, ten distinct layout families, no repeats and no two consecutive
image-plus-text splits.

| # | Section | Layout family | Asset |
|---|---|---|---|
| 1 | Open | asymmetric split | `pc-motherboard` |
| 2 | The habit | type then wide image | `pc-finished` |
| 3 | The other half | image to the edge | `k9-studio` |
| 4 | Where it met | pure type, narrow. breath point | none |
| 5 | The builds | lead artifact plus a pair | `rag-app`, `olympus-dashboard`, `craft-vscode` |
| 6 | The unglamorous one | side by side, pinned. **signature** | `vault-early` + `vault-now` |
| 7 | Including this one | full bleed wide | `desk-setup` |
| 8 | Where I actually am | pure type, centred. breath point | none |
| 9 | The record | colophon | `grad-stage` |
| 10 | Close | centred, one action | none |

### The signature: the aperture

Every image begins as a closed charcoal panel and opens. Two shutters the same
`#1F1F1F` as the plate slide to the edges under scroll scrub while the image eases
from `scale(1.05)` to `scale(1)`.

It performs the page's own thesis, a panel comes off and you see inside, and it
doubles as the pace control: an image is not readable until you have scrolled it
open. That is the controlled scroll you asked for, with no scroll-jack, nothing
trapped, and not one scroll listener added.

Its **one variation carries the meaning.** Section 6, the vault before and after,
is the page's only pinned moment and its only two-image moment. Each plate gets a
single full-height cover instead of the two-piece iris, and the two sweep in
opposite directions with a 0.3 lag, so the comparison assembles as a matched pair
rather than arriving twice.

### Reduced motion

This is the part of the build I would defend hardest. It is architectural, not an
override block.

**The CSS default state is the finished page.** The only two hiding rules in the
entire About block are gated behind `html.ab-armed`, which is set by a pre-paint
guard that returns early under `reduce`. `js/about-motion.js` returns before it
creates a single object and disarms on the way out.

The consequence: under reduced motion there is no ScrollSmoother, no ScrollTrigger,
no SplitText, no pin, and **no reachable state where content is hidden.** The same
path runs if any GSAP file fails to load, so a blocked CDN degrades to a complete
static page rather than a broken one. There is a 2000ms timeout behind that as a
second backstop.

---

## What I verified myself, in a browser

Not from the diff. The builder reported its own pass; this is my independent one.

- **1440px.** Hero renders correctly, apertures reach their open state (shutters
  parked off-frame at plus and minus 247px), section 6 pin holds and releases,
  imagery treatment successfully unifies eleven assets that came from warm kitchen
  light, blue RGB, red and teal gels, and a light web app.
- **375px.** No horizontal overflow (`scrollWidth === clientWidth === 360`), no
  ScrollSmoother, zero pins, 13 discrete triggers, every grid collapsed. The one
  over-wide `<img>` is the intentional `grad-stage` crop, clipped by its plate.
- **Reduced motion**, verified structurally: only two hiding rules exist in the
  CSS and both are gated; the JS early-returns before any GSAP call.
- **Console:** zero errors on every page. The only output is Tailwind's standing
  "should not be used in production" CDN warning, which predates this work.
- **Regression across the other five pages** after the sitewide nav, font, and
  footer changes: Home, Projects, Blog, Uses, Photography all render correctly.
  The Projects carousel and its edge fades are intact.

---

## Two bugs found and fixed along the way

**Your whole site was rendering faux bold.** `h1-h6` asks for `font-weight: 700`
and `.projects-heading` asks for `800`, but no `@font-face` above 600 had ever been
declared, so every browser was synthesising it. `PlusJakartaSans-Bold.ttf` and
`-ExtraBold.ttf` were already on disk, unused. Both faces are now declared. Every
page's headings render properly now, which is visible immediately on the Projects
title.

**The storyboard's hero mask would not have worked.** It specified
`html.ab-armed .ab-split-hero .ab-line { opacity: 0 }`, but `.ab-line` does not
exist until SplitText runs, so the H1 would have painted and then flashed out,
which is exactly the failure your vault ruling forbids. The builder caught it and
masked the container instead. Same intent, actually pre-paint.

---

## Known and deliberate

- **Dark only.** By your instruction. `taste` calls this a fail; the locked palette
  overrides it.
- **The accent is `#c084fc`**, which is the "AI-purple" `taste` bans. It is an
  existing sitewide brand token, retained under that skill's own redesign
  protocol. The page confines it to four enumerated places.
- **No `.glb`, no `<model-viewer>`.** The placeholder was a 49.8 MB abandoned-house
  model. Now that real HYTE Y70 photography exists, shipping 50 MB of a building to
  represent your PC would be worse than the photo. The hardware figure is
  structured so a viewer can replace the image later with no layout change, and
  there is an HTML comment marking the spot.
- **No generated imagery.** Your call. Every texture is a real photograph or a CSS
  filter, blend, or gradient.
- **`pc-finished.webp` is 1100px** and the wide plate renders at 1120px, so it
  upscales very slightly above 1440px. Not visible at normal viewing distance. A
  wider export from the source video would fix it.
- **Dead CSS.** The `.journey-*` timeline block (roughly 85 lines around line 1124)
  is no longer referenced by any page, since it belonged to the old About layout. I
  left it rather than delete CSS you did not ask me to touch. Safe to remove.

---

## Second QA pass (05:30, closing the gaps above)

Everything in this section was done after the build report was first written.

### Reduced motion, now proven rather than inferred

Last night I verified this structurally, by reading the CSS and JS. This pass ran
it for real with the browser emulating `prefers-reduced-motion: reduce`:

- `ab-armed` never appears on `<html>`
- ScrollSmoother not created, **0 ScrollTriggers, 0 pins**
- **zero shutter overlap across all 10 plates**, measured geometrically
- zero elements below full opacity, zero images parked mid-scale
- document height drops to 8648px from 9815px, exactly the pin's contribution

The page is complete, static, correctly laid out, and nothing is hidden.

### 320px, which had not been tested

Clean. No horizontal overflow (`scrollWidth === clientWidth === 305`), no text
below 11px, nav at 72px, both CTAs on one line. The only element extending past
the viewport is the intentional `grad-stage` crop, clipped by its plate.

### End-state verification at 320, 375 and 1440

Rather than trusting animation timing, every timeline was forced to completion and
the result measured. At all three widths: **nothing left hidden, zero shutter
overlap on any of the 10 plates.**

### One real fix: focus rings were invisible sitewide

Tabbing through the page, the nav and footer links fell back to Chrome's default
focus ring, which it draws in near-black (`rgb(16,16,16)`). Against `#2A2A2A` and
`#1F1F1F` that is effectively invisible, so a keyboard user could not tell where
they were. That is a **WCAG 2.4.7 failure**, it predates this rebuild, and it
affected all six pages.

Fixed with one additive block in `css/style.css`: `a`, `button`, and `[tabindex]`
get a 2px `--accent-purple` outline on `:focus-visible` only, so it never appears
on mouse clicks. Verified on About, Home, and Projects. Components that already
had their own ring were already using the same accent, so nothing changed for them.

### Keyboard and semantics

- Tab order is logical: nav, then page controls, then footer. **No trap**, focus
  cycles back to the start.
- Heading outline is correct: one H1, then H2 per section, with the three build
  cards as H3 nested under section 5's H2. No skipped levels.
- One each of `main`, `nav`, `header`, `footer`. `lang="en"`.
- **Zero images missing alt, zero empty alt.** Nine figcaptions.

### A testing note worth keeping

The headless browser runs `requestAnimationFrame` at **2fps**. GSAP is
frame-driven, so tweens appear to crawl and can look stalled. I briefly mistook
that for a bug in the hero reveal. It is not: forcing timelines to their end state
shows correct results everywhere. **Animation timing cannot be judged in this
environment, only end states can.** The same applies to full-page screenshots,
where lazy-loaded images below the fold render as empty boxes even though they
load correctly when actually scrolled to.

## Still not done

- **Lighthouse.** The page adds roughly 120KB gzipped of deferred GSAP to a site
  that previously shipped almost no JS. LCP and CLS are structurally sound (hero is
  `fetchpriority="high"`, every image has explicit dimensions and `aspect-ratio`),
  but the number is unmeasured. The 2fps headless environment makes a local run
  meaningless anyway; this wants a real browser.
- **Cross-browser.** Chromium only. No Safari available on this machine.
- **Screen reader.** Semantics, alt text, heading order, and landmarks are all
  verified correct, but no actual assistive-technology pass was run.
- **`.project-pane` focus on the Projects page** did not pick up a visible ring in
  one probe. It has its own `:focus-visible` rule already and is outside this
  page's scope, but it is worth a look sometime.
