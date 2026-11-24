/* ==========================================================================
   Contact page interactions (Geniebag Solutions)
   - Hero entrance, scroll reveals (IntersectionObserver), typewriter heading
   - Copy-to-clipboard + toast, service chips, floating-label validation
   - Submit states (loading / success) layered around the existing submit
     path: ajax-mail.js still serialises and posts #contact-form unchanged.
   - Header scroll-progress bar and back-to-top progress ring
   Motion is transform/opacity only and is skipped for reduced motion.
   ========================================================================== */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var root = document.documentElement;
    if (!reduceMotion) root.classList.add("gbc-motion");

    /* ---------- 1. Hero entrance (after the site loader clears) ---------- */
    var hero = document.querySelector(".gbc-hero");
    var heroDone = false;
    function heroIn() {
        if (heroDone || !hero) return;
        heroDone = true;
        requestAnimationFrame(function () { hero.classList.add("is-ready"); });
    }
    if (reduceMotion) {
        heroIn();
    } else {
        var previousController = window.gsapController;
        window.gsapController = function () {
            if (typeof previousController === "function") previousController();
            heroIn();
        };
        setTimeout(heroIn, 3500); // never leave the hero waiting on the loader
    }

    /* ---------- 2. Intro eyebrow + heading (instant visible, no typewriter) ---------- */
    // Typewriter removed per Audit Item 13: render heading visible immediately without typing delays.

    /* ---------- 3. Scroll reveal (once, staggered within each group) ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], .gbc-next__track"));
    revealEls.forEach(function (el) {
        if (!el.hasAttribute("data-reveal")) return;
        var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
        el.style.setProperty("--gbc-d", sibs.indexOf(el) * 90 + "ms");
    });
    function revealAll() { revealEls.forEach(function (el) { el.classList.add("is-in"); }); }
    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealAll();
    } else {
        var rio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                // reveal when visible, or if it is already above the viewport (restored scroll)
                if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                    entry.target.classList.add("is-in");
                    rio.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        revealEls.forEach(function (el) { rio.observe(el); });
    }

    /* ---------- 4. Copy to clipboard + toast ---------- */
    var toast, toastTimer;
    function showToast(msg) {
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "gbc-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span></span>';
        toast.querySelector("span").textContent = msg;
        requestAnimationFrame(function () { toast.classList.add("is-on"); });
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200);
    }
    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
        }
        return legacyCopy(text);
    }
    function legacyCopy(text) {
        return new Promise(function (resolve, reject) {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
            document.body.appendChild(ta);
            ta.select();
            var ok = false;
            try { ok = document.execCommand("copy"); } catch (e) {}
            ta.remove();
            ok ? resolve() : reject();
        });
    }
    document.querySelectorAll(".gbc-copy").forEach(function (btn) {
        btn.addEventListener("click", function () {
            copyText(btn.getAttribute("data-copy")).then(function () {
                btn.classList.add("is-done");
                btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
                showToast("Copied: " + btn.getAttribute("data-copy"));
                setTimeout(function () {
                    btn.classList.remove("is-done");
                    btn.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
                }, 1800);
            }, function () { showToast("Couldn't copy. Please select the address instead."); });
        });
    });

    /* ---------- 5. Form: chips, counter, validation, submit states ---------- */
    var form = document.getElementById("contact-form");
    if (form) {
        var card = form.closest(".gbc-formcard");
        var success = card && card.querySelector(".gbc-success");
        var submitBtn = form.querySelector(".gbc-submit");
        var btnTitle = submitBtn && submitBtn.querySelector(".btn-title");
        var btnLabel = btnTitle ? btnTitle.textContent : "";
        var msgBox = form.querySelector(".form-message");
        var message = form.querySelector("#message");
        var counter = form.querySelector(".gbc-count");
        var chips = Array.prototype.slice.call(form.querySelectorAll(".gbc-chip"));
        var busy = false;

        // Custom messages replace the browser bubbles; the required/type attributes remain the source of truth.
        form.setAttribute("novalidate", "");

        var MESSAGES = {
            name: { valueMissing: "Please enter your name." },
            email2: { valueMissing: "Please enter your email address.", typeMismatch: "Please enter a valid email, e.g. name@company.com." },
            "gbc-consent": { valueMissing: "Please confirm we may contact you about your enquiry." }
        };
        var checked = Array.prototype.slice.call(form.querySelectorAll(".gbc-field input, #gbc-consent"));

        function wrapOf(input) { return input.closest(".gbc-field, .gbc-consent"); }
        function errorFor(input) {
            var v = input.validity, m = MESSAGES[input.id] || {};
            if (v.valueMissing) return m.valueMissing || "This field is required.";
            if (v.typeMismatch) return m.typeMismatch || "Please check this value.";
            return input.validationMessage || "Please check this value.";
        }
        function validate(input, show) {
            var wrap = wrapOf(input);
            var ok = input.checkValidity();
            var filled = input.type === "checkbox" ? input.checked : input.value.trim() !== "";
            wrap.classList.toggle("is-valid", ok && filled && input.type !== "checkbox");
            if (show || wrap.classList.contains("is-invalid")) {
                wrap.classList.toggle("is-invalid", !ok);
                var err = wrap.querySelector(".gbc-field__err");
                if (err) err.textContent = ok ? "" : errorFor(input);
                if (ok) input.removeAttribute("aria-invalid"); else input.setAttribute("aria-invalid", "true");
            }
            return ok;
        }
        checked.forEach(function (input) {
            var evt = input.type === "checkbox" ? "change" : "input";
            input.addEventListener(evt, function () { validate(input, input.type === "checkbox"); });
            input.addEventListener("blur", function () {
                if (input.type !== "checkbox" && (input.value.trim() !== "" || wrapOf(input).classList.contains("is-invalid"))) validate(input, true);
            });
        });

        function updateCount() {
            if (!counter || !message) return;
            var n = message.value.length;
            counter.textContent = n + (n === 1 ? " character" : " characters");
        }
        if (message) message.addEventListener("input", updateCount);

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                var on = chip.getAttribute("aria-pressed") !== "true";
                chip.setAttribute("aria-pressed", on ? "true" : "false");
                if (on) {
                    var unsure = chip.classList.contains("gbc-chip--unsure");
                    chips.forEach(function (c) {
                        if (c !== chip && (unsure || c.classList.contains("gbc-chip--unsure"))) c.setAttribute("aria-pressed", "false");
                    });
                }
            });
        });

        function setLoading(on) {
            busy = on;
            if (!submitBtn) return;
            if (on) {
                submitBtn.style.minWidth = submitBtn.offsetWidth + "px"; // keep width: no shift
                if (btnTitle) btnTitle.textContent = "Sending…";
            } else {
                submitBtn.style.minWidth = "";
                if (btnTitle) btnTitle.textContent = btnLabel;
            }
            submitBtn.classList.toggle("is-loading", on);
            submitBtn.setAttribute("aria-busy", on ? "true" : "false");
        }
        function showSuccess() {
            setLoading(false);
            if (!card || !success) return;
            success.hidden = false;
            card.classList.add("is-sent");
            setTimeout(function () { success.focus({ preventScroll: true }); }, 50);
            // On tall (mobile) cards the centred message can sit off-screen: bring it into view.
            var r = success.querySelector(".gbc-success__badge").getBoundingClientRect();
            if (r.top < 90 || r.bottom > window.innerHeight - 40) {
                // align the card so its centre (where the message sits) is mid-viewport
                var cardTopInView = Math.round(window.innerHeight / 2 - card.offsetHeight / 2);
                if (window.smoother) window.smoother.scrollTo(card, !reduceMotion, "top " + cardTopInView + "px");
                else window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - cardTopInView, behavior: reduceMotion ? "auto" : "smooth" });
            }
        }
        function resetForm() {
            form.reset();
            chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
            checked.forEach(function (input) {
                var w = wrapOf(input);
                w.classList.remove("is-valid", "is-invalid");
                input.removeAttribute("aria-invalid");
            });
            if (msgBox) { msgBox.textContent = ""; msgBox.className = "form-message gbc-form__msg"; }
            form.classList.remove("is-quiet");
            updateCount();
            card.classList.remove("is-sent");
            success.hidden = true;
            var first = form.querySelector("#name");
            if (first) first.focus({ preventScroll: true });
        }
        if (success) success.querySelector(".gbc-success__again").addEventListener("click", resetForm);

        // Runs in the capture phase, before ajax-mail.js's submit handler on the form.
        document.addEventListener("submit", function (e) {
            if (e.target !== form) return;
            e.preventDefault();
            if (busy) { e.stopImmediatePropagation(); return; }

            var firstBad = null;
            checked.forEach(function (input) { if (!validate(input, true) && !firstBad) firstBad = input; });
            if (firstBad) {
                e.stopImmediatePropagation(); // nothing is sent while the form is invalid
                firstBad.focus();
                return;
            }

            if (msgBox) { msgBox.textContent = ""; msgBox.className = "form-message gbc-form__msg"; }

            var FALLBACK = "We could not send your enquiry. Please try again or email info@geniebag.com.";
            function showError(text) {
                setLoading(false);
                if (!msgBox) return;
                msgBox.className = "form-message gbc-form__msg error";
                msgBox.textContent = text || FALLBACK;
            }

            var endpoint = form.getAttribute("action");
            if (!endpoint || !window.fetch) {
                // Never confirm an enquiry that was not sent.
                showError("Our form is unavailable right now. Please email us at info@geniebag.com.");
                return;
            }

            // Form fields plus the chosen service chips (chips are buttons, so they are added by hand).
            var data = new URLSearchParams(new FormData(form));
            var chosen = chips.filter(function (c) { return c.getAttribute("aria-pressed") === "true"; })
                .map(function (c) { return c.textContent.trim(); });
            if (chosen.length) data.set("services", chosen.join(", "));

            setLoading(true);
            var ctrl = window.AbortController ? new AbortController() : null;
            var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);

            fetch(endpoint, {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: data,
                signal: ctrl ? ctrl.signal : undefined
            })
                .then(function (res) {
                    return res.json().catch(function () { return {}; }).then(function (json) {
                        // Success only on a 2xx reply that explicitly says ok.
                        if (res.ok && json.ok === true) showSuccess();
                        else showError(json.error);
                    });
                })
                .catch(function (err) {
                    showError(err && err.name === "AbortError"
                        ? "This is taking longer than expected. Please try again or email info@geniebag.com."
                        : FALLBACK);
                })
                .then(function () { clearTimeout(timer); });
        }, true);
    }

    /* ---------- 6. Scroll progress (header bar + back-to-top ring) ---------- */
    var header = document.getElementById("header-sticky");
    var bar = null;
    if (header) {
        bar = document.createElement("div");
        bar.className = "gbc-progress";
        bar.setAttribute("aria-hidden", "true");
        header.appendChild(bar);
    }
    var ringBar = null;
    var toTop = document.getElementById("back-top");
    if (toTop) {
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");
        svg.setAttribute("class", "gbc-totop-ring");
        svg.setAttribute("viewBox", "0 0 60 60");
        svg.setAttribute("aria-hidden", "true");
        ["gbc-totop-ring__track", "gbc-totop-ring__bar"].forEach(function (cls) {
            var r = document.createElementNS(ns, "rect");
            r.setAttribute("x", "1"); r.setAttribute("y", "1");
            r.setAttribute("width", "58"); r.setAttribute("height", "58");
            r.setAttribute("rx", "16");
            r.setAttribute("pathLength", "100");
            r.setAttribute("class", cls);
            svg.appendChild(r);
        });
        ringBar = svg.lastChild;
        ringBar.style.strokeDasharray = "100";
        ringBar.style.strokeDashoffset = "100";
        toTop.appendChild(svg);
        if (!toTop.getAttribute("aria-label")) toTop.setAttribute("aria-label", "Back to top");
    }
    var lastP = -1;
    function readProgress() {
        var s = window.smoother;
        if (s && typeof s.progress === "number") return s.progress;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    function paintProgress() {
        var p = Math.round(readProgress() * 1000) / 1000;
        if (p === lastP) return;
        lastP = p;
        if (bar) bar.style.transform = "scaleX(" + p + ")";
        if (ringBar) ringBar.style.strokeDashoffset = String(100 - p * 100);
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { ticking = false; paintProgress(); });
    }, { passive: true });
    // ScrollSmoother eases content after the native scroll stops; follow it frame by frame.
    window.addEventListener("load", function () {
        if (window.gsap && window.gsap.ticker) window.gsap.ticker.add(paintProgress);
        paintProgress();
    });

    /* ---------- Direct Form Jump / Anchor handling ---------- */
    function scrollToScopingForm() {
        var target = document.getElementById("contact-form");
        if (!target) return;
        if (window.smoother && typeof window.smoother.scrollTo === "function") {
            window.smoother.scrollTo(target, true, "top 100px");
        } else {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        var nameField = document.getElementById("name");
        if (nameField) {
            setTimeout(function () { nameField.focus(); }, 450);
        }
    }

    if (window.location.hash === "#contact-form" || window.location.hash === "#scoping-form") {
        setTimeout(scrollToScopingForm, 350);
    }
    window.addEventListener("hashchange", function () {
        if (window.location.hash === "#contact-form" || window.location.hash === "#scoping-form") {
            scrollToScopingForm();
        }
    });

    document.querySelectorAll('a[href="#contact-form"], a[href$="#contact-form"]').forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            history.pushState(null, null, "#contact-form");
            scrollToScopingForm();
        });
    });
})();
