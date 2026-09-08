/* About page v3 motion.
 *
 * Scope, deliberately small:
 *   1. the card stack, an outgoing scene scales down and dims as the next
 *      one rises over it, and its exposed top edge becomes a jump-back button
 *   2. the horizontal timeline, vertical scroll scrubs the track sideways and
 *      fills the centre rail behind you and stages the skill bars
 *
 * Everything else on the page is CSS. The hero entrance is a CSS animation so
 * it still plays if this file or GSAP never arrives, and all docking is
 * position:sticky, so this script creates ZERO ScrollTrigger pins. That is on
 * purpose: nested pins are what makes a stacked layout plus a horizontal
 * scrub fragile, and without them there is no pin spacing for the two
 * mechanics to fight over.
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
    // Landing on flowTop - dock puts the scene back at exactly the offset it
    // occupies when docked, so the jump ends where the eye expects it.
    var top = m
      ? m.top - m.dock
      : target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  // Jump-back on a receded card's edge. Wired once, outside matchMedia, so the
  // listener is not torn down and rebuilt on every breakpoint change. The
  // buttons stay disabled until a scrub says otherwise, and CSS makes a
  // disabled edge both invisible and pointer-events:none.
  var edges = document.querySelectorAll(".ab-scene-edge");
  Array.prototype.forEach.call(edges, function (edge) {
    edge.addEventListener("click", function () {
      scrollToScene(edge.getAttribute("data-ab-jump"));
    });
  });

  var mm = gsap.matchMedia();

  // Below 721px the CSS already collapses the stack and the horizontal track,
  // so building triggers there would animate elements that are no longer
  // laid out for it. gsap.matchMedia reverts everything automatically when
  // the query stops matching.
  mm.add("(min-width: 721px)", function () {
    try {
      var scenes = Array.prototype.slice.call(
        document.querySelectorAll(".ab-scene")
      );

      /* ---- 1. card stack ---------------------------------------------- */

      scenes.forEach(function (scene, i) {
        var next = scenes[i + 1];
        if (!next) return; // last scene never recedes

        var scrim = scene.querySelector(".ab-scene-scrim");
        var edge = scene.querySelector(".ab-scene-edge");
        if (!scrim) return;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: true,
              // Scenes are created top to bottom, but say so explicitly so a
              // refresh recalculates them in page order.
              refreshPriority: i,
              onUpdate: function (self) {
                if (!edge) return;
                // Only offer the jump-back once the card has actually receded
                // far enough for its edge to be visible and legible.
                edge.disabled = self.progress < 0.65;
              }
            }
          })
          .to(scene, { scale: 0.94 }, 0)
          .to(scrim, { opacity: 0.55 }, 0);
      });

      /* ---- 2. horizontal timeline -------------------------------------- */

      var journey = document.querySelector(".ab-journey");
      var runway = document.querySelector(".ab-journey-scroll");
      var track = journey && journey.querySelector("[data-ab-track]");
      var inner = journey && journey.querySelector(".ab-scene-inner");

      if (journey && runway && track && inner) {
        var railFill = journey.querySelector("[data-ab-rail-fill]");
        var stops = journey.querySelectorAll(".ab-stop");

        // Recomputed on every refresh via invalidateOnRefresh, so a resize or a
        // late-loading font cannot leave the track short or overscrolled.
        var distance = function () {
          return Math.max(0, track.scrollWidth - inner.clientWidth);
        };

        // The scene's sticky offset. The scrub should begin the moment the
        // card docks, not when the section top reaches y=0, or the first stop
        // starts moving while the heading is still travelling.
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
            // Ends with the runway, not with the journey card, because the
            // card is only a viewport tall and the runway underneath it is
            // what the scrub actually spends its scroll on.
            endTrigger: runway,
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1
          }
        });

        tl.to(track, { x: function () { return -distance(); }, duration: 1 }, 0);

        // The rail is grey ahead of you and fills purple behind. It rides the
        // same master timeline as the track, so it cannot drift out of sync
        // with the stops travelling past it.
        if (railFill) {
          tl.to(railFill, { scaleX: 1, duration: 1 }, 0);
        }

        // Skill rails ride the same master timeline rather than getting their
        // own ScrollTriggers. Twelve extra trigger instances would cost more
        // than the effect is worth, and sharing the timeline keeps each stop's
        // fill locked to the moment that stop reaches the middle of the card.
        var lastIndex = stops.length - 1;
        Array.prototype.forEach.call(stops, function (stop, i) {
          var fills = stop.querySelectorAll(".ab-skill-fill");
          if (!fills.length) return;
          var at = lastIndex > 0 ? (i / lastIndex) * 0.82 : 0;
          tl.to(
            fills,
            { scaleX: 1, duration: 0.13, stagger: 0.035 },
            at
          );
        });
      }

    } catch (err) {
      // Anything unexpected while building: tear the motion layer down and
      // let the stylesheet's default state stand as the finished page.
      disarm();
      return;
    }

    return function () {
      // matchMedia reverts the tweens and triggers it created; just make sure
      // no edge button is left clickable in a layout that has no stack.
      Array.prototype.forEach.call(edges, function (edge) {
        edge.disabled = true;
      });
    };
  });

  measureFlowTops();
  ScrollTrigger.addEventListener("refresh", measureFlowTops);

  // Scene heights depend on content, and the portrait plus the three personal
  // images all settle after first paint. Without this the stack and the
  // horizontal distance are measured against a shorter page.
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
