/*
 * Makes the active nav-tab pill + glow appear to glide from its old page's
 * position to its new page's position across a real (multi-page) navigation.
 *
 * This is a plain DOM/CSS-transition implementation, not the browser's
 * View Transitions API: cross-document view transitions proved unstable in
 * testing (a stalled/blank transition frame, and in some cases a fully
 * stuck compositor), which is not an acceptable risk for a live site. This
 * approach can only ever fail "quiet" — if anything here throws, storage is
 * unavailable, or the browser doesn't support something, the nav simply
 * renders correctly with no animation, exactly as it did before this file
 * existed.
 *
 * The "nav-pill-pending" class this file toggles on <html> is actually set
 * (when applicable) by a tiny inline guard script at the very top of <head>,
 * before this file even loads — see the inline <script> right before the
 * Tailwind CDN script tag on every page. That's what keeps the real pill
 * from ever flashing into view before this file gets a chance to hide it;
 * every exit path here just needs to make sure the class comes back off.
 */
(function () {
    var STORAGE_KEY = "navPillOrigin";
    var MAX_AGE_MS = 4000;
    var FLY_MS = 350;
    var SETTLE_FRAMES = 3; // consecutive matching frames required to trust a measurement
    var SETTLE_MAX_FRAMES = 90; // ~1.5s at 60fps — give up and skip the animation past this
    var PENDING_CLASS = "nav-pill-pending";

    function isDesktopNav() {
        var el = document.querySelector(".nav-desktop");
        return !!el && el.offsetParent !== null && getComputedStyle(el).display !== "none";
    }

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function unhide() {
        document.documentElement.classList.remove(PENDING_CLASS);
    }

    // Right before leaving the page, remember where the active pill was.
    document.addEventListener(
        "click",
        function (event) {
            try {
                if (!isDesktopNav() || prefersReducedMotion()) return;
                var link = event.target.closest(".nav-desktop a.nav-link");
                if (!link) return;
                var active = document.querySelector('.nav-desktop a.nav-link[aria-current="page"]');
                if (!active) return;
                var rect = active.getBoundingClientRect();
                sessionStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ x: rect.left, y: rect.top, w: rect.width, h: rect.height, t: Date.now() }),
                );
            } catch (err) {
                /* storage unavailable, or anything else — just skip the animation */
            }
        },
        true,
    );

    // The nav's layout depends on Tailwind's CDN script injecting utility CSS
    // (flex, spacing, max-width, ...) at runtime, plus the custom webfont —
    // both load asynchronously, so the destination pill's position can still
    // be moving well after this script starts running, especially on a slow
    // connection. Rather than trust any single "ready" event, poll the real
    // element's rect until it stops changing across consecutive frames, and
    // give up cleanly if it never settles quickly.
    function whenPositionSettles(getEl, onSettled, onGiveUp) {
        var lastRect = null;
        var matchCount = 0;
        var frame = 0;

        function tick() {
            var el = getEl();
            if (!el) {
                onGiveUp();
                return;
            }
            var rect = el.getBoundingClientRect();
            frame++;

            if (
                lastRect &&
                Math.abs(rect.left - lastRect.left) < 0.5 &&
                Math.abs(rect.top - lastRect.top) < 0.5 &&
                Math.abs(rect.width - lastRect.width) < 0.5 &&
                rect.width > 0
            ) {
                matchCount++;
            } else {
                matchCount = 0;
            }
            lastRect = rect;

            if (matchCount >= SETTLE_FRAMES) {
                onSettled(rect);
                return;
            }
            if (frame >= SETTLE_MAX_FRAMES) {
                onGiveUp();
                return;
            }
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    function flyPillTo(rect, origin) {
        var dx = origin.x - rect.left;
        var dy = origin.y - rect.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(origin.w - rect.width) < 1) {
            unhide();
            return;
        }

        var ghost = document.createElement("div");
        ghost.setAttribute("aria-hidden", "true");
        ghost.style.position = "fixed";
        ghost.style.left = rect.left + "px";
        ghost.style.top = rect.top + "px";
        ghost.style.width = rect.width + "px";
        ghost.style.height = rect.height + "px";
        ghost.style.borderRadius = "0.5rem";
        ghost.style.background = "rgba(192, 132, 252, 0.16)";
        ghost.style.zIndex = "9999";
        ghost.style.pointerEvents = "none";
        ghost.style.transform = "translate(" + dx + "px, " + dy + "px)";
        ghost.style.transition = "transform " + FLY_MS + "ms cubic-bezier(0.4, 0, 0.2, 1)";

        var glow = document.createElement("div");
        glow.style.position = "absolute";
        glow.style.top = "-0.65rem";
        glow.style.left = "50%";
        glow.style.width = "1.5rem";
        glow.style.height = "0.2rem";
        glow.style.marginLeft = "-0.75rem";
        glow.style.borderRadius = "999px";
        glow.style.background = "var(--accent-purple)";
        glow.style.boxShadow = "0 0 8px 2px rgba(192, 132, 252, 0.65), 0 0 22px 8px rgba(192, 132, 252, 0.35)";
        ghost.appendChild(glow);

        // <html> still carries the pending class here — the ghost appears in
        // the same frame the real pill is still hidden, so there's no gap.
        document.body.appendChild(ghost);

        var cleaned = false;
        function cleanup() {
            if (cleaned) return;
            cleaned = true;
            if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
            unhide();
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                ghost.style.transform = "translate(0px, 0px)";
            });
        });

        ghost.addEventListener("transitionend", cleanup);
        setTimeout(cleanup, FLY_MS + 200);
    }

    function flyPillIn() {
        var raw;
        try {
            raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) sessionStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            unhide();
            return;
        }
        if (!raw || !isDesktopNav() || prefersReducedMotion()) {
            unhide();
            return;
        }

        var origin;
        try {
            origin = JSON.parse(raw);
        } catch (err) {
            unhide();
            return;
        }
        if (!origin || typeof origin.t !== "number" || Date.now() - origin.t > MAX_AGE_MS) {
            unhide();
            return;
        }

        var getCurrent = function () {
            return document.querySelector('.nav-desktop a.nav-link[aria-current="page"]');
        };
        if (!getCurrent()) {
            unhide();
            return;
        }

        // Idempotent — makes sure it's hidden even if the inline guard at the
        // top of <head> didn't fire for some reason (e.g. viewport resized
        // between click and load).
        document.documentElement.classList.add(PENDING_CLASS);

        // Absolute worst-case backstop: whatever else happens, never leave
        // the pill invisible for more than ~2.8s.
        var safety = setTimeout(unhide, SETTLE_MAX_FRAMES * 20 + 1000);

        var fontsReady =
            document.fonts && document.fonts.ready ? document.fonts.ready.catch(function () {}) : Promise.resolve();

        fontsReady.then(function () {
            whenPositionSettles(
                getCurrent,
                function (rect) {
                    clearTimeout(safety);
                    flyPillTo(rect, origin);
                },
                function () {
                    clearTimeout(safety);
                    unhide();
                },
            );
        });
    }

    try {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", flyPillIn);
        } else {
            flyPillIn();
        }
    } catch (err) {
        unhide();
    }
})();
