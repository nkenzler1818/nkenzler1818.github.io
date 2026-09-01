# Checkpoint 3: Storyboard

About page rebuild, step 7. Art director deliverable. Branch `portfolio-flow-redesign`.

Reads on top of `02-art-direction.md` (tokens, plate system, imagery treatment)
and `wireframe.html` (approved layout families). Copy is quoted from
`01-message-and-copy.md` and is **not** rewritten anywhere in this document.

---

## Part 1: The motion layer, once

Everything in Part 2 assumes this. Read it first.

### Libraries, pinned

```html
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/ScrollTrigger.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/ScrollSmoother.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/SplitText.min.js"></script>
<script defer src="../js/about-scroll.js"></script>
```

Exact version pinned on all four. `defer`, in that order. SplitText is used on
three headings only.

### ScrollSmoother

**Yes, used. Desktop only.**

```js
ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.1,             // the controlled pace, in seconds of catch-up
  smoothTouch: false,      // never smooth on touch
  effects: false,          // no data-speed parallax anywhere on this page
  normalizeScroll: false,  // do not take over the scroll input
  ignoreMobileResize: true
});
```

Created only when `window.innerWidth > 820` and `prefers-reduced-motion` is not
`reduce`.

`smooth: 1.1` is the whole "slightly slowed page scroll" ask. Higher reads as
lag; lower is not felt.

**Why this does not trap anyone.** ScrollSmoother keeps a real native scrollbar
and a real `window.scrollY`; it sets a real body height and transforms
`#smooth-content`. Page Down, Page Up, Space, Home, End, arrow keys, the
scrollbar, trackpad, and `#hash` anchors all behave normally. `effects: false`
and `normalizeScroll: false` mean it never intercepts the input event. There is
no infinite scroll and no scroll-jack anywhere on the page.

**DOM requirement.** `#smooth-wrapper > #smooth-content` wraps `<main>` and the
`<footer>` only. The fixed `<nav>` and `.nav-scroll-blur` stay **outside** the
wrapper so they keep their `position: fixed` behaviour.

**The existing nav scroll listener keeps working, unchanged.** It reads
`window.scrollY`, which ScrollSmoother leaves real. This is the one permitted
`window.addEventListener("scroll")` on the site, per the resolved conflict. The
motion layer in this storyboard adds **zero** new scroll listeners: ScrollTrigger
only.

### The reveal grammar: the aperture

Applied identically to every plate on the page except where a section below says
otherwise. Described once here, referenced by name after that.

```html
<figure class="ab-fig">
  <div class="ab-plate ab-plate--photo" style="aspect-ratio: 3/4">
    <img src="…" alt="…" width="1600" height="2133"
         srcset="…-sm.webp 800w, ….webp 1600w" sizes="…" loading="lazy">
    <span class="ab-ap ab-ap-t" aria-hidden="true"></span>
    <span class="ab-ap ab-ap-b" aria-hidden="true"></span>
  </div>
  <figcaption class="ab-cap">…</figcaption>
</figure>
```

```css
.ab-ap { position: absolute; left: -1px; right: -1px; z-index: 3;
         background: var(--ab-plate); pointer-events: none; }
.ab-ap-t { top: -1px;    height: calc(50% + 1px); transform: translateY(-101%); }
.ab-ap-b { bottom: -1px; height: calc(50% + 1px); transform: translateY(101%); }

/* CLOSED is the armed state only. */
html.ab-armed .ab-ap-t,
html.ab-armed .ab-ap-b { transform: translateY(0); }
```

Default CSS state is **open**. Closed exists only while `html.ab-armed` is set.

Standard scrubbed envelope, desktop:

| | |
|---|---|
| trigger | the `.ab-plate` element |
| start | `"top 85%"` |
| end | `"top 45%"` |
| scrub | `1` |
| pin | no |
| animates | `.ab-ap-t` `yPercent: 0 -> -101`; `.ab-ap-b` `yPercent: 0 -> 101`; `img` `scale: 1.05 -> 1` |
| ease | `none` (scrubbed) |

**One-sentence justification, stated once and true for every instance:** this is
the page's single reveal grammar, and applying it uniformly is what makes ten
different sections read as one document instead of ten effects, while the scrub
window is what stops an image being readable until the reader has actually
arrived at it.

Per-section deviations from this envelope are justified individually below.

### The pre-paint guard

Inline in `<head>`, **before** the Tailwind CDN `<script>`, matching the proven
`nav-pill-pending` pattern already in `pages/about.html`.

```html
<script>
  // Arm the aperture before first paint. Never paint-then-hide.
  (function () {
    try {
      if (window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var d = document.documentElement;
      d.classList.add("ab-armed");
      setTimeout(function () { d.classList.remove("ab-armed"); }, 2000);
    } catch (e) {}
  })();
</script>
```

`about-scroll.js` sets the shutters inline with `gsap.set()` in its first
statement, then removes `ab-armed`. Inline transforms beat the class rule, so
there is no double-handling.

**Three properties of this guard that matter.**

1. It hides no text, ever. It only closes image shutters and the section 1
   heading mask. If the guard fires and GSAP never loads, the page is fully
   readable for those 2000ms, just image-free, and then every image appears.
2. The 2000ms timeout is a hard backstop. A failed, blocked, or slow CDN cannot
   leave anything permanently invisible.
3. It arms at every width, including mobile, so no plate is ever painted and then
   retroactively covered.

### Section 1's heading mask

```css
.ab-line-wrap { overflow: hidden; }                    /* set by SplitText */
html.ab-armed .ab-split-hero .ab-line { opacity: 0; }  /* hero only */
```

Only the section 1 heading is masked pre-paint, because it is the only heading
above the fold. Sections 4 and 8 are split and set by GSAP at init, below the
fold, where there is nothing to flash.

### Global ScrollTrigger config

```js
ScrollTrigger.config({ ignoreMobileResize: true });   // iOS address bar
ScrollTrigger.normalizeScroll(false);
window.addEventListener("load", () => ScrollTrigger.refresh());
```

Every trigger is created inside a `gsap.matchMedia()` context so the desktop set
is torn down and rebuilt correctly on a resize across 820px. Reduced motion is a
matchMedia condition, so under `reduce` **no triggers are created at all**.

### Section-to-section transition logic

**There is none, on purpose.** No cross-fades between sections, no colour shifts,
no theme flips, no section-level enter animations. Sections are separated by
144px of page ground and nothing else. Pace comes from three things and only
three: ScrollSmoother's 1.1s catch-up, the aperture scrub windows, and the
section padding, which widens to 194px around the two type-only breath points.

**`scroll-snap` is explicitly rejected.** Snap plus a pin plus ScrollSmoother is
a three-way fight over the same scroll position, and snapping a 10-section
editorial page is exactly the trap the brief bans. Also rejected: horizontal
pan, sticky-stack, and `data-speed` parallax.

### Reduced motion, the whole policy in one rule

**The CSS default state is the finished page, and the reduced-motion end state is
the CSS default state.**

Under `prefers-reduced-motion: reduce`: the guard returns early so `ab-armed` is
never set; ScrollSmoother is never created; no ScrollTrigger is ever created; no
SplitText runs. Every shutter is already parked off-frame by its default rule,
every image is at `scale(1)`, every heading and paragraph is at full opacity, and
section 6 is a plain unpinned two-up grid. Nothing needs an override block,
nothing can be left mid-animation, and there is no state the page can reach where
content is hidden.

Per-section reduced-motion end states are still listed in Part 2, so the builder
can verify each one rather than trusting the rule.

### Mobile, 820px and below

| | |
|---|---|
| ScrollSmoother | not created |
| pins | none. Section 6 unpins and stacks |
| apertures | discrete, not scrubbed: `start: "top 88%"`, `duration: 0.65`, `ease: "power3.out"`, `once: true` |
| SplitText reveals | kept, discrete, `duration: 0.7`, `stagger: 0.07` |
| section padding | 80px, the clamp low end |
| wide breakouts | `100vw - 2rem` |
| images | `-sm.webp` via `srcset` |

**Why scrub goes away on touch.** A scrubbed tween tied to a flick with native
momentum reads as lag, not as control. The discrete tween respects the reader's
own pace, which is the point of the whole direction.

Every multi-column grid collapses explicitly, per section, below. No layout
relies on "Tailwind will handle it."

---

## Part 2: Section by section

### 1. Open

**Layout.** `--ab-wide` (1120px). `grid-template-columns: minmax(0, 1.9fr)
minmax(0, 1fr)`, `gap: 3.5rem`, `align-items: center`. Roughly 700px of type on
the left, a 364px wide 3:4 portrait plate on the right. Layout family:
asymmetric split. This is the one deliberate revision to the wireframe, reasoned
in `02-art-direction.md` section 6.

**Copy.**

> H1 (display, 60px, 2 lines at 700px, verified):
> **I learn how things work by taking them apart.**
>
> Subhead (lede, 21px, 46ch):
> Marketing grad student at Arizona. It used to be robotics kits and PCs. Now it
> is retrieval pipelines and agent systems. The work I get paid for is the part
> right after: explaining the thing to the people who have to act on it.

**Asset.** `pc-motherboard`, photo class, 3:4, no crop, `fetchpriority="high"`,
not lazy.

> Caption: ROG Crosshair X870E, still in the tray. Manual open on the iPad,
> build video running on the laptop. I had not done this before.

**Scroll behaviour.** None. Section 1 animates **on load**, not on scroll, and
carries no ScrollTrigger.

| | |
|---|---|
| trigger | page load, `gsap.timeline()` fired after `gsap.set()` of the armed state |
| start / end | not applicable |
| pin | no |
| scrub | no, discrete timeline |
| t=0.00 | H1 SplitText by lines, each line `yPercent: 108 -> 0`, `opacity: 0 -> 1`, `stagger: 0.09`, `duration: 0.9`, `ease: "expo.out"` |
| t=0.15 | `.ab-ap-t` `yPercent: 0 -> -101` and `.ab-ap-b` `yPercent: 0 -> 101`, `duration: 1.1`, `ease: "power3.inOut"`; `img` `scale: 1.06 -> 1`, `duration: 1.4` |
| t=0.55 | subhead and caption `opacity: 0 -> 1`, `y: 12 -> 0`, `duration: 0.7`, `ease: "power2.out"` |

**Justification.** Storytelling: the load sequence states the thesis line first
and then opens the plate, which teaches the reader what a plate does before any
scrolling has happened, so every later aperture reads as the same gesture rather
than as a surprise.

**Reduced-motion end state.** H1 at full opacity, unsplit, 2 lines. Plate open,
image at `scale(1)`. Subhead and caption visible. Identical to the animated end
state.

**Mobile.** Single column. H1 first at 40px, 3 lines. Subhead below. Plate below
that at 4:3 instead of 3:4 so it does not eat the viewport. Load sequence runs
with `duration` values scaled to 0.7.

---

### 2. The habit

**Layout.** `--ab-col` (864px). Heading, then body, then one wide plate below the
text at `--ab-wide`. Layout family: type block over a wide image.

**Copy.**

> H2 (40px): **Same habit, better parts.**
>
> VEX robotics in high school. My first PC in pieces on a table. Camera rigs I
> built because the shot I wanted did not have a mount for it. My dad is an
> engineer and never once told me to stop opening things.
>
> None of it was a career plan. It was how I liked spending a Saturday. The
> habit is what carried over: get the thing in front of me, find out how it
> works, then find out what it is good for.

**Asset.** `pc-finished`, photo class, 16:10, `object-position: 50% 42%` so the
crop holds the glass panel down through the three fans.

> Caption: Same machine, done. HYTE Y70, RTX 5080 Astral, radiator mounted on the side.

**Scroll behaviour.** Standard aperture, no deviation.

| | |
|---|---|
| trigger | `.s2 .ab-plate` |
| start / end | `"top 85%"` / `"top 45%"` |
| pin | no |
| scrub | `1` |
| animates | shutters `yPercent 0 -> ∓101`, img `scale 1.05 -> 1` |
| heading and body | no animation |

**Justification.** Storytelling: the section argues "same habit, better parts,"
so the finished machine should not be sitting on screen while the reader is still
reading about the pieces.

**Reduced-motion end state.** Plate open, image `scale(1)`, all text visible.

**Mobile.** Single column, plate at `100vw - 2rem`, discrete aperture.

---

### 3. The other half

**Layout.** `--ab-wide`. `grid-template-columns: 0.8fr 1.2fr`, `gap: 3rem`,
`align-items: start`. Plate on the **left**, breaking toward the left edge of the
wide container; heading and the page's longest body block on the right at a 66ch
measure. Layout family: image to the edge, text holds the column. This is the
mirror of section 1's split, which is why sections 1 and 3 are separated by
section 2's full-width family (zigzag cap respected: never three consecutive
image-plus-text splits).

**Copy.**

> H2 (40px): **Then somebody has to understand it.**
>
> Every job I have had was a people job first.
>
> At Bay Area K9 I was the resident handler and ran the operations around it:
> scheduling, client communications, the facility, and how we showed up at
> industry expos. I gave input on positioning and made the content while the
> business was still deciding what it was. I also shot the photography, which is
> where most of the work on my projects page comes from.
>
> At VASA I managed 27 client accounts at peak and wrote every progress report
> myself. That job taught me the thing I use most, which is that a chart nobody
> understands is worth nothing. I rewrote performance data into narratives people
> could follow, then proposed digitizing the documentation. Leadership bought
> tablets for every trainer and rolled it out club wide.

Note: "27" here is **not** accented. Section 4's two figures are the page's only
accented numerals, per the accent law.

**Asset.** `k9-studio`, photo class, 4:5, cropped in from the native 5:4 to keep
the dog centred on the platform. `k9-night` stays unused, reasoned in
`02-art-direction.md` section 5.

> Caption: Bay Area K9. Red and teal gels, and a dog who held the position long enough.

**Scroll behaviour.** Standard aperture, no deviation. `start: "top 82%"`,
`end: "top 42%"` (three points earlier than standard, because the plate is
top-aligned in a tall section and the standard window would finish before the
adjacent text has been read).

**Justification.** Hierarchy: the page's single reveal grammar, with a slightly
earlier window so the portrait finishes opening at the same moment the reader
reaches the paragraph that names it.

**Reduced-motion end state.** Plate open, `scale(1)`, all text visible.

**Mobile.** Single column, plate ordered **first** (`order: -1`), matching the
approved wireframe, at 4:3. Discrete aperture.

---

### 4. Where it met

**Layout.** `--ab-narrow` (620px), centred, no image. Section padding
`calc(var(--ab-sect) * 1.35)` = 194px. Layout family: narrow type, breath point
one, at the page's one-third mark.

**Copy.**

> H2 (40px): **The first time both halves showed up in one job.**
>
> I joined SignifyMD in March 2026 as their marketing and digital communications
> intern. They represent oncology physicians, and my main account is a pair of
> them with a real audience.
>
> Two things happened at once. On the marketing side I worked on brand presence,
> wrote and reviewed site content, and ran usability and SEO testing that fed the
> relaunch of both the corporate site and the physician site. On the other side,
> ASCO was coming and the outreach list did not exist, so I built one. A scraper
> plus targeted research, to find and qualify oncology professionals worth
> contacting.
>
> That list produced **600** verified leads and converted **280** of them into
> event registrations. Before that, the building and the marketing were two
> separate interests. Here they were the same job.

`600` and `280` are wrapped in `<span class="ab-num">`, set in JetBrains Mono
500 at `#c084fc` with `font-variant-numeric: tabular-nums`. This is the page's
only non-link use of the accent.

**Asset.** None. This is one of two deliberate type-only sections.

**Scroll behaviour.**

| | |
|---|---|
| trigger | `.s4` |
| start / end | `"top 78%"` / discrete, no end |
| pin | no |
| scrub | no, `once: true` |
| H2 | SplitText by lines inside `overflow: hidden` wrappers, `yPercent: 108 -> 0`, `opacity: 0 -> 1`, `stagger: 0.08`, `duration: 0.85`, `ease: "expo.out"` |
| body | `opacity: 0 -> 1`, `y: 14 -> 0`, `duration: 0.7`, `delay: 0.25`, `ease: "power2.out"` |
| the two figures | **no animation.** Cut deliberately. The mono and the accent already do the work, and animating them would be motion for show |

**Justification.** Storytelling: section 4 has no image, so the heading arriving
line by line is the only thing that gives a type-only section a moment, and it
tells the reader this sentence is the pivot the page has been building to.

**Reduced-motion end state.** Heading unsplit and fully visible, body at full
opacity, figures accented and static. Nothing moves.

**Mobile.** Same layout at `100vw - 2rem`. Split reveal kept, shortened.

---

### 5. The builds

**Layout.** `--ab-col` for text. One lead artifact breaking to `--ab-wide`, then
a 2-up pair back inside `--ab-col`. Three items, three cells, no empty cell.
Layout family: lead artifact plus pair.

```
[ h2 ]
[ intro line ]
                                                   <- 40px
[========== rag-app, 16:9, --ab-wide ==========]
[ card 1 title + meta + body, --ab-col ]
                                                   <- 56px
[ olympus, 4:3 ] [ craft-vscode, 4:3 ]             <- gap 1.75rem
[ card 2 text  ] [ card 3 text        ]
```

**Copy.**

> H2 (40px): **Things I built to find out if I could.**
>
> Intro line (lede, 21px): One of these was assigned. I do not think you learn
> where AI helps by reading about it.
>
> **Agentic Pharmacovigilance RAG** / Graduate capstone, May 2026
> A retrieval system over FDA adverse event data that routes a question to one of
> four strategies depending on what the question actually is. 17,313 records,
> 373 drugs, LangChain and ChromaDB underneath, guardrails on the input and the
> output, a Gradio front end. Group project, and I was the marketing student on a
> team of MIS majors. I built the interface. The reason I can describe the rest
> of it is that I made myself follow how it worked.
>
> **Project Olympus** / Personal, ongoing
> Ten agents with defined jobs, running on NVIDIA NIM inference, with a Supabase
> vector store, a React dashboard, and a two-way sync into my notes. It plans and
> it proposes, and it does not get to act until I approve. Most of what I know
> about where these systems break, I learned here.
>
> **nathanaelkenzler.org** / Personal, ongoing
> Static HTML, one stylesheet, no build step, no framework. I write the CSS by
> hand with an assistant open next to me. The page you are on is the current
> draft.

Card titles at 16px/500 ink-1. The `Graduate capstone, May 2026` line is mono
12px ink-3. Card body at `--ab-t-card` 16px, 60ch. No card surface, no border,
no box: the plate above it is the container, and the text sits on the page
ground. This is `taste` 4.4, group with space rather than with a card.

**Assets.**
- Lead: `rag-app`, **screen-light class**, 16:9, native. Wired to
  `.image-lightbox-overlay` so the untreated original is one click away.
- Pair left: `olympus-dashboard`, screen class, 4:3, cropped in from the native
  ultra-wide to hold the left rail and the agent cards.
- Pair right: `craft-vscode`, screen class, 4:3, cropped from the native portrait
  to hold the editor gutter and the CSS.

**Scroll behaviour. No pin.** Three apertures with offset triggers.

| | lead | pair left | pair right |
|---|---|---|---|
| trigger | `.s5-lead .ab-plate` | `.s5-pair-a .ab-plate` | `.s5-pair-b .ab-plate` |
| start | `"top 88%"` | `"top 88%"` | `"top 84%"` |
| end | `"top 40%"` | `"top 44%"` | `"top 40%"` |
| pin | no | no | no |
| scrub | `1` | `1` | `1` |
| animates | shutters, img `scale 1.05 -> 1` | same | same |

The 4-point trigger offset on the right-hand plate is the stagger. It is done
with a trigger position, not a JS delay, so it stays correct at every scroll
speed and direction.

**Justification.** Hierarchy: the pair is read left then right, and the offset
trigger says so without adding a second animation type.

**Why section 5 does not pin, having considered it.** The section's content at
864px is well over one viewport tall, and pinning a section taller than the
viewport is the classic ScrollTrigger mistake. More importantly the three builds
are a sequence read top to bottom, not a simultaneous comparison, so a pin would
add scroll distance without adding meaning. The whole page therefore has exactly
**one** pin, at section 6, which is what makes section 6 unmistakably the
signature moment.

**Reduced-motion end state.** All three plates open, images at `scale(1)`, all
text visible, laid out exactly as above.

**Mobile.** Lead plate at `100vw - 2rem`. The pair collapses to a single column,
`olympus` above `craft-vscode`, both 4:3. Three discrete apertures at
`"top 88%"`, no offset.

---

### 6. The unglamorous one, the signature moment

**Layout.** `--ab-col`. A pinned stage containing the heading and a
`grid-template-columns: 1fr 1fr` pair of 1:1 plates at `gap: 1.5rem`, roughly
420px square each. Body copy sits **below** the stage and is not pinned. Layout
family: side-by-side comparison, the only one on the page.

```
+-- .s6-stage (pinned) --------------------------+
| [ h2 ]                                          |
| [ vault-early 1:1 ]  [ vault-now 1:1 ]          |
| [ "Early on." ]      [ "Today." ]               |
+-------------------------------------------------+
[ body copy, --ab-col, never pinned, never animated ]
```

Stage height at 864px: roughly 670px, comfortably inside one viewport under the
floating nav. This is what makes the pin legitimate.

**Copy.**

> H2 (40px): **The unglamorous one.**
>
> Caption left: Early on.
> Caption right: Today.
>
> Same vault, months apart. It is a knowledge base I keep for myself: every
> project, every decision, everything I got wrong and what fixed it. Over three
> hundred notes now, and the links between them are the part that matters.
>
> No client asked for it and it will never be a portfolio piece. It is the thing
> I would point at if you asked whether I stay with something after the novelty
> wears off.

**Assets.** `vault-early` and `vault-now`, screen class, **both cropped to the
same 1:1 square**. A before-and-after where the two frames are different shapes
is not a comparison, so this crop is not negotiable.

**Scroll behaviour. The page's only pin, and the aperture's only variation.**

Each plate here carries **one full-height cover** instead of the two-piece iris,
and the two covers sweep in opposite directions.

```css
.s6 .ab-ap-full { position: absolute; inset: -1px; z-index: 3;
                  background: var(--ab-plate); pointer-events: none; }
.s6-a .ab-ap-full { transform: translateY(-101%); }  /* default open, exits up */
.s6-b .ab-ap-full { transform: translateY(101%); }   /* default open, exits down */
html.ab-armed .s6 .ab-ap-full { transform: translateY(0); }
```

| | |
|---|---|
| trigger | `.s6-stage` |
| start | `"center center"` |
| end | `"+=90%"` |
| pin | **yes**, `pin: true`, `pinSpacing: true`, `anticipatePin: 1`, `invalidateOnRefresh: true` |
| scrub | `1` |

Scrubbed timeline across the pinned window:

| progress | what moves |
|---|---|
| 0.00 to 0.50 | `.s6-a .ab-ap-full` `yPercent: 0 -> -101`; `.s6-a img` `scale: 1.05 -> 1` |
| 0.30 to 0.80 | `.s6-b .ab-ap-full` `yPercent: 0 -> 101`; `.s6-b img` `scale: 1.05 -> 1` |
| 0.55 to 1.00 | both captions `opacity: 0 -> 1` |

**Justification.** Storytelling: a before-and-after that scrolls past one frame
at a time is not a comparison, and the pin is the only thing that puts both
states on screen at once so the second arrives against the first.

**Justification for the variation.** Storytelling: the mirrored single-cover
sweep is the page's one departure from its own grammar, and it is spent on the
page's one comparison, so the gesture itself says "these two belong to each
other."

**Reduced-motion end state.** No pin created. `.s6-stage` is a plain, static
two-up grid: heading visible, both covers parked off-frame, both images at
`scale(1)`, both captions at `opacity: 1`, body copy below. Nothing is mid-sweep
and nothing is off-screen.

**Mobile.** **No pin.** The pair stacks to a single column, `vault-early` above
`vault-now`, both still 1:1 and still the same crop. Each takes the standard
two-piece iris as a discrete tween at `"top 88%"`. The comparison degrades to a
vertical before-and-after, which still reads, because the two squares are
identical in size and the captions still label them. The mirrored sweep is a
desktop-only enhancement and its absence costs nothing structural.

---

### 7. Including this one

**Layout.** `--ab-wide`. One 21:9 plate at full breakout width, then heading and
body below inside `--ab-col`. Layout family: full-bleed wide image over type.

**Copy.**

> H2 (40px): **Including this one.**
>
> That is this page, open in the editor and in two browsers at once, at whatever
> hour I decided the spacing was wrong. If you want to know whether I can build a
> digital thing worth looking at, this is the work sample.

**Asset.** `desk-setup`, photo class, 21:9, native, no crop. The one asset whose
native colour already agrees with the accent (the purple deskmat), and it still
takes the standard photo treatment with no exception.

No caption. The heading and body directly below are the caption, and adding a
mono caption as well would be a third text element doing a job that is already
done.

**Scroll behaviour.** Standard aperture with a widened window.

| | |
|---|---|
| trigger | `.s7 .ab-plate` |
| start / end | `"top 90%"` / `"top 38%"` |
| pin | no |
| scrub | `1` |
| animates | shutters `yPercent 0 -> ∓101`, img `scale 1.05 -> 1` |

**Justification.** Hierarchy: the plate is only 480px tall at 21:9, so the
standard window would open it almost instantly; the widened window gives the
page's widest image the same felt duration as its tall ones.

**Reduced-motion end state.** Plate open, `scale(1)`, all text visible.

**Mobile.** Plate at `100vw - 2rem`, aspect relaxed to 16:9 so the desk is
legible at 343px. Discrete aperture.

---

### 8. Where I actually am

**Layout.** `--ab-mid` (700px), centred, no image. Section padding
`calc(var(--ab-sect) * 1.35)` = 194px. Layout family: large centred type, breath
point two, at the page's three-quarter mark.

Centring is justified three ways: the approved wireframe specifies it, the
register is manifesto, and `taste` 4.3's own override permits a centred
composition when the message is the design.

**Copy.**

> H2 (turn scale, 52px, the page's second-largest type):
> **Where I actually am.**
>
> Body at lede scale (21px), not 17px:
>
> I am not going to tell you I market technical products. I am a graduate student
> who spent the last year building these systems himself, so that when I sit in a
> room with people who build them for a living, I can follow the conversation and
> be useful in it.
>
> What I can tell you is what I do when I do not know something, which is take it
> apart. That has worked on a motherboard, a client roster, an adverse event
> database, and a conference campaign. I expect it keeps working.
>
> I graduate in December 2026.

The size step is the whole point. This section is the copy doc's most important
moment, so it is the only place other than section 1 that gets type above 40px,
and the only place body copy is set at 21px.

**Asset.** None. Second deliberate type-only section.

**Scroll behaviour.**

| | |
|---|---|
| trigger | `.s8` |
| start | `"top 76%"` |
| pin | no |
| scrub | no, `once: true` |
| H2 | SplitText by lines, `yPercent: 108 -> 0`, `opacity: 0 -> 1`, `stagger: 0.09`, `duration: 0.9`, `ease: "expo.out"` |
| body | `opacity: 0 -> 1`, `y: 14 -> 0`, `stagger: 0.14`, `duration: 0.7`, `delay: 0.3`, `ease: "power2.out"` |

**Justification.** Storytelling: this is the page's turn, and letting the
sentence assemble line by line, then the three paragraphs arrive in order, is
what makes it read as a considered statement rather than a caption.

**Reduced-motion end state.** Heading unsplit and fully visible, all three
paragraphs at full opacity. Nothing moves.

**Mobile.** Same layout at `100vw - 2rem`. H2 at 32px, body at 18px. Split reveal
kept, shortened.

---

### 9. The record

**Layout.** `--ab-col`. `grid-template-columns: 1fr 1fr`, `gap: 0 3rem`, with a
single `1px` hairline on the left edge of the second column and `padding-left:
3rem`. Education left, work right, with the `grad-stage` plate at the foot of the
right column. Layout family: colophon.

**No boxes, no cards, no per-row borders.** Record items are separated by 22px of
space only. The one hairline is the column split, which is structural. This is
the direct replacement for v1's four grey boxes, and it is the lightest block on
the page because it confirms rather than argues.

**Copy.**

> H2 (40px): **The record.**
>
> Education
> **M.S. Marketing**, focus on analytics and AI
> University of Arizona, Eller College of Management. Expected December 2026. Dean's List.
>
> **B.S. Business Administration**
> University of Arizona, 2025. Dean's List. Phi Theta Kappa tuition scholarship.
>
> **A.A. Economics, A.A. Economics for Transfer, A.A. Liberal Arts and Sciences**
> Santa Barbara City College, 2023. Phi Theta Kappa. President's Honor Roll.
>
> **Bellarmine College Preparatory**
> Santa Clara, 2021.
>
> Work
> **Marketing and Digital Communications Intern**, SignifyMD. 2026 to present.
> **Personal Trainer and Member Experience Specialist**, VASA Fitness. 2023 to 2025.
> **Resident Handler and Operations Assistant**, Bay Area K9 Association. 2021 to 2023.
>
> First in my family to do any of this.

Titles at 16px/500 ink-1. Every institution, date, and honour line is mono 12px
ink-3 with tabular numerals. `Education` and `Work` are the section's only two
small labels; they are column headers inside a two-column record, not eyebrows
above section headings, so the eyebrow count stays at zero. The closing line sits
full width under both columns at `--ab-t-meta` ink-2, separated by 32px.

**Asset.** `grad-stage`, photo class, 21:9, cropped inside the source's existing
letterbox bars so no black bar survives. Small, in the right column only.

> Caption: Eller, 2025.

**Scroll behaviour.**

| | |
|---|---|
| trigger | `.s9` |
| start | `"top 82%"` |
| pin | no |
| scrub | no, `once: true` |
| record items | `opacity: 0 -> 1`, `y: 10 -> 0`, `stagger: 0.045`, `duration: 0.5`, `ease: "power2.out"` |
| `grad-stage` plate | standard two-piece aperture, but discrete: `duration: 0.8`, `ease: "power3.out"`, `once: true`, `delay: 0.3` |

**Justification.** Hierarchy: the least important section on the page gets the
lightest and fastest motion, so it confirms the record without asking for
attention, and the plate drops its scrub because a small supporting image does
not earn a scroll window.

**Reduced-motion end state.** All record items at full opacity, plate open,
image at `scale(1)`.

**Mobile.** Single column. The hairline moves from the left edge of the second
block to a `border-top` above it with 32px of padding. Education above work,
`grad-stage` last. Discrete reveal, same values.

---

### 10. Close

**Layout.** `--ab-col`, centred. Layout family: centred close with one action.

**Copy.**

> H2 (40px): **If any of that is useful.**
>
> The projects page has the work itself, with the parts that did not go well left
> in. The resume is one page. My email is at the bottom and I answer it.

**Actions.**

| Rank | Style | Label | Destination |
|---|---|---|---|
| Primary | `#7c46af` fill, white 600, 8px radius | `See the work` | `projects.html` |
| Secondary | ghost link, hairline underline, arrow glyph | `Read the resume` | `assets/docs/Kenzler_CV2026.pdf` |
| Tertiary | inline link, accent underline | `Email me` | `mailto:nkenzler@arizona.edu` |

All three sit in one row at desktop with `gap: 1.75rem`, wrapping to a column
below 560px. Every label is three words or fewer and cannot wrap at any width.

**Asset.** None.

**Scroll behaviour.**

| | |
|---|---|
| trigger | `.s10` |
| start | `"top 80%"` |
| pin | no |
| scrub | no, `once: true` |
| animates | heading, body, and the action row: `opacity: 0 -> 1`, `y: 16 -> 0`, `stagger: 0.09`, `duration: 0.6`, `ease: "power2.out"` |

**Justification.** Feedback: the page's one action arrives as a single settled
group, a fraction after the sentence that sets it up, so there is no moment where
the reader sees three competing links before they see which one is primary.

**Reduced-motion end state.** Everything at full opacity and in place.

**Mobile.** Actions stack to a full-width column, primary first, `gap: 1.25rem`.

---

## Part 3: The full scroll technique table

| # | Section | Layout family | Asset | Pin | Scrub | Technique |
|---|---|---|---|---|---|---|
| 1 | Open | asymmetric split | `pc-motherboard` | no | no | load timeline: SplitText lines, then aperture, then lede |
| 2 | The habit | type over wide image | `pc-finished` | no | `1` | aperture, standard window |
| 3 | The other half | image to edge, text holds column | `k9-studio` | no | `1` | aperture, window shifted 3 points earlier |
| 4 | Where it met | narrow type, breath point | none | no | no | SplitText heading, discrete, `once` |
| 5 | The builds | lead artifact plus pair | `rag-app`, `olympus-dashboard`, `craft-vscode` | no | `1` | three apertures, right-hand plate triggered 4 points later |
| 6 | The unglamorous one | side-by-side comparison | `vault-early`, `vault-now` | **yes** | `1` | **the page's only pin.** Mirrored single-cover sweep plus caption fade |
| 7 | Including this one | full-bleed wide image | `desk-setup` | no | `1` | aperture, widened window |
| 8 | Where I actually am | large centred type, breath point | none | no | no | SplitText heading plus paragraph stagger, discrete, `once` |
| 9 | The record | colophon | `grad-stage` | no | no | item stagger plus one discrete aperture |
| 10 | Close | centred close | none | no | no | one grouped rise, `once` |

Ten sections, ten layout families, zero repeats. One pin. Two type-only breath
points at the one-third and three-quarter marks. One aperture variation, spent on
the one comparison.

---

## Part 4: `taste` section 14 Pre-Flight, run against this direction

Every box below was checked against the art direction and this storyboard.

**Ticked.** Brief inference declared. Dials explicit and reasoned. Aesthetic
labelled honestly, no design system claimed. Redesign mode detected (full
rebuild, content and IA preserved from the approved copy doc). Zero em-dashes
anywhere including CSS comments and alt text. Page Theme Lock, one dark theme,
no section flips. Colour Consistency Lock, one accent with an explicit four-place
allow list. Shape Consistency Lock, one 8px radius inherited from
`.project-pane`. Button contrast, 6.3:1 white on `#7c46af`. No CTA label wraps.
No serif. Not a premium-consumer brief. No italic display type, so no descender
clearance issue. Hero fits the viewport with no CTA in it. Hero stack is three
elements: H1, subhead, plate. Eyebrow count zero against a budget of three.
Split-header ban respected, every section stacks headline over body. Zigzag cap
respected, sections 1 and 3 are separated by section 2's full-width family. Logo
wall not applicable. Bento not applicable. Copy self-audit: the copy is approved
and unaltered, and I read every visible string in the tile. Motion motivated,
one justification per animation. Zero marquees. Navigation is the untouched
shell, one line, 64 to 72px. Ten layout families across ten sections. Long lists:
section 9 uses a two-column colophon, not a `divide-y` list, and has no per-row
borders. Real images throughout, eleven real photographs and screenshots, no
generated imagery, no div-based fake screenshots, no hand-rolled decorative SVG.
No pills or labels overlaid on images. No decorative photo-credit captions, every
caption is approved factual copy. No version footers, no micro-meta sentences, no
hero decoration strip, no floating top-right sub-text, no filled progress tracks,
no locale or weather strips, no scroll cues, no version labels, no section-number
eyebrows, no decorative dots. Content density within the copy doc's Apple-derived
budget. No testimonials. Motion claimed equals motion shown. The one pin follows
the 5.A pattern discipline (`pin: true`, `invalidateOnRefresh`, a stage shorter
than the viewport). Zero new `window.addEventListener("scroll")`. Reduced motion
handled by a rule that makes the default state the finished state. Mobile
collapse declared explicitly per section. `useEffect` cleanup not applicable
(vanilla JS), but `gsap.matchMedia()` provides the equivalent teardown. Icons:
none introduced. One design system.

**Cannot tick, three of them.**

1. **"Dark mode tokens defined and tested in both modes."**
   Cannot tick, and will not be fixed. Dark only is an explicit instruction and
   the Page Theme Lock holds. Recorded as a knowing deviation, per the resolved
   conflict.

2. **"No AI Tells: AI-purple."**
   Cannot tick as written. The accent is `#c084fc`. It is an existing sitewide
   brand token, retained under `taste` 11.C, and this direction reduces its
   footprint on the About page from every heading to four enumerated places.
   Recorded as a knowing deviation, per the resolved conflict.

3. **"No duplicate CTA intent."**
   Cannot honestly tick. Section 10's `Email me` and the shell footer's
   `Get in Touch` are the same intent about one screen apart. The copy is
   approved and the footer is the shell, so I am not changing either
   unilaterally. Recommended fix, one word: change the footer link text to
   `Email me`. Flagged in `02-art-direction.md` section 9.

**One further box that is only conditionally ticked.**

4. **"Core Web Vitals plausibly hit."**
   LCP and CLS are fine: the hero image is `fetchpriority="high"`, every image
   carries explicit dimensions and a `srcset`, and no layout depends on JS
   measurement. The caveat is that this page adds four pinned CDN scripts to a
   site that previously shipped almost no JavaScript. GSAP core plus
   ScrollTrigger plus ScrollSmoother plus SplitText is roughly 120KB gzipped.
   All four are `defer`, none blocks first paint, and the guard's 2000ms backstop
   means a slow CDN degrades to a complete static page rather than a broken one.
   Worth a Lighthouse run at build time rather than an assumption now.
