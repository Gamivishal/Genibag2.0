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

    /* ---------- 2. Typewriter for the intro eyebrow + heading ---------- */
    function prepareType(el) {
        var text = el.textContent.replace(/\s+/g, " ").trim();
        el.textContent = "";
        var sr = document.createElement("span");
        sr.className = "gbc-sr";
        sr.textContent = text;
        var visual = document.createElement("span");
        visual.setAttribute("aria-hidden", "true");
        var chars = [];
        text.split(" ").forEach(function (word, wi, words) {
            var w = document.createElement("span");
            w.className = "gbc-type__word";
            for (var i = 0; i < word.length; i++) {
                var c = document.createElement("span");
                c.className = "gbc-type__ch";
                c.textContent = word[i];
                w.appendChild(c);
                chars.push(c);
            }
            visual.appendChild(w);
            if (wi < words.length - 1) {
                var s = document.createElement("span");
                s.className = "gbc-type__ch gbc-type__space";
                s.textContent = " ";
                visual.appendChild(s);
                chars.push(s);
            }
        });
        el.appendChild(sr);
        el.appendChild(visual);
        return { el: el, chars: chars, visual: visual };
    }

    function typeOut(t, speed) {
        return new Promise(function (resolve) {
            var caret = document.createElement("span");
            caret.className = "gbc-caret is-typing";
            t.visual.insertBefore(caret, t.visual.firstChild);
            var i = 0;
            (function step() {
                if (i >= t.chars.length) {
                    caret.classList.remove("is-typing");
                    resolve(caret);
                    return;
                }
                var ch = t.chars[i++];
                ch.classList.add("is-on");
                ch.after(caret);
                var isSpace = ch.classList.contains("gbc-type__space");
                setTimeout(step, isSpace ? speed * 0.6 : speed + Math.random() * speed * 0.5);
            })();
        });
    }

    var typeEls = Array.prototype.slice.call(document.querySelectorAll(".gbc-type"))
        .sort(function (a, b) { return (+a.dataset.typeOrder || 0) - (+b.dataset.typeOrder || 0); });

    if (!reduceMotion && typeEls.length) {
        var typed = typeEls.map(prepareType);
        var started = false;
        var runTyping = function () {
            if (started) return;
            started = true;
            var chain = Promise.resolve();
            typed.forEach(function (t, idx) {
                var last = idx === typed.length - 1;
                chain = chain.then(function () {
                    return typeOut(t, last ? 38 : 60).then(function (caret) {
                        if (!last) { caret.remove(); return; }
                        // final caret blinks briefly, then fades away
                        setTimeout(function () {
                            caret.classList.add("is-fading");
                            setTimeout(function () { caret.remove(); }, 700);
                        }, 2600);
                    });
                });
            });
        };
        var head = typeEls[0].closest(".gbc-head") || typeEls[0];
        if ("IntersectionObserver" in window) {
            var tio = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                        tio.disconnect();
                        // wait for the loader before typing if the heading is visible on load
                        setTimeout(runTyping, heroDone ? 150 : 900);
                    }
                });
            }, { threshold: 0.4 });
            tio.observe(head);
        } else {
            runTyping();
        }
    }

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

            // The chosen services travel inside the existing "message" field (no new field names).
            var chosen = chips.filter(function (c) { return c.getAttribute("aria-pressed") === "true"; })
                .map(function (c) { return c.textContent.trim(); });
            if (message && chosen.length) {
                var original = message.value;
                message.value = "Service of interest: " + chosen.join(", ") + (original ? "\n\n" + original : "");
                setTimeout(function () { message.value = original; }, 0); // restored after ajax-mail serialises
            }

            if (msgBox) { msgBox.textContent = ""; msgBox.className = "form-message gbc-form__msg"; }
            setLoading(true);

            if (form.getAttribute("action")) {
                // A real endpoint is configured: follow ajax-mail.js's result in .form-message.
                var done = false;
                var mo = new MutationObserver(function () {
                    if (done) return;
                    if (msgBox.classList.contains("success")) { done = true; mo.disconnect(); showSuccess(); }
                    else if (msgBox.classList.contains("error")) { done = true; mo.disconnect(); setLoading(false); }
                });
                mo.observe(msgBox, { attributes: true, childList: true });
                setTimeout(function () {
                    if (done) return;
                    done = true; mo.disconnect(); setLoading(false);
                    msgBox.textContent = "This is taking longer than expected. Please try again or email info@geniebag.com.";
                }, 20000);
            } else {
                // No endpoint configured (current setup): confirm as the page always has.
                form.classList.add("is-quiet");
                setTimeout(showSuccess, 1100);
            }
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
})();
