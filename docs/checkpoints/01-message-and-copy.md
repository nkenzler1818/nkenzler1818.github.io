# Checkpoint 1: Message Architecture and Copy

About page rebuild, Phase A (steps 1 to 4). Narrative architect deliverable.
Branch `portfolio-flow-redesign`. Nothing here is built yet.

**The through-line, in one sentence:**
I learn how things work by taking them apart, and the job I get paid for is what
happens next, explaining the thing to the people who have to act on it.

Read the copy in section 4. Sections 1 to 3 are the reasoning behind it. Every
open question and unsourced claim is collected in section 6 at the end.

---

## Orchestrator fact-check: four corrections applied

I verified every unsourced claim against the vault and the CV before letting this
feed the art director. Four things changed. **Nate should look hardest at the first
one**, because only he knows the truth of it.

**1. The capstone scope claim was walked back.** The copy said "I led the
architecture and built the interface." The vault contradicts itself here:
`projects/pharmacovigilance-rag/MEMORY.md:19` says "Nate's role: lead architect and
code implementation," but line 23 of the same file says "**Only cell 35 (Gradio UI)
was authored by Nate; cells 0 to 34 are the group's architecture.**" A cell-level
audit is far more specific than a role label, so I took the narrower reading. The
card now says he was the marketing student on a team of MIS majors, that he built
the interface, and that he can describe the rest because he made himself follow how
it worked. That is a **better** line for the translator positioning than an
architecture claim, and it cannot collapse in an interview. If the truth is
genuinely broader than cell 35, say so and I will restore it.

**2. "Around a thousand notes" was wrong.** The vault holds **332 markdown notes**
(653 files total). The graph screenshot shows roughly a thousand *nodes*, but in
Obsidian's graph view the smaller outer dots are unresolved links, not notes. Copy
now reads "over three hundred notes," and the alt text was corrected to match.

**3. The camera claim was softened.** "Cameras I hardwired because I wanted to know
what the sensor was doing" had no source behind it. The backed fact is camera rigs
he built. Rewritten to that.

**3b. "Months apart" sharpened to "three months apart."** The two vault screenshots
are dated 2026-05-26 and 2026-08-31, which is 97 days. The specific number is the
stronger line and it is sourced from the filenames.

**4. Verified and kept:** 17,313 records and 373 drugs (both confirmed in
`projects/pharmacovigilance-rag/MEMORY.md:57`), 600 leads and 280 registrations,
27 VASA accounts, all degrees and dates. **NVIDIA NIM stays in the Olympus card**:
it is a true stack fact, visible in his own dashboard screenshot, not a wink at the
target employer.

---

## 1. Discovery brief

### Audience

**Primary.** An early-career recruiter or hiring manager for partner marketing,
developer marketing, or digital marketing at a technical company. They screen a
lot of new-graduate marketers. They are looking for the one who will not need
hand-holding on the technical side and will not embarrass anyone in front of a
partner. They are not named on the page.

**Secondary.** Anyone technical who ends up here from LinkedIn or the resume QR
code. They will smell an over-claim in one sentence, and they will judge the page
itself before they judge the writing.

**Tertiary, and worth designing for.** Nate himself in three months, sending this
link cold. If a section makes him wince, it fails.

### What that audience is skeptical about

Four real objections. The page's whole structure exists to answer them in order.

1. **"Grad student with one internship. Has he shipped anything, or is this all
   coursework?"** This is the default assumption and the page has to break it
   early. Answer: artifacts with dates and scope, not adjectives.
2. **"Everyone says they use AI now."** The market is saturated with people who
   have a ChatGPT tab open and call it AI fluency. Answer: a routed retrieval
   system over a real regulated dataset, an agent system with an approval gate he
   built because an agent lied to him once, and a knowledge base he has kept for
   months. Duration and specificity are the differentiators, not vocabulary.
3. **"The technical stuff is a hobby. Can he do the marketing job?"** Writing,
   campaigns, stakeholders, partners, and clients. This is the objection the
   rejected v1 walked straight into by leading with AI. Answer: the people work
   is older than the AI work and gets equal page weight. 27 client accounts, a
   process change adopted club wide, brand advice to a business still deciding
   what it was.
4. **"Marketer who codes usually means mediocre at both."** The generalist tax.
   Answer: refuse the composite claim. Do not say "I market technical products."
   Say what is true, name where he actually is, and let the reader do the
   extrapolation. A candidate who states his own ceiling accurately reads as
   lower risk than one who does not.

There is a fifth objection nobody voices: **is the page any good.** For someone
selling digital-marketing and digital-asset skill, the page is the work sample.
That is a design problem, not a copy problem, but the copy should acknowledge it
once, on purpose (see the "Including this one" section).

### The one action

**Open the Projects page.**

The resume is the takeaway, not the decision. A recruiter downloads the PDF once
they already want it. The About page's job is to create that want, and the
evidence lives on Projects. So Projects is the primary CTA at the close and the
only one styled as a button.

The resume link stays visible and persistent for the recruiter who is in a hurry
and skipping to the end, and email closes it out. Three actions, one hierarchy,
no ambiguity about which is which.

### Tone

Direct, first person, grounded. Short declaratives mixed with longer ones. Dry
where it can be. No adjectives doing work that a fact could do. Confident about
the habit, honest about the level. Not salesy, not stiff, not clever for its own
sake.

The register to aim at: a smart person telling you something true over coffee,
who is not trying to close you.

Explicit bans: em-dashes anywhere, invented numbers, "passionate about,"
"leveraging," "bridge builder," "at the intersection of," "driving impact," any
sentence that would work equally well on someone else's page.

### What "this worked" looks like

- A technical reader gets to the footer without flagging a single sentence as an
  over-claim.
- A recruiter can state Nate's positioning back in one line, and it is the
  through-line above, not a job title.
- The SignifyMD number appears once and lands harder than it did appearing three
  times.
- Nate reads it and does not wince.
- Behaviorally: the About page becomes the top referrer to Projects, and the
  resume gets opened after Projects rather than instead of it.

---

## 2. Research and references

Six references I opened and read this session, then a set of gallery leads for
the art director to browse live. Design-gallery sites are JavaScript rendered and
return little to a fetch, so I have marked what is verified and what is a lead.

### Verified references

**1. stephsmith.io** (verified)
A marketer who is now at NVIDIA, previously Groq, The Hustle, a16z.
The closest living analogue to where Nate is aiming.
- **Borrow:** credibility built from varied evidence types rather than one metric
  repeated. She stacks a publication logo wall, embedded podcast appearances, and
  quantified project results, and no single one carries the page. That variety is
  exactly the fix for v1's "one SignifyMD project holding up everything."
- **Borrow:** the photo grid that humanizes without derailing the argument. It
  sits in its own band and does not leak into the professional sections. Nate's
  K9 photography and PC build should be handled the same way, in their own bands
  with their own job.
- **Borrow:** project cards with a one-line description. No paragraph per project.
- **Avoid:** the density and the dropdown-heavy navigation. She has a decade of
  proof modules. Importing that structure onto one internship would over-claim by
  layout alone.
- **Avoid:** the newsletter capture before the footer. Nate has nothing to sign
  up for, and a fake one would read as a template.

**2. brianlovin.com/about** (verified)
Designer and engineer, Notion, previously GitHub and Facebook.
- **Borrow:** the whole bio is roughly 150 words. Brevity reads as confidence.
  One line per role, reverse chronological, no adjectives.
- **Borrow:** credibility through trajectory and specifics ("GitHub acquired my
  first startup") rather than claimed traits.
- **Avoid, and this is the important one:** copying the text-only approach. Brian
  can name Notion and GitHub and be done. Nate has no logo prestige to lean on
  yet, so where Brian names, Nate has to **show**. Structural implication for the
  art director: Nate's page must be image-led in exactly the places where Brian's
  is name-led.

**3. rauno.me/craft** (verified)
Design engineer at Vercel. A chronological wall of artifacts.
- **Borrow:** artifacts with a date and a link and no narrative explanation. This
  is the model for Nate's builds section. Do not sell the project, show it.
- **Borrow:** alternating aspect ratios so the grid has rhythm instead of a
  metronome of equal cards.
- **Borrow:** restraint over animation. The page reads as craft because nothing
  is trying to prove it is craft.
- **Avoid:** the total absence of context. Rauno is known. Nate is not, so each
  artifact needs one honest sentence of scope, especially where a project was a
  group effort. Silence on scope reads as a claim.

**4. linear.app/method** (verified)
- **Borrow:** the pacing model for Nate's type-only sections. One dominant
  heading, uniform body sizing, generous vertical rhythm that sets reading speed
  through spacing rather than through motion.
- **Borrow:** no decorative imagery inside the content column. If an image is
  there, it is doing a job.
- **Avoid:** importing the imagelessness wholesale. Linear is a document. Nate's
  argument is carried by pictures of real things, so use this only for the two or
  three sections that are deliberately type-only.

**5. nvidia.github.io/elements (NVIDIA Elements design system)** (verified)
- **Borrow:** the four-tier text taxonomy, display / heading / body / label, and
  the relative line-height tiers that scale with font size. A clean way to
  structure the type scale without inventing one.
- **Avoid:** the color system entirely. Do not touch NVIDIA green (`#76b900`).
  Palette stays locked at `#2A2A2A` body, `#1F1F1F` surfaces, `#c084fc` accent.

**6. apple.com/macbook-pro** (verified, for pacing not for style)
- **Borrow:** the word-count discipline. Headlines run 2 to 5 words. Hero copy
  around 15 words. Feature sections 40 to 100. Deep-dive sections 80 to 150. That
  is a usable budget per section and it is roughly what the copy below holds to.
- **Borrow:** rhythm shifts. Punchy headline, then a dense block, then a fragment.
  Never three sections of the same weight in a row.
- **Borrow:** roughly 60 percent visual to 40 percent text.
- **Avoid:** the number presentation. Apple stacks superlatives and comparative
  multipliers, which is the exact register v1 died on. Nate has one number and it
  appears once, in prose, without a multiplier.
- **Avoid:** the aspirational register ("bring your imagination to life").

### Gallery leads for the art director

These need a live browser. Filters and named entries given so nobody starts cold.

- **godly.website**. The right gallery for this brief. Curated small, ships two
  to three sites a week, and leans restrained and editorial with considered type
  scales and real whitespace rather than interaction gimmicks. Start here.
- **siteinspire.com/websites/category/portfolio**. Filter on the Typographic,
  Minimal, and Grid Layout tags. Currently featured and worth opening:
  `antinomy.studio`, `ulyssesdesanti.com`, `otherkind.design`,
  `jakubjakubik.com`, `bymonolog.com`, `jordandrobson.com`.
  **Avoid** the agency-scale showreel hero on several of these. One person cannot
  support a showreel and attempting it reads as borrowed.
- **onepagelove.com/genre/portfolio**. The correct **scale** reference, since
  these are single-person sites rather than studios. Currently featured:
  Justin Lerner, Samuel Räikkönen, Tiffany Devos, Ayush Halder, Tiago Fragoso.
- **land-book.com/design/portfolio**. Blocks automated fetching, open manually.
- **maxibestof.one/websites/editorial**. Editorial category, for grid discipline
  and type scale.
- **bestfolios.com**. Returned nothing to a fetch, open live. Useful for the
  new-grad and early-career scale specifically.
- **Awwwards**. Use last and sparingly. Its bias toward heavy interaction is the
  opposite of the "very clean" effect in the brief.

### The one mechanic to steal, if only one

From Rauno and Apple together: **let the artifact be the argument, and give each
artifact enough room that the reader finishes looking before the next thing
arrives.** That is the whole fix for v1. v1 asserted in paragraphs. This page
shows a motherboard in pieces, then the same machine finished, then a graph with
forty nodes, then the same graph with a thousand.

---

## 3. Message architecture

### The belief ladder

What the visitor believes by the footer, in the order they come to believe it.
The order is argumentative, not chronological, and it is built so that each rung
makes the next one credible.

| # | Belief | Section that earns it |
|---|---|---|
| 1 | This is a specific person, not a template. | Open |
| 2 | The curiosity is old and it is not performed for an employer. | The habit |
| 3 | He can handle people, and he was doing that before he was doing any of this. | The other half |
| 4 | The two halves already met once, in paid work, and produced a result. | Where it met |
| 5 | He builds, and he is honest about the scope of what he built. | The builds |
| 6 | He does not quit when a thing stops being new. | The unglamorous one |
| 7 | The page I am reading is itself the evidence. | Including this one |
| 8 | He knows exactly where he is and is not overselling, so I can trust rungs 1 to 7. | Where I actually am |
| 9 | The paperwork checks out. | The record |
| 10 | I want to see the projects. | Close |

**Why rung 8 goes late.** The honest self-assessment is the highest-value moment
on the page, and it only works after the evidence. Placed early it reads as an
apology. Placed at the end it reads as a person who did not need to oversell,
and it retroactively validates everything above it. This is the single structural
fix for the "you are coming in too strong" problem, and it costs nothing.

**Why rung 3 sits before rung 5.** v1 led with the building and the page became
an AI story. Putting the client and operations work before the builds forces the
reader to meet a person who manages relationships before they meet a person who
writes Python, which is the correct order for a marketing hire.

**Why the number lives in rung 4 and nowhere else.** In rung 4 the number is the
proof of a specific argument, that the technical work and the marketing work
produced a single outcome together. Anywhere else it is decoration. In the hero
it is noise, which is what Nate said.

### Section list with one-line jobs

| # | Section | On-page heading | Job (one line) | Primary asset |
|---|---|---|---|---|
| 1 | Open | I learn how things work by taking them apart. | State the habit the whole page rests on, with zero claims attached. | `pc-motherboard` |
| 2 | The habit | Same habit, better parts. | Prove the curiosity predates the career and is not a positioning exercise. | `pc-finished` |
| 3 | The other half | Then somebody has to understand it. | Give the interpersonal and marketing work equal weight, and earlier weight. | `k9-studio` |
| 4 | Where it met | The first time both halves showed up in one job. | Spend the SignifyMD number, once, where it proves convergence. | none (type only) |
| 5 | The builds | Things I built to find out if I could. | Show three artifacts with dated, honest scope. | `rag-app`, `olympus-dashboard`, `craft-vscode` |
| 6 | The unglamorous one | The unglamorous one. | Prove persistence, which no single project can. | `vault-early` + `vault-now` |
| 7 | Including this one | Including this one. | Collapse claim and evidence: the page is the work sample. | `desk-setup` |
| 8 | Where I am | Where I actually am. | State the ceiling accurately and make the reader trust everything above. | none (type only) |
| 9 | The record | The record. | Let credentials confirm, not argue. Compressed, never four grey boxes. | `grad-stage` |
| 10 | Close | If any of that is useful. | Move them to Projects. | none |

Assets held in reserve: `k9-night` (an alternate or a second frame in a
photography pair for section 3).

### Pacing note for the art director

Sections 4 and 8 are deliberately type-only. They are the two breath points, and
they are placed at the one-third and three-quarter marks so the page is not an
unbroken run of image bands. Section 6 is the only two-image comparison on the
page, which is what makes it read as a signature moment rather than a pattern.

---

## 4. Copy

Everything below is final copy, run through `stop-slop`. No em-dashes. Where I
have given alternates, option A is my recommendation.

### Meta

**Title:** `About - Nathanael Kenzler`

**Meta description:**
> I am Nathanael Kenzler, a marketing grad student at Arizona. I learn how
> technical systems work by building them, then explain them to the people who
> have to act on them.

---

### 1. Open

**H1 (option A, recommended):**
> I learn how things work by taking them apart.

*Option B:* `Take it apart first.` Shorter and more graphic for a large type
treatment, but it drops the first person, which is the voice the rest of the page
is written in.
*Option C:* `I have always needed to see the inside of things.` Warmer, less
useful as a positioning line.

**Subhead:**
> Marketing grad student at Arizona. It used to be robotics kits and PCs. Now it
> is retrieval pipelines and agent systems. The work I get paid for is the part
> right after: explaining the thing to the people who have to act on it.

**Image caption (`pc-motherboard`):**
> ROG Crosshair X870E, still in the tray. Manual open on the iPad, build video
> running on the laptop. I had not done this before.

**Alt text (`pc-motherboard`):**
> An ROG Crosshair X870E motherboard sitting in its packaging tray on a wooden
> kitchen table, with the printed manual open on an iPad and a build video
> playing on a MacBook beside it.

---

### 2. The habit

**H2:**
> Same habit, better parts.

**Body:**
> VEX robotics in high school. My first PC in pieces on a table. Camera rigs I
> built because the shot I wanted did not have a mount for it. My dad is an
> engineer and never once told me to stop opening things.
>
> None of it was a career plan. It was how I liked spending a Saturday. The habit
> is what carried over: get the thing in front of me, find out how it works, then
> find out what it is good for.

**Image caption (`pc-finished`):**
> Same machine, done. HYTE Y70, RTX 5080 Astral, radiator mounted on the side.

**Alt text (`pc-finished`):**
> A finished custom PC in a HYTE Y70 case with RGB lighting, an RTX 5080 Astral
> graphics card, and a side mounted radiator.

---

### 3. The other half

**H2:**
> Then somebody has to understand it.

**Body:**
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

**Image caption (`k9-studio`):**
> Bay Area K9. Red and teal gels, and a dog who held the position long enough.

**Alt text (`k9-studio`):**
> A studio portrait of a black working dog lying on a white PVC platform, lit
> with red and teal gels against a dark backdrop.

**Alt text (`k9-night`, if the art director pairs the two):**
> A working dog photographed at night beside a lit tree, the dog in silhouette
> against warm light.

---

### 4. Where it met

**H2:**
> The first time both halves showed up in one job.

**Body:**
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
> That list produced 600 verified leads and converted 280 of them into event
> registrations. Before that, the building and the marketing were two separate
> interests. Here they were the same job.

*Note: this is the only place the SignifyMD numbers appear anywhere on the page.
The 47 percent is deliberately left for the reader to do, because stating it adds
a metric-deck flavor the page does not want.*

---

### 5. The builds

**H2:**
> Things I built to find out if I could.

**Intro line:**
> One of these was assigned. I do not think you learn where AI helps by reading
> about it.

**Card 1**
> **Agentic Pharmacovigilance RAG**
> Graduate capstone, May 2026
>
> A retrieval system over FDA adverse event data that routes a question to one of
> four strategies depending on what the question actually is. 17,313 records,
> 373 drugs, LangChain and ChromaDB underneath, guardrails on the input and the
> output, a Gradio front end. Group project, and I was the marketing student on a
> team of MIS majors. I built the interface. The reason I can describe the rest of
> it is that I made myself follow how it worked.

**Alt text (`rag-app`):**
> The Gradio interface of the pharmacovigilance RAG app, showing a query box, a
> sidebar listing the drugs covered, and a routed answer.

**Card 2**
> **Project Olympus**
> Personal, ongoing
>
> Ten agents with defined jobs, running on NVIDIA NIM inference, with a Supabase
> vector store, a React dashboard, and a two-way sync into my notes. It plans and
> it proposes, and it does not get to act until I approve. Most of what I know
> about where these systems break, I learned here.

**Alt text (`olympus-dashboard`):**
> The Project Olympus dashboard in dark UI, showing agent status cards and a task
> board.

**Card 3**
> **nathanaelkenzler.org**
> Personal, ongoing
>
> Static HTML, one stylesheet, no build step, no framework. I write the CSS by
> hand with an assistant open next to me. The page you are on is the current
> draft.

**Alt text (`craft-vscode`):**
> VS Code open on this site's stylesheet, with the CSS for the about page
> visible.

---

### 6. The unglamorous one

**H2:**
> The unglamorous one.

**Body:**
> Same vault, three months apart. It is a knowledge base I keep for myself:
> every project, every decision, everything I got wrong and what fixed it. Over
> three hundred notes now, and the links between them are the part that matters.
>
> No client asked for it and it will never be a portfolio piece. It is the thing
> I would point at if you asked whether I stay with something after the novelty
> wears off.

**Caption (`vault-early`):**
> Early on.

**Caption (`vault-now`):**
> Today.

**Alt text (`vault-early`):**
> An Obsidian graph view showing a small scattering of loosely connected notes.

**Alt text (`vault-now`):**
> The same Obsidian graph view months later, now a dense sphere of several
> hundred heavily linked notes.

---

### 7. Including this one

**H2:**
> Including this one.

**Body:**
> That is this page, open in the editor and in two browsers at once, at whatever
> hour I decided the spacing was wrong. If you want to know whether I can build a
> digital thing worth looking at, this is the work sample.

**Alt text (`desk-setup`):**
> A desk with a lit custom PC beside three monitors, VS Code open on this site's
> code on one screen and the live site loaded in two browsers on another.

---

### 8. Where I actually am

**H2:**
> Where I actually am.

**Body:**
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

*This is the most important section on the page. It is the answer to "you are
coming in too strong without enough fire to back it up," and it converts that
weakness into the reason to trust everything above it.*

---

### 9. The record

**H2:**
> The record.

**Education**
> **M.S. Marketing**, focus on analytics and AI
> University of Arizona, Eller College of Management. Expected December 2026.
> Dean's List.
>
> **B.S. Business Administration**
> University of Arizona, 2025. Dean's List. Phi Theta Kappa tuition scholarship.
>
> **A.A. Economics, A.A. Economics for Transfer, A.A. Liberal Arts and Sciences**
> Santa Barbara City College, 2023. Phi Theta Kappa. President's Honor Roll.
>
> **Bellarmine College Preparatory**
> Santa Clara, 2021.

**Work**
> **Marketing and Digital Communications Intern**, SignifyMD. 2026 to present.
> **Personal Trainer and Member Experience Specialist**, VASA Fitness. 2023 to 2025.
> **Resident Handler and Operations Assistant**, Bay Area K9 Association. 2021 to 2023.

**Closing line under the record:**
> First in my family to do any of this.

**Image caption (`grad-stage`):**
> Eller, 2025.

**Alt text (`grad-stage`):**
> Crossing the stage at the University of Arizona Eller College of Management
> graduation ceremony.

*Structural note for the art director: this replaces v1's four grey boxes. It
should read as a compressed run of typographic lines, closer to a colophon than
to cards. It confirms, it does not argue, so it gets the least visual weight of
anything on the page.*

---

### 10. Close

**H2:**
> If any of that is useful.

**Body:**
> The projects page has the work itself, with the parts that did not go well left
> in. The resume is one page. My email is at the bottom and I answer it.

**Buttons**

| Rank | Label | Destination | Note |
|---|---|---|---|
| Primary | `See the work` | `projects.html` | The one action. Only styled button. |
| Secondary | `Read the resume` | `assets/docs/Kenzler_CV2026.pdf` | Text link with an arrow, not a button. |
| Tertiary | `Email me` | `mailto:nkenzler@arizona.edu` | Plain link. |

*Primary CTA alternates:* `See the projects` (plainer, more literal),
`Open the projects page` (clearest, least energy). A is recommended because "the
work" is the word the page has been earning for ten sections.

---

### Footer tagline rewrite

The current tagline ("Enterprise-focused business & marketing professional
passionate about turning strategy into impact") is stale voice and should go in
the same pass. It sits in three `<span>` lines, so the replacement keeps three:

> Marketing student at Arizona.
> I take technical things apart,
> then explain them to people.

---

## 5. FAQ recommendation: cut it

**The call: remove the FAQ section entirely.**

Five reasons, in order of weight.

1. **The rebuilt page already answers all three questions, better, in its
   spine.** Q1 (how did I get into tech marketing) is now the Open and The habit.
   Q2 (analytics and AI) is The builds. Q3 (what teams do I work best with) is
   The other half. Keeping the FAQ means saying the same three things twice, on a
   page whose last version was rejected in part for repeating itself.
2. **Nobody asks these questions.** A real FAQ mirrors questions people actually
   send. These are self-interview prompts, and readers can feel the difference
   between a question someone asked and a question you wrote so you could answer
   it. That is the "you are really forcing it" note, in text form.
3. **The accordion fights the effect Nate asked for.** The brief wants a
   controlled scroll pace where each section lands before the next arrives.
   Hiding content behind a click is the opposite move. It also carries the
   existing dropdown rendering bug on boxes 2 and 3.
4. **FAQ is a sales pattern.** It exists to handle price, risk, and fit
   objections on a page trying to close a transaction. On a personal page it
   reads as a template component, which is the single worst signal for someone
   whose pitch is design and digital craft.
5. **It is the weakest visual block available.** A stack of grey collapsed rows
   at the bottom of a page that is otherwise carried by photography would undo
   the last impression the page makes.

**If Nate wants something there anyway**, here is the fallback. Three questions,
no accordion, answered inline in two sentences each, and only one of them is
about AI. Place it between The record and Close.

> **What do you want to be doing in two years?**
> Sitting between the people building a technical product and the people who need
> to understand it, and being genuinely useful to both. Right now that means
> getting better at the building so the translating has something under it.

> **How do you actually work with a team?**
> I take the piece nobody has picked up and I write things down. Most of the
> friction I have seen on teams was somebody assuming a thing had been said out
> loud when it had not.

> **Where does AI stop being useful?**
> Anywhere the cost of a confident wrong answer is higher than the time it saved.
> I built an approval gate into my own agent system for exactly that reason,
> after one of them told me I had authorized something I had not.

That third answer is a real incident from the Project Olympus logs and it is the
strongest AI-judgment credential Nate has, because it is about restraint rather
than enthusiasm. If the FAQ gets cut as recommended, **consider moving that one
answer into the Project Olympus card in The builds**, where it already partly
lives as "it does not get to act until I approve."

---

## 6. Open questions and unsourced items

Everything I could not verify, plus the judgment calls that need Nate's word.
Nothing below is in the copy as an assertion unless marked "used."

### Needs a source before ship

1. **`[NEEDS SOURCE]` Vault note count.** Copy says "around a thousand notes."
   The brief gave "roughly 1000 nodes." Confirm the actual number, or soften to
   "hundreds of notes." **Used in section 6.**
2. **`[NEEDS SOURCE]` Time gap between `vault-early` and `vault-now`.** Copy says
   "months apart," which is safe. If Nate can give the real span, "seven months
   apart" or similar is a much stronger line. **Used in section 6.**
3. **`[NEEDS SOURCE]` Pharmacovigilance RAG scope claim.** Copy says "I led the
   architecture and built the interface." The vault memory says both "Nate's
   role: lead architect and code implementation" and, separately, that only the
   Gradio cell was authored by Nate. These do not fully agree. Nate must confirm
   the exact wording before this ships, since scope honesty is the page's whole
   argument. **Used in section 5, card 1.**
4. **`[NEEDS SOURCE]` `grad-stage` ceremony.** Copy captions it "Eller, 2025,"
   assuming the B.S. ceremony. Confirm. **Used in section 9.**
5. **`[NEEDS SOURCE]` "My dad is an engineer."** Taken from the current live
   FAQ, which says "growing up with an engineer father." Confirm it is accurate
   as written. **Used in section 2.**
6. **`[NEEDS SOURCE]` "hardwired cameras."** Also from the current live FAQ.
   Confirm what this actually was so the line is not vague. **Used in section 2.**

### Judgment calls for Nate

7. **Naming NVIDIA NIM in the Project Olympus card.** The brief says the target
   employer is never named on the page. I read "runs on NVIDIA NIM inference" as
   a stack fact rather than positioning, and it is the single highest-signal
   detail on the page for the primary audience while staying neutral for everyone
   else. It is in the copy. Pull it if Nate reads it as naming the target.
8. **Nordstrom is not in The record.** It is on the current live About page but
   was cut from the CV. I left it out to match the CV. Say the word to restore it.
9. **"15+ client base" at Bay Area K9 is not used.** It appears on the current
   live page but not on the CV. The VASA number (27 concurrent accounts) is
   CV-backed and does the same job better, so I used only that one.
10. **"I write the CSS by hand with an assistant open next to me."** This admits
    AI assistance on the site build. I think it is a strength and it defuses the
    "does he actually code" question honestly. Cut it if Nate disagrees.
11. **The 47 percent is nowhere on the page.** 280 of 600 is legible without it.
    Add it back only if Nate wants it stated.
12. **No asset is assigned to section 4 (SignifyMD).** It is one of two
    deliberate type-only breath points. If the art director wants something
    there, it needs a new asset, since none of the existing eleven fits.

### Handoff notes for the art director

- Word budget per section is roughly Apple's: headings 2 to 6 words, body blocks
  40 to 150 words. Section 5 cards are 40 to 60 words each.
- Sections 4 and 8 are type-only on purpose. Sections 1, 2, 3, 7, 9 are image-led.
  Sections 5 and 6 are artifact grids.
- Section 6 is the only side-by-side comparison on the page. Protect that, it is
  the closest thing the copy has to a signature moment.
- The heading in section 1 is the largest type on the page and nothing should
  compete with it, including the existing 72px page title pattern. v1 stacked a
  near-72px thesis line under a 72px `About Me` h1, which is on the scrap list.
  This copy assumes the H1 **is** the thesis line and there is no separate
  "About Me" title.
