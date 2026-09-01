/* ===================================================================
   About page motion layer.

   Rules this file keeps:
     - ScrollTrigger only. Zero new scroll listeners. The nav shrink
       listener in pages/about.html is the shell's and is untouched.
     - transform and opacity only.
     - The CSS default state is the finished page. Everything below
       either parks an element in its armed state before first paint or
       animates it back to the CSS default.
     - Under prefers-reduced-motion: reduce this file returns before it
       creates a single thing, so there is no ScrollSmoother, no
       ScrollTrigger, no SplitText, and nothing left hidden.
   =================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var DESKTOP = "(min-width: 821px)";
  var MOBILE = "(max-width: 820px)";

  function disarm() {
    root.classList.remove("ab-armed");
  }

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* If motion is off, or any library failed to arrive, hand the reader the
     finished static page. The head guard's 2000ms timeout is the second
     backstop behind this one. */
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    disarm();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  var hasSmoother = !!window.ScrollSmoother;
  var hasSplit = !!window.SplitText;
  if (hasSmoother) gsap.registerPlugin(ScrollSmoother);
  if (hasSplit) gsap.registerPlugin(SplitText);

  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.normalizeScroll(false);

  /* ------------------------------------------------------------------
     1. Park the armed state as inline transforms, in the first
        statement, then drop the class. Inline beats the class rule, so
        nothing is handled twice.
     ------------------------------------------------------------------ */
  var heroHeading = document.querySelector(".ab-split-hero");

  gsap.set(".ab-ap-t, .ab-ap-b, .ab-ap-full", { yPercent: 0 });
  if (heroHeading) gsap.set(heroHeading, { opacity: 0 });
  gsap.set(".s1 .ab-lede, .s1 .ab-cap", { opacity: 0, y: 12 });
  disarm();

  /* ------------------------------------------------------------------
     2. Helpers
     ------------------------------------------------------------------ */
  var speed = window.innerWidth <= 820 ? 0.7 : 1;

  function q(sel) {
    return document.querySelector(sel);
  }

  function parts(plate) {
    return {
      t: plate.querySelector(".ab-ap-t"),
      b: plate.querySelector(".ab-ap-b"),
      img: plate.querySelector("img")
    };
  }

  /* The page's one reveal grammar, scrubbed. Applying it uniformly is
     what makes ten sections read as one document. */
  function scrubAperture(sel, start, end) {
    var plate = q(sel);
    if (!plate) return;
    var p = parts(plate);
    var tl = gsap.timeline({
      scrollTrigger: { trigger: plate, start: start, end: end, scrub: 1 }
    });
    if (p.t) tl.to(p.t, { yPercent: -101, ease: "none" }, 0);
    if (p.b) tl.to(p.b, { yPercent: 101, ease: "none" }, 0);
    if (p.img) tl.fromTo(p.img, { scale: 1.05 }, { scale: 1, ease: "none" }, 0);
  }

  /* On touch a scrubbed tween tied to a flick with native momentum reads
     as lag, not as control, so the same gesture goes discrete. */
  function popAperture(sel, start, dur, delay) {
    var plate = q(sel);
    if (!plate) return;
    var p = parts(plate);
    var tl = gsap.timeline({
      delay: delay || 0,
      scrollTrigger: { trigger: plate, start: start, once: true }
    });
    if (p.t) tl.to(p.t, { yPercent: -101, duration: dur, ease: "power3.out" }, 0);
    if (p.b) tl.to(p.b, { yPercent: 101, duration: dur, ease: "power3.out" }, 0);
    if (p.img) {
      tl.fromTo(
        p.img,
        { scale: 1.05 },
        { scale: 1, duration: dur * 1.45, ease: "power3.out" },
        0
      );
    }
  }

  function splitLines(el) {
    if (!hasSplit || !el) return null;
    try {
      return new SplitText(el, {
        type: "lines",
        linesClass: "ab-line",
        mask: "lines"
      });
    } catch (err) {
      return null;
    }
  }

  function revertAll(list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i]) {
        try {
          list[i].revert();
        } catch (err) {}
      }
    }
  }

  /* Wait for the real faces before splitting, so lines never re-break
     under a mask. Capped so a font that never resolves cannot hold the
     heading back past the head guard's own backstop. */
  function whenFontsReady(cb) {
    var fired = false;
    function go() {
      if (fired) return;
      fired = true;
      cb();
    }
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(go);
      setTimeout(go, 600);
    } else {
      go();
    }
  }

  /* ------------------------------------------------------------------
     3. Section 1 runs on load, not on scroll, and carries no trigger.
        The load sequence states the thesis and then opens the plate,
        which teaches the reader what a plate does before any scrolling
        has happened.
     ------------------------------------------------------------------ */
  function runHero() {
    var s1 = q(".s1");
    if (!s1) return;

    var lede = s1.querySelectorAll(".ab-lede, .ab-cap");
    var plate = q(".s1 .ab-plate");
    var split = splitLines(heroHeading);
    var lines = split && split.lines && split.lines.length ? split.lines : null;

    if (lines) gsap.set(lines, { yPercent: 108, opacity: 0 });
    if (heroHeading) gsap.set(heroHeading, { opacity: 1 });

    var tl = gsap.timeline();

    if (lines) {
      tl.to(
        lines,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.09 * speed,
          duration: 0.9 * speed,
          ease: "expo.out"
        },
        0
      );
    }

    if (plate) {
      var p = parts(plate);
      if (p.t) tl.to(p.t, { yPercent: -101, duration: 1.1 * speed, ease: "power3.inOut" }, 0.15);
      if (p.b) tl.to(p.b, { yPercent: 101, duration: 1.1 * speed, ease: "power3.inOut" }, 0.15);
      if (p.img) {
        tl.fromTo(
          p.img,
          { scale: 1.06 },
          { scale: 1, duration: 1.4 * speed, ease: "power3.out" },
          0.15
        );
      }
    }

    if (lede.length) {
      tl.to(lede, { opacity: 1, y: 0, duration: 0.7 * speed, ease: "power2.out" }, 0.55);
    }

    tl.eventCallback("onComplete", function () {
      if (split) {
        try {
          split.revert();
        } catch (err) {}
      }
    });
  }

  /* ------------------------------------------------------------------
     4. The type reveals, sections 4, 8, 9 and 10. Identical shape at
        both breakpoints, shortened on touch. Returns the SplitText
        instances so the matchMedia context can revert them.
     ------------------------------------------------------------------ */
  function buildTypeReveals(k) {
    var made = [];

    /* Section 4 has no image, so the heading arriving line by line is the
       only thing that gives a type only section a moment. */
    var s4 = q(".s4");
    if (s4) {
      var h4 = s4.querySelector(".ab-h2");
      var sp4 = splitLines(h4);
      if (sp4) made.push(sp4);
      var body4 = s4.querySelectorAll(".ab-body");
      if (sp4 && sp4.lines.length) gsap.set(sp4.lines, { yPercent: 108, opacity: 0 });
      if (body4.length) gsap.set(body4, { opacity: 0, y: 14 });

      var tl4 = gsap.timeline({
        scrollTrigger: { trigger: s4, start: "top 78%", once: true }
      });
      if (sp4 && sp4.lines.length) {
        tl4.to(
          sp4.lines,
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.08 * k,
            duration: 0.85 * k,
            ease: "expo.out"
          },
          0
        );
      }
      if (body4.length) {
        tl4.to(body4, { opacity: 1, y: 0, duration: 0.7 * k, ease: "power2.out" }, 0.25);
      }
    }

    /* Section 8 is the page's turn. The sentence assembles, then the
       three paragraphs arrive in order. */
    var s8 = q(".s8");
    if (s8) {
      var h8 = s8.querySelector(".ab-turn");
      var sp8 = splitLines(h8);
      if (sp8) made.push(sp8);
      var body8 = s8.querySelectorAll(".s8-body");
      if (sp8 && sp8.lines.length) gsap.set(sp8.lines, { yPercent: 108, opacity: 0 });
      if (body8.length) gsap.set(body8, { opacity: 0, y: 14 });

      var tl8 = gsap.timeline({
        scrollTrigger: { trigger: s8, start: "top 76%", once: true }
      });
      if (sp8 && sp8.lines.length) {
        tl8.to(
          sp8.lines,
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.09 * k,
            duration: 0.9 * k,
            ease: "expo.out"
          },
          0
        );
      }
      if (body8.length) {
        tl8.to(
          body8,
          {
            opacity: 1,
            y: 0,
            stagger: 0.14 * k,
            duration: 0.7 * k,
            ease: "power2.out"
          },
          0.3
        );
      }
    }

    /* The least important section on the page gets the lightest and
       fastest motion, so it confirms the record without asking for
       attention. */
    var s9 = q(".s9");
    if (s9) {
      var items = s9.querySelectorAll(".ab-rec-label, .ab-rec-item, .s9-close");
      if (items.length) {
        gsap.set(items, { opacity: 0, y: 10 });
        gsap.timeline({
          scrollTrigger: { trigger: s9, start: "top 82%", once: true }
        }).to(items, {
          opacity: 1,
          y: 0,
          stagger: 0.045 * k,
          duration: 0.5 * k,
          ease: "power2.out"
        });
      }
      /* A small supporting image does not earn a scroll window, so this
         one plate drops the scrub. */
      popAperture(".s9 .ab-plate", "top 88%", 0.8 * k, 0.3);
    }

    /* The one action arrives as a single settled group, so there is no
       moment where the reader sees competing links before they see
       which one is primary. */
    var s10 = q(".s10");
    if (s10) {
      var group = s10.querySelectorAll(".ab-h2, .ab-body, .ab-cta-row");
      if (group.length) {
        gsap.set(group, { opacity: 0, y: 16 });
        gsap.timeline({
          scrollTrigger: { trigger: s10, start: "top 80%", once: true }
        }).to(group, {
          opacity: 1,
          y: 0,
          stagger: 0.09 * k,
          duration: 0.6 * k,
          ease: "power2.out"
        });
      }
    }

    return made;
  }

  /* ------------------------------------------------------------------
     5. Breakpoint sets. gsap.matchMedia tears the whole desktop context
        down and rebuilds it on a resize across 820px, which is the
        vanilla equivalent of a cleanup function.
     ------------------------------------------------------------------ */
  var mm = gsap.matchMedia();

  function buildDesktop() {
    var smoother = null;

    /* smooth: 1.1 is the whole controlled pace. A real scrollbar, a real
       window.scrollY, no input interception, no effects, so keyboard
       paging, Home, End and hash anchors all behave normally. */
    if (hasSmoother && q("#smooth-wrapper") && q("#smooth-content")) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.1,
        smoothTouch: false,
        effects: false,
        normalizeScroll: false,
        ignoreMobileResize: true
      });
    }

    scrubAperture(".s2 .ab-plate", "top 85%", "top 45%");
    scrubAperture(".s3 .ab-plate", "top 82%", "top 42%");
    scrubAperture(".s5-lead .ab-plate", "top 88%", "top 40%");
    scrubAperture(".s5-pair-a .ab-plate", "top 88%", "top 44%");
    /* The four point offset on the right hand plate is the stagger. It is
       a trigger position, not a delay, so it stays correct at every
       scroll speed and in both directions. */
    scrubAperture(".s5-pair-b .ab-plate", "top 84%", "top 40%");
    scrubAperture(".s7 .ab-plate", "top 90%", "top 38%");

    /* Section 6, the page's only pin and the aperture's only variation.
       A before and after that scrolls past one frame at a time is not a
       comparison, so the pin puts both states on screen at once. The
       mirrored single cover sweep is spent on the page's one comparison,
       so the gesture says these two belong to each other. */
    var stage = q(".s6-stage");
    if (stage) {
      /* The two piece iris is the mobile path here. Park it open while
         the full cover is still down, so nothing is ever uncovered. */
      gsap.set(".s6 .ab-ap-t", { yPercent: -101 });
      gsap.set(".s6 .ab-ap-b", { yPercent: 101 });
      gsap.set(".s6 .s6-cap", { opacity: 0 });

      var tl6 = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "center center",
          end: "+=90%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 1
        }
      });
      tl6
        .to(".s6-a .ab-ap-full", { yPercent: -101, ease: "none", duration: 0.5 }, 0)
        .fromTo(".s6-a img", { scale: 1.05 }, { scale: 1, ease: "none", duration: 0.5 }, 0)
        .to(".s6-b .ab-ap-full", { yPercent: 101, ease: "none", duration: 0.5 }, 0.3)
        .fromTo(".s6-b img", { scale: 1.05 }, { scale: 1, ease: "none", duration: 0.5 }, 0.3)
        .fromTo(".s6 .s6-cap", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.45 }, 0.55);
    }

    var splits = buildTypeReveals(1);

    return function () {
      if (smoother) smoother.kill();
      revertAll(splits);
    };
  }

  function buildMobile() {
    /* No pin, no smoother. Section 6 unpins, stacks, and takes the same
       two piece iris as everything else. Park the full covers open while
       the iris is still closed. */
    gsap.set(".s6-a .ab-ap-full", { yPercent: -101 });
    gsap.set(".s6-b .ab-ap-full", { yPercent: 101 });

    popAperture(".s2 .ab-plate", "top 88%", 0.65);
    popAperture(".s3 .ab-plate", "top 88%", 0.65);
    popAperture(".s5-lead .ab-plate", "top 88%", 0.65);
    popAperture(".s5-pair-a .ab-plate", "top 88%", 0.65);
    popAperture(".s5-pair-b .ab-plate", "top 88%", 0.65);
    popAperture(".s6-a .ab-plate", "top 88%", 0.65);
    popAperture(".s6-b .ab-plate", "top 88%", 0.65);
    popAperture(".s7 .ab-plate", "top 88%", 0.65);

    var splits = buildTypeReveals(0.85);

    return function () {
      revertAll(splits);
    };
  }

  /* SplitText has to run against the real faces, so the whole trigger set
     is built inside the same font gate as the hero. Nothing is visible
     and waiting in the meantime: every shutter is already parked closed
     inline by step 1. */
  whenFontsReady(function () {
    mm.add(DESKTOP, buildDesktop);
    mm.add(MOBILE, buildMobile);
    runHero();
    ScrollTrigger.refresh();
  });

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
