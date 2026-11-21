/* ==========================================================================
   About page motion layer (Geniebag Solutions)
   - Hero entrance once the page loader has cleared
   - CTA: staged entrance
   Uses GSAP ScrollTrigger (already loaded site-wide, in sync with
   ScrollSmoother) and falls back to IntersectionObserver.
   Hero parallax is handled by ScrollSmoother's data-speed (see about.html).
   ========================================================================== */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hero = document.querySelector(".gba-hero");
    var cta = document.querySelector(".gba-cta__panel");

    if (reduceMotion) {
        if (hero) hero.classList.add("is-ready");
        if (cta) cta.classList.add("is-in");
        return;
    }

    // Opt elements into JS-driven animation only once this script runs,
    // so content stays visible if JavaScript fails to load.
    if (hero) hero.classList.add("js-anim");
    if (cta) cta.classList.add("js-anim");

    // 1. Hero entrance: hook into the site's loader callback (initAnimations
    //    calls window.gsapController after the preloader / menu loader hides).
    var heroDone = false;
    function heroIn() {
        if (heroDone || !hero) return;
        heroDone = true;
        requestAnimationFrame(function () { hero.classList.add("is-ready"); });
    }
    var previous = window.gsapController;
    window.gsapController = function () {
        if (typeof previous === "function") previous();
        heroIn();
    };
    // Safety net: never leave the hero waiting on the loader.
    setTimeout(heroIn, 3500);

    // 2. Reveal helper (ScrollTrigger when available, else IntersectionObserver)
    function onEnter(el, start, cb) {
        if (!el) return;
        if (window.ScrollTrigger) {
            window.ScrollTrigger.create({ trigger: el, start: start, once: true, onEnter: cb });
        } else if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { cb(); io.disconnect(); }
                });
            }, { threshold: 0.2 });
            io.observe(el);
        } else {
            cb();
        }
    }

    function init() {
        onEnter(cta, "top 85%", function () { cta.classList.add("is-in"); });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
