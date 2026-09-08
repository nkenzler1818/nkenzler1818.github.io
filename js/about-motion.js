/* About page motion.
 *
 * Scope, deliberately small:
 *   1. the card stack: one scene wears .is-focus and CSS springs it larger;
 *      the rest rest smaller and darken via their scrim. A bouncing arrow
 *      prompt appears ~10s after a scene has held focus.
 *   2. the horizontal timeline: vertical scroll scrubs the track sideways,
 *      fills the centre rail behind you, and stages the skill bars.
 *   3. Selected Work: a three-slot vertical conveyor of Project Portfolio
 *      cards, stepping down one slot every ~1s.
 *
 * Everything else on the page is CSS. The hero entrance is a CSS animation so
 * it still plays if this file or GSAP never arrives, and all docking is
 * position:sticky, so this script creates ZERO ScrollTrigger pins.
 *
 * Reduced motion is handled upstream. The pre-paint guard in about.html only
 * adds html.ab-armed when motion is allowed, and the stylesheet's default
 * state is the finished page. So this file never has to hide anything, and
 * bailing out early is always safe.
 */
(function () {
  "use strict";

  var doc = document.documentElement;

  function disarm() {
    doc.classList.remove("ab-armed");
  }

  // The guard never armed us, so reduced motion is on. Nothing to do.
  if (!doc.classList.contains("ab-armed")) return;

  // GSAP blocked, offline, or the CDN changed under us. Fall back to the
  // static document rather than leaving a half-built stack on screen.
  if (!window.gsap || !window.ScrollTrigger) {
    disarm();
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  // Tell the guard's 2000ms backstop that motion is live, so it leaves
  // ab-armed alone. Set before building anything: if construction throws, the
  // catch below disarms explicitly.
  doc.classList.add("ab-ready");

  // Flow positions of the scenes, keyed by id.
  //
  // A docked sticky element reports its STUCK position from both
  // getBoundingClientRect() and offsetTop, so neither can tell us where the
  // scene actually lives in the document while the deck is stacked. The only
  // reliable read is to take position out of the equation, measure, and put
  // it back. Two reflows, and only on refresh, so it stays off the scroll
  // path entirely.
  var flowTops = {};

  function measureFlowTops() {
    var scenes = document.querySelectorAll(".ab-scene");
    var prev = [];
    Array.prototype.forEach.call(scenes, function (scene, i) {
      prev[i] = scene.style.position;
      scene.style.position = "static";
    });
    Array.prototype.forEach.call(scenes, function (scene) {
      if (!scene.id) return;
      var dock = parseFloat(getComputedStyle(scene).top);
      flowTops[scene.id] = {
        top: scene.getBoundingClientRect().top + window.pageYOffset,
        dock: isNaN(dock) ? 0 : dock
      };
    });
    Array.prototype.forEach.call(scenes, function (scene, i) {
      scene.style.position = prev[i];
    });
  }

  function scrollToScene(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var m = flowTops[id];
    var top = m
      ? m.top - m.dock
      : target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  // The bottom prompts jump to the next scene. Wired once, outside matchMedia,
  // since the prompt elements are static DOM (card 3 is a plain link).
  var prompts = Array.prototype.slice.call(
    document.querySelectorAll(".ab-prompt")
  );
  Array.prototype.forEach.call(
    document.querySelectorAll(".ab-prompt[data-ab-next]"),
    function (p) {
      p.addEventListener("click", function () {
        scrollToScene(p.getAttribute("data-ab-next"));
      });
    }
  );

  var mm = gsap.matchMedia();

  // Below 721px the CSS already collapses the stack, the horizontal track and
  // the conveyor, so building triggers there would animate elements no longer
  // laid out for it. gsap.matchMedia reverts everything when the query stops
  // matching; the returned cleanup handles what it does not.
  mm.add("(min-width: 721px)", function () {
    var pfTimer = null;
    var promptTimer = null;

    try {
      var scenes = Array.prototype.slice.call(
        document.querySelectorAll(".ab-scene")
      );

      /* ---- 1. card stack: spring pop + delayed prompt --------------- */

      function showPromptFor(sceneId) {
        if (promptTimer) {
          clearTimeout(promptTimer);
          promptTimer = null;
        }
        prompts.forEach(function (p) { p.classList.remove("is-visible"); });
        var p = prompts.filter(function (x) {
          return x.getAttribute("data-ab-for") === sceneId;
        })[0];
        if (!p) return;
        // Only after the scene has genuinely held focus for ~10s.
        promptTimer = setTimeout(function () {
          p.classList.add("is-visible");
        }, 10000);
      }

      // One scene wears .is-focus at a time; CSS springs it larger and lightens
      // it back to the standard surface. Focus steps forward as each later
      // scene rises through the viewport and steps back on scroll-up.
      function setFocus(idx) {
        scenes.forEach(function (scene, j) {
          scene.classList.toggle("is-focus", j === idx);
        });
        var focused = scenes[idx];
        if (focused) showPromptFor(focused.id);
      }
      setFocus(0);

      scenes.forEach(function (scene, i) {
        if (i === 0) return; // the hero holds focus until scene 1 arrives
        ScrollTrigger.create({
          trigger: scene,
          start: "top 38%",
          refreshPriority: i,
          onEnter: function () { setFocus(i); },
          onLeaveBack: function () { setFocus(i - 1); }
        });
      });

      /* ---- 2. horizontal timeline -------------------------------------- */

      var journey = document.querySelector(".ab-journey");
      var runway = document.querySelector(".ab-journey-scroll");
      var track = journey && journey.querySelector("[data-ab-track]");
      var inner = journey && journey.querySelector(".ab-scene-inner");

      if (journey && runway && track && inner) {
        var railFill = journey.querySelector("[data-ab-rail-fill]");
        var stops = journey.querySelectorAll(".ab-stop");

        var distance = function () {
          return Math.max(0, track.scrollWidth - inner.clientWidth);
        };

        var dockTop = function () {
          var v = parseFloat(getComputedStyle(journey).top);
          return isNaN(v) ? 0 : v;
        };

        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: journey,
            start: function () {
              return "top " + dockTop() + "px";
            },
            endTrigger: runway,
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1
          }
        });

        tl.to(track, { x: function () { return -distance(); }, duration: 1 }, 0);

        if (railFill) {
          tl.to(railFill, { scaleX: 1, duration: 1 }, 0);
        }

        var lastIndex = stops.length - 1;
        Array.prototype.forEach.call(stops, function (stop, i) {
          var fills = stop.querySelectorAll(".ab-skill-fill");
          if (!fills.length) return;
          var at = lastIndex > 0 ? (i / lastIndex) * 0.82 : 0;
          tl.to(fills, { scaleX: 1, duration: 0.13, stagger: 0.035 }, at);
        });
      }

      /* ---- 3. Selected Work conveyor -------------------------------- */

      // Three slots visible; the whole stack steps down one slot every ~1.5s
      // (1s hold, ~0.55s slide). The list is cloned once so the wrap is
      // seamless: at the end we snap back with no transition to the identical
      // clone frame. Pauses on hover / focus and while the tab is hidden.
      var pf = document.querySelector("[data-ab-pf]");
      var pfList = pf && pf.querySelector(".ab-pf-list");

      if (pf && pfList) {
        var originals = Array.prototype.slice.call(
          pfList.querySelectorAll(".ab-pf-slot")
        );
        var n = originals.length;

        if (n >= 3) {
          originals.forEach(function (s) {
            var c = s.cloneNode(true);
            c.setAttribute("aria-hidden", "true");
            c.setAttribute("data-ab-clone", "");
            pfList.appendChild(c);
          });

          var stepPx = function () {
            var gap = parseFloat(getComputedStyle(pfList).rowGap) || 0;
            return originals[0].getBoundingClientRect().height + gap;
          };

          var pos = 0; // translateY = -(n - pos) * step
          var pfPaused = false;

          var apply = function (withTransition) {
            pfList.style.transition = withTransition
              ? "transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)"
              : "none";
            pfList.style.transform =
              "translateY(" + (-(n - pos) * stepPx()) + "px)";
          };
          apply(false);

          var pfHold = function () { pfPaused = true; };
          var pfRelease = function () { pfPaused = false; };
          pf.addEventListener("pointerenter", pfHold);
          pf.addEventListener("pointerleave", pfRelease);
          pf.addEventListener("focusin", pfHold);
          pf.addEventListener("focusout", pfRelease);

          pfTimer = setInterval(function () {
            if (pfPaused || document.hidden) return;
            pos += 1;
            apply(true);
            if (pos >= n) {
              window.setTimeout(function () {
                pos = 0;
                apply(false);
                void pfList.offsetHeight; // commit before the next transition
              }, 580);
            }
          }, 1500);
        }
      }
    } catch (err) {
      if (pfTimer) clearInterval(pfTimer);
      if (promptTimer) clearTimeout(promptTimer);
      disarm();
      return;
    }

    return function () {
      // matchMedia reverts the GSAP tweens and triggers it created. Clean up
      // what it does not, so a resize down cannot strand a scaled scene, a
      // visible prompt, or a translated conveyor with its clones.
      if (pfTimer) { clearInterval(pfTimer); pfTimer = null; }
      if (promptTimer) { clearTimeout(promptTimer); promptTimer = null; }

      Array.prototype.forEach.call(
        document.querySelectorAll(".ab-scene"),
        function (s) { s.classList.remove("is-focus"); }
      );
      prompts.forEach(function (p) { p.classList.remove("is-visible"); });

      var list = document.querySelector("[data-ab-pf] .ab-pf-list");
      if (list) {
        list.style.transition = "";
        list.style.transform = "";
        Array.prototype.forEach.call(
          list.querySelectorAll("[data-ab-clone]"),
          function (c) { c.remove(); }
        );
      }
    };
  });

  measureFlowTops();
  ScrollTrigger.addEventListener("refresh", measureFlowTops);

  // Scene heights depend on content that settles after first paint. Without
  // this the stack and the horizontal distance are measured against a shorter
  // page.
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
