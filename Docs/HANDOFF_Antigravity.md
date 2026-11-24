# Handoff: Geniebag Solutions website audit fixes

Status as of 24 Nov 2026. This file is self-contained: it has everything needed to continue the work.

Source audit: `Docs/Recruitment_Website_Design_Audit.pdf` (23 Nov 2026, 27 actions). It is untracked; read it but **do not commit it**.
Earlier, longer plan: `Docs/Audit_Fix_Plan.md`. This file replaces it where they differ. Client decisions made after that plan are in section 2.

---

## 1. Project overview

**What the site is.** Geniebag Solutions ("The Management Basket") is an HR compliance and audit consultancy that offers 6 audit modules and 3 engagement tiers. It is **not** a recruitment site. The audit was written as a recruitment-site review, so ignore its recruitment items.

**Hosting.** Vercel. The site is static HTML with no build step (`vercel.json`: `framework: null`, empty build and install commands, `outputDirectory: "."`, `cleanUrls: true`), plus one serverless function in `api/`. Live: https://genibag2-0.vercel.app

**Branch.** Work continues on **`audit-fixes`**. **Never commit to, merge into, or push to `main`.** Push `audit-fixes` to get a Vercel preview URL for testing.

```
audit-fixes:  b2d6da3  Phase 2: mobile menu / nav
              297ad62  Phase 1: contact form
main:         4d50efb  change Geniebag Logo   (branch point)
```

### Repo structure

| Path | What it is |
|---|---|
| `index.html` | Homepage, about 4,300 lines, with large inline `<style>` blocks (9 of them). Sections: hero slider (189), about/pillars (641), What We Do cards (1476), stats strip (~1605), Compliance Lens (1697), Method timeline (2626), Examine/deliverables (2972), Why Us (3119), Tiers (3831), FAQ (4088), CTA card `.gbh-cta` (4180), footer (4198). |
| `about.html`, `service.html`, `service-details.html`, `faq.html`, `contact.html`, `404.html` | The other 6 pages. Each has **its own copy** of the header, offcanvas (mobile menu) panel, CTA banner and footer. |
| `api/contact.js` | Contact-form endpoint, a Vercel Node function using CommonJS and no dependencies. It sends email through Resend. |
| `assets/css/main.css` | The real stylesheet, about 17,400 lines, **edited by hand**. Phase 2 CSS is the last block (from line ~17325, "Audit Phase 2"). |
| `assets/css/contact.css` | Contact page styles (`.gbc-*` classes). |
| `assets/scss/*` | Original template SCSS, **stale since April**. Do not use it. |
| `assets/js/main.js` | Global JS: meanmenu (line 13), offcanvas toggle (~32), the custom `.wow` scroll reveal (~111), GSAP ScrollSmoother/ScrollTrigger/SplitText (~930–1230), anchor smooth-scroll (~957). |
| `assets/js/contact.js` | Contact page: validation, service chips, and the submit handler (~323–385) that posts to `/api/contact`. |
| `assets/js/ajax-mail.js` | Old template AJAX poster. Removed from `contact.html` in Phase 1. Still included on `about`, `faq` and `service`, where it does nothing because those pages have no `#contact-form`. Safe to remove. |
| `assets/img/` | Images. Favicons: `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `favicon.ico`. Logo: `assets/img/logo/Logo2.png`. |
| `vercel.json` | Vercel config: clean URLs and asset caching. The **only** routing config Vercel uses. |
| `_redirects`, `.htaccess` | Netlify and Apache configs. Vercel ignores them. |
| `.vercelignore` | Excludes `dev-server.js`, `node_modules`, `_demo_templates_archive`, `Docs`, `plan.md`, `.htaccess` from deploys. |
| `dev-server.js` / `npm run dev` | live-server on http://127.0.0.1:3000 with clean URLs. **It does not run `api/`.** Use `npx vercel dev` or a preview deploy for the form. |
| `premium-vertical-timeline-*.html`, `PREMIUM-TIMELINE-README.md` | Scratch files for the current Method timeline. They are **deployed and publicly reachable** because they are not in `.vercelignore`. |
| `_demo_templates_archive/` | Original ThemeForest demo pages. Not deployed. |
| `plan.md` | Old (20 Nov) transformation plan. Obsolete. |
| `Docs/` | Audit PDF, these plans, and the client PPTX. Not deployed. |

---

## 2. Rules the next agent must follow

1. **Every shared change goes on all 7 pages.** The header, offcanvas panel, CTA banner and footer are copied into `index`, `about`, `service`, `service-details`, `faq`, `contact` and `404`. There are no includes. After each shared edit, grep all 7 files to confirm they match.
2. **Edit `assets/css/main.css` directly. Never compile SCSS.** The SCSS is the April template, and compiling it overwrites every brand change. Add new rules as a labelled block at the end of `main.css` (follow the "Audit Phase 2" block).
3. **`contact.php` is gone and must not come back.** Vercel does not run PHP. The form endpoint is `api/contact.js`.
4. **Never invent client facts.** That means phone number, office address, registration number, legal entity name, business hours, social profile URLs, testimonials, client logos and stats. Where one is needed, use a clearly marked placeholder that does not render, such as an HTML comment `<!-- CLIENT INPUT NEEDED: phone -->`. Placeholders must never be visible on the live site.
5. **Recruitment is not a service.** Audit Phase 7 (Employers, Jobs, Submit CV pages and their nav items) is **dropped**. Do not build it.
6. **Brand name: "Geniebag Solutions"** everywhere in visible text. **Primary CTA label: "Book a scoping call"** (sentence case) wherever the action is booking a call. Tier buttons may keep specific labels, in sentence case.
7. **One commit per phase** on `audit-fixes`, with a clear message describing what changed and why. **Do not commit the audit PDF** (`Docs/Recruitment_Website_Design_Audit.pdf`).
8. Line numbers in this file are from commit `b2d6da3`. They drift as you edit, so grep for the quoted text instead of trusting the numbers.
9. Files are LF in the working copy. Git warns about CRLF conversion on Windows; that is harmless.

---

## 3. Completed work

### Phase 1: Contact form (commit `297ad62`)

**Problem found.** The form had no `action`, and `assets/js/contact.js` showed a **fake success screen after 1.1 s without sending anything**. Every enquiry since launch was lost. The audit only said the form was "likely not delivered".

**Changes**
- **`api/contact.js`** (new) handles `POST /api/contact`:
  - Accepts urlencoded or JSON. Validates `name` (required), `email` (required, format check) and `consent` (must be `yes`). Optional fields: `phone`, `subject` (organisation/headcount), `services`, `message`. All fields are length-capped.
  - Honeypot field `company_website`: if filled, it returns success without sending anything.
  - Rate limit: 5 requests per 10 minutes per IP, **per serverless instance only** (a weak limit).
  - Sends plain-text email through `POST https://api.resend.com/emails`, with `reply_to` set to the visitor's email. CR/LF is stripped from header fields.
  - Replies `{ok:true}` or `{ok:false,error}` as JSON when the request has `Accept: application/json`. A plain form post (no JS) gets a small self-contained HTML thank-you or error page instead.
  - Status codes: 405 for non-POST, 400 for invalid input, 429 when rate-limited, 500 when `RESEND_API_KEY` is missing, 502 when Resend fails, 200 on success.
- **`contact.html`**
  - Line ~250: `<form id="contact-form" ... action="/api/contact" method="post">`.
  - Lines ~251–255: honeypot input, hidden off-screen.
  - Line ~310: the consent checkbox now has `name="consent" value="yes"`. Before this it was never sent.
  - Removed the `<script src="assets/js/ajax-mail.js">` tag near the end. It would have double-posted, and it blanked every input's `value`, including the checkbox's.
- **`assets/js/contact.js`**, submit handler ~323–385: removed the fake-success branch. It now builds `URLSearchParams(new FormData(form))`, adds `services` from the pressed chips, and `fetch`es with `Accept: application/json` and a 20 s abort. It shows the success panel **only** when `res.ok && json.ok === true`. Anything else shows an inline error in `.form-message` that includes info@geniebag.com.
- Deleted `contact.php`. Removed it from `.vercelignore`. Updated the README line describing the endpoint.

**Environment variables (Vercel → Project → Settings → Environment Variables).** **Not yet set: the form fails until they are.**

| Name | Required | Value |
|---|---|---|
| `RESEND_API_KEY` | yes | API key from resend.com. Without it, every submission returns a 500 error, never a fake success. |
| `CONTACT_FROM` | recommended | Default is `Geniebag Website <onboarding@resend.dev>`. **The resend.dev sender only delivers to the Resend account owner's own address**, so real delivery to info@geniebag.com needs `geniebag.com` verified in Resend and this set to something like `Geniebag Website <website@geniebag.com>`. |
| `CONTACT_TO` | optional | Default is `info@geniebag.com`. Separate several addresses with commas. |

**Tested.** I tested the handler locally with mocked req/res and a mocked Resend API. Every path returned the expected status: missing key, GET, valid post, missing consent, bad email, honeypot, no-JS post, string body, Resend failure, rate limit and header injection. **I have not tested it against real Resend or on a deployed URL.**

### Phase 2: Mobile menu and navigation (commit `b2d6da3`)

**Changes**
- **All 7 pages, offcanvas panel.** Added a `<div class="offcanvas__cta">` block just before `<div class="mobile-menu fix"></div>`. It is at about line 101 in most pages, ~107 in `faq`, and ~119 in `service-details`. It contains:
  - a full-width `a.theme-btn.offcanvas__book` "Book a Scoping Call" → `contact#contact-form`
  - `a.offcanvas__link` `mailto:info@geniebag.com`
  - an **HTML-comment placeholder for the `tel:` link** (waiting on the client phone number)
- **`assets/js/main.js` line 15.** `meanScreenWidth` changed from `"1199"` to `"991"`, so the desktop nav shows from 992px.
- **`assets/css/main.css`**, the "Audit Phase 2" block at the end (~17325+):
  - `.offcanvas__info { max-width: calc(100vw - 30px) }` fixes the panel clipping at 320px.
  - `.offcanvas__wrapper` gets extra left padding at ≤450px.
  - Styles for `.offcanvas__cta`, `.offcanvas__book` and `.offcanvas__link` (44px+ touch targets).
  - `@media (min-width: 992px)` hides `.header-1 .header__hamburger`.
  - `@media (992px–1199px)` shows the header CTA (`display:inline-flex`; it was `display:none` ≤1199px at main.css ~6323) and makes it compact (14px, 44px tall, 16px padding). It also sets nav link gap to 18px, links to 15px, `.header-right` gap to 14px, and logo max-width to 180px.
- On `/contact`, the existing same-page anchor handler (`main.js` ~957–1003) closes the panel and scrolls to the form when the menu CTA is tapped.

**Tested in headless Chrome** at 320, 360, 375, 390, 768, 991, 992, 1024, 1199, 1294 and 1440px on `/`, `/contact`, `/service` and `/404`. Results:
- No item in the panel is clipped. The panel sits from x=15 to vw−15 at 320–360px.
- The booking button is at the top of the panel.
- From 992px up, all 5 links are on one row, the CTA is visible, and there is no hamburger.
- There is no horizontal overflow at any width.

**Not done in Phase 2**
- Optional sticky bottom CTA bar on mobile (audit "optional"). Skipped.
- Phone link, which is blocked on the client.

---

## 4. Remaining work

Work in this order: **Phase 6 → Phase 5 → Phase 3 → Phase 4**, then optional items. Commit once per phase.
🔒 = **blocked on client input.** Do the unblocked parts and leave a non-rendering placeholder comment for the rest.
Item numbers match `Docs/Audit_Fix_Plan.md`.

### Phase 6: SEO and head tags (no client input needed)
*Status: Done. 7 unique titles (≤60 chars) & meta descriptions (≤155 chars), Open Graph & Twitter card tags, branded 1200x630 og-image.jpg, and single H1 per page verified.*

- [x] **29. Unique titles, meta descriptions and Open Graph tags.** Audit priority: Medium.
  - **Where:** `<head>` lines 17 (description) and 19 (`<title>`) in all 7 pages. `about`, `contact`, `faq` and `service` all share the title "Geniebag Solutions – HR Compliance & Audit Consultancy" and the same short description.
  - **Fix:** Write a unique `<title>` (≤60 chars) and meta description (≤155 chars) for each page, based on its content. Add `og:title`, `og:description`, `og:type=website`, `og:url` (absolute), `og:image` (absolute URL to a 1200×630 branded image) and `twitter:card=summary_large_image`. No OG image exists yet. Create one from the logo and brand colours (navy `#111B34`, orange `#EF6939`) at `assets/img/og-image.jpg`, or leave a TODO comment and use the logo for now.
  - **Verify:** `grep -n "<title>" *.html` shows 7 different titles. Each page has an `og:image` that loads (curl the URL and expect 200).
- [x] **30. Favicon.** Audit priority: Medium.
  - **Where:** Head lines 21–25 in every page already point to brand favicons added in commit `bd80ce2` on 23 Nov. That may have been after the audit ran.
  - **Fix:** Open the live site and a preview, and check the browser tab icon. If it shows the logo mark, close this item with no change. If not, check that `assets/img/favicon.svg` renders the brand mark, and check for a cached old `/favicon.ico` at the root.
  - **Verify:** The tab shows the Geniebag mark on every page, and `/apple-touch-icon.png` is 180×180.
- [x] **31. One `<h1>` per page.** Audit priority: Medium.
  - **Where:**
    - `index.html` 359 and 399: two hero slides each use `<h1>`, and the Swiper loop clones them, so the live page has 4.
    - `404.html` 196 and 205: two `<h1>`s.
  - **Fix:** Keep `<h1>` on the first hero slide only. Change the others to `<h2>` with the same classes, and add a CSS rule if the size changes. In `404.html`, keep one `<h1>` and make the big "404" a `<p>` or `<div>` with `aria-hidden` or the same styling.
  - **Verify:** In the rendered DOM (after Swiper init), `document.querySelectorAll('h1').length === 1` on all 7 pages.

### Phase 5: Layout polish (CSS/HTML; only item 28 needs client input)
*Status: Done. Items 19–27 verified via headless Chrome (container alignment, unified CTA banner, touch targets >=44px, logo >=36px on mobile, no button wrap, single card numbers, reduced FAQ hero, min 13px labels); item 28 imagery deduplicated so no stock image appears on more than one page, with non-rendering comments for client photos.*

- [x] **19. Services page container.** Audit priority: Medium.
  - **Where:** `service.html` 204 (`<section class="service-section-inners ...">`, module cards) and 351 (the tiers `<section class="section-padding fix section-bg">`).
  - **Fix:** Give their inner containers `max-width:1200px; margin:0 auto; padding-inline:24px`, matching the homepage container.
  - **Verify:** At 1024 and 1440px the first card's left edge lines up with the header logo's left edge, and no card touches the viewport edge.
- [x] **20. Same CTA banner on every page.** Audit priority: Medium.
  - **Where:** The cramped 88px banner "LET'S MAKE HR clearer. stronger. ready." with button "Get In Touch Today" is at `service.html` ~413–430, `service-details.html` ~602–620, `faq.html` ~339–357 and `404.html` ~222–240. The good version is `index.html` 4180 (`<section class="gbh-cta">`), but **its CSS is inline in an `index.html` `<style>` block at ~4045**.
  - **Fix:** Move the `.gbh-cta*` rules from `index.html` into `main.css`. Replace the 4 banners with the `.gbh-cta` markup. Use the headline "Let's make HR clearer, stronger, ready." and the button "Book a scoping call" → `contact#contact-form`.
  - **Verify:** The banner looks identical on Home, Services, Service details, FAQ and 404 at 1440 and 390px.
- [x] **21. Contact form touch targets.** Audit priority: Medium.
  - **Where:** `assets/css/contact.css` 313 (`.gbc-chip`), 333–342 (`.gbc-consent`, its label and `.gbc-consent__box`).
  - **Fix:** `.gbc-chip { min-height:44px; padding:10px 16px; }`. Make the consent `label` a block/flex element with `padding:12px 0` and `min-height:44px`, so the whole line is clickable.
  - **Verify:** At 320px, computed heights of every chip and the consent label are ≥44px, and tapping the label text toggles the box.
- [x] **22. Header logo on mobile.** Audit priority: Medium.
  - **Where:** `main.css` ~6262–6290 (`.header-1 .logo img` at ≤1199, ≤575 and ≤400px; at ≤400px it is `max-width:160px; height:auto`, which makes the tagline about 6px tall). Logo file: `assets/img/logo/Logo2.png` (changed in `4d50efb`).
  - **Fix:** Below 768px, keep the logo at least 36px tall and hide or crop the "(The Management Basket)" tagline. Use a logo-mark or no-tagline variant if one exists, or an SVG. Do not shrink the image further.
  - **Verify:** At 320px the logo wordmark is legible and the image is ≥36px tall.
- [x] **23. Buttons wrapping onto 2 lines.** Audit priority: Low.
  - **Where:** `service.html` 370 ("Scope Health Check" tier button). Footer CTA "Schedule Scoping Call" in each page: `index` 4262, `about` 1031, `service` 501, `service-details` 690, `faq` 427, `contact` 545, `404` 310.
  - **Fix:** `white-space:nowrap; padding-inline:24px` on these buttons, and let the button grow. Rename the footer CTA as part of item 18.
  - **Verify:** Every button label is on one line at 1024, 1294 and 1440px.
- [x] **24. Service cards show their number twice.** Audit priority: Low.
  - **Where:** `index.html` What We Do cards (~1495–1620). Each card has `<span class="gb-wwd__card-watermark">01</span>` (large faded number) and `<span class="gb-wwd__num">01</span>` (badge).
  - **Fix:** Remove the `.gb-wwd__card-watermark` spans (6 cards) or hide them in CSS. Keep the badge.
  - **Verify:** Each card shows its number once.
- [x] **25. About page whitespace.** Audit priority: Low.
  - **Where:** `about.html` 753 (`.gba-about-corp`, Purpose/Approach/Commitment cards; CSS at `main.css` ~16970+, `.gba-corp-grid` uses `align-items:start`) and 875 (`.gba-phil` Philosophy; CSS in the `about.html` inline `<style>` around line 333).
  - **Fix:** Use `align-items:center` on the two-column grids and remove fixed `min-height`s.
  - **Verify:** No empty block taller than 200px in these sections at 1024–1440px.
- [x] **26. FAQ hero height.** Audit priority: Low.
  - **Where:** `faq.html` ~195 (`<section class="breadcrumb-wrapper ..." style="... min-height: 380px ...">` plus inner `padding: 60px 15px` and theme breadcrumb padding). It renders about 709px tall.
  - **Fix:** Match the contact-page hero height: about 400px on desktop, about 260px on mobile.
  - **Verify:** At 1440×900 the first FAQ question is visible without scrolling.
- [x] **27. Small eyebrow labels.** Audit priority: Low.
  - **Where:**
    - "TIER 1", "FEATURED" and similar tags in the `index.html` tiers styles (`.gb-tiers__eyebrow` ~3269 plus the tier tag classes nearby) and in `service.html` tier cards.
    - `.gbh-eyebrow` (`index.html` ~496).
    - `.gbc-why__eyebrow` (`contact.css` 453, 12px).
    - `.section-title .sub-title` (`main.css` 12338).
  - **Fix:** At least 13px, `letter-spacing:.08em`, with 4.5:1 contrast against the background.
  - **Verify:** At 390px, no visible text has a computed font-size under 13px. Icon glyphs are exempt. Run the font-size scan in section 5.
- [x] 🔒 **28. Imagery.** Audit priority: Low.
  - **Where:** The same boardroom and business-person stock photos are reused across Home, About, FAQ and Contact (for example `assets/img/inner/faq-consultation.jpg`, used on About ~775).
  - **Fix:** Use one unique image per page with a consistent colour grade. Real team or office photos come from the client. Until then, at least stop reusing the same file.
  - **Verify:** No image file appears on more than one page: `grep -oh 'assets/img/[^"'"'"' )]*' *.html | sort | uniq -c`.

### Phase 3: Animations and a shorter homepage (highest regression risk)

- [ ] **9. Content visible without JS, and less animation.** Audit priority: Medium.
  - **Where:** `assets/js/main.js`:
    - ~111–200: custom `.wow` reveal. It sets `visibility:hidden` on every `.wow` element, then reveals per frame.
    - ~1056–1085: `.split-title` SplitText letter-by-letter typing on headings.
    - ~1090–1160: `.tz-sub-tilte` and `.tz-itm-title` SplitText char animations, starting at opacity 0 and 0.3.
    - ~930–950: ScrollSmoother setup; a reduced-motion check already exists at ~937.
    - ~1224: `gsap.from(boxes…)`.
  - **Fix:**
    1. Text must be visible with JS off. Hidden states may only be applied by JS after it runs, never in static CSS or HTML.
    2. Remove the letter-by-letter typing on H1/H2 (`.split-title`). A whole-line fade or short slide is fine.
    3. Put all reveal and SplitText setup inside `if (matchMedia('(prefers-reduced-motion: no-preference)').matches)`, or `gsap.matchMedia()`.
    4. Make sure anchor jumps (`#contact-form`, `service#compliance` etc.) arrive at fully revealed content.
  - **Verify:**
    - With JS disabled (DevTools → Disable JavaScript), every section shows its text.
    - With reduced motion on (DevTools Rendering → `prefers-reduced-motion: reduce`), nothing animates.
    - Opening `/contact#contact-form` directly shows the full form.
    - Fast-scrolling the homepage leaves no blank sections.
- [ ] **10. Shorter homepage.** Audit priority: Medium.
  - **Where:** The homepage is about 20,300px tall at 390px. The Method timeline section is `index.html` 1781–2970 (CSS inline from ~1785, markup `<section class="gb-method" id="methodology">` at 2626, `.gb-timeline__card` / `.gb-timeline__node` per stage). It is about 3,527px tall on desktop and ends in a large empty dark band. The full tiers section is at 3831–3975.
  - **Fix:**
    - Method timeline: a 3×2 card grid on desktop, and a swipeable carousel or accordion on mobile. Remove the trailing empty band.
    - Replace the full tiers section on Home with a short teaser linking to `/service#tiers` (or `/service`).
    - Check other long sections for content that can be cut.
    - After replacing the timeline, delete `premium-vertical-timeline-html.html`, `premium-vertical-timeline-style.html` and `PREMIUM-TIMELINE-README.md` from the repo root. They are publicly deployed scratch files.
  - **Verify:** `document.documentElement.scrollHeight` on `/` at 390px is under about 10,000px. No empty band taller than 200px at any width.
- [ ] **11. Hero slider arrows overlap text.** Audit priority: Medium.
  - **Where:** `index.html` 341 and 344 (`button.hero-arrow--prev/--next`). Their CSS is inline in `index.html` ~194–240.
  - **Fix:** Below 768px, hide `.hero-1 .hero-arrow` and use swipe plus pagination dots placed under the CTA buttons. Add dots if none exist.
  - **Verify:** At 320 and 390px no control overlaps text, and swiping changes the slide (test with touch emulation).
- [ ] **12. Scroll-to-top button covers content.** Audit priority: Medium.
  - **Where:** `index.html` 77 (`button#back-top.back-to-top`, the same on all pages). CSS at `main.css` ~11336–11400. Its show logic is in `main.js`; grep `back-top`.
  - **Fix:** Show it only after scrolling 1.5× the viewport height, make it 40px, and add `padding-bottom:72px` to the last section on mobile. Or hide it below 768px.
  - **Verify:** At 390px, no text or form control (including contact chips) is covered at any scroll position.

### Phase 4: Trust content and consistent naming

- [ ] 🔒 **13. Contact details on every page.** Audit priority: Medium.
  - **Where:**
    - The footer of all 7 pages (footer contact column near the "Schedule Scoping Call" button; see the item 23 lines).
    - The footer bottom bar ("© 2026 Geniebag Solutions …").
    - `contact.html` 214 (`<ul class="gbc-info">` info cards).
    - The offcanvas `.offcanvas__cta` phone placeholder comment (Phase 2).
    - The `off-contact-info` block. It has 2 variants: `index`, `service-details` and `404` show "Consultation & Inquiries / Expertise / Engagement"; the other 4 show "Contact Info / Email / Consultation". Make them the same.
  - **Fix:** Add email now. Phone (`tel:`), registered address, business hours, legal entity name and registration number need the client, so add placeholder comments for them. Do not render fake values.
  - **Verify:** Email, plus phone and address once supplied, are visible in the footer at 390 and 1440px, and `tel:` opens the dialler on a phone.
- [ ] 🔒 **14. Social links.** Audit priority: Medium.
  - **Where:**
    - Footer icons with `href="javascript:void(0)"` (LinkedIn, Twitter, Facebook), 3 per page: `index` 4215, `about` 984, `service` 454, `service-details` 643, `faq` 380, `contact` 498, `404` 263.
    - Offcanvas "Follow us" LinkedIn `href="https://linkedin.com"` at ~129–147 in each page. `about.html` 842 also uses it.
  - **Fix:** Remove every icon that has no real company profile (now: all of them except email). When the client supplies URLs, add them back with `target="_blank" rel="noopener"` and `aria-label="Geniebag Solutions on LinkedIn"`.
  - **Verify:** `grep -c "javascript:void(0)\|https://linkedin.com\"" *.html` gives 0, and every remaining icon opens the right profile in a new tab.
- [ ] **15. Unsupported claims.** Audit priority: Medium.
  - **Where:**
    - `service.html` ~595 "Confidential & Legally Vetted Deliverable" (module modal).
    - `contact.html` ~378 "ISO-Aligned & Statutory Confidentiality".
    - `index.html` 1605–1622 stats strip: "100% Statutory & Practical Scope", "0 Unnecessary Disruption" and the others.
  - **Fix:** Reword to supportable statements that match the FAQ disclaimer ("not a guarantee of legal compliance"), for example "Confidential deliverable" and "Statutory confidentiality". 🔒 Replace the stats with verifiable numbers (audits completed, years in practice, states covered, industries served) once the client supplies them. Until then, use non-numeric labels or hide the strip.
  - **Verify:** `grep -in "vetted\|iso-\|guarantee\|certified\|100%\|unnecessary disruption" *.html` returns only supported text, including the disclaimer.
- [ ] 🔒 **16. Testimonials and client logos.** Audit priority: Medium.
  - **Where:** `index.html`, a new block above the tiers teaser (tiers is currently at 3831).
  - **Fix:** Build the markup and CSS for 3 testimonials (quote, name, role, company) and a logo row, but **keep them out of the page** (commented out or not added) until the client supplies real, permitted content. Do not use placeholder names or quotes on the live site.
  - **Verify:** Once there is content: at 1440px, Home shows at least one testimonial and one verifiable metric within 2 scrolls.
- [ ] **17. One name for each module.** Audit priority: Medium.
  - **Canonical names** (from README and the homepage cards):
    1. HR Compliance Review
    2. HR Process Audit
    3. Policy & Documentation Review
    4. Employee Records Audit
    5. Compensation & Benefits Review
    6. Action Plan & Advisory
  - **Where they differ:**
    - `service.html` modal titles in JS at 831, 843, 855, 867, 879 and 891 (for example "HR Statutory & Compliance Audit").
    - Service card `<h3>`s at 219–329.
    - Homepage cards ~1495–1620.
    - Footer "Audit Modules" links in all 7 pages.
    - `contact.html` chips ~291–296 ("Compliance Review", "Records Audit", and others). Chip text is sent as the `services` value; that is fine.
    - Hero marquee chips in `index.html` (~430–455).
  - **Fix:** Use the canonical names everywhere a module is named. Descriptive subtitles under a name are fine.
  - **Verify:** Grep each canonical name. Every location uses it, and no old variant remains (`grep -n "Statutory & Compliance Audit\|Operations & Process Audit\|Records Audit\"" *.html`).
- [ ] **18. One brand name and one CTA label.** Audit priority: Low (CTA wording) / Medium (brand, part of service naming).
  - **Where:**
    - Brand variants: `index.html` 357 hero eyebrow "GENIE BAG HR CONSULTANCY • THE MANAGEMENT BASKET"; `index.html` ~3125 "Why Genie Bag" eyebrow; `about.html` 760 "ABOUT GENIE BAG SOLUTIONS" and 775 alt text; `service.html` 559 "Genie Bag HR Audit Suite". Also grep `-i "genie bag"` for visible text (HTML comments don't matter).
    - CTA variants: "Book A Scoping Call" or "Book a Scoping Call" at `*.html` lines ~102 and ~171 (offcanvas and header), `index` 375, 415, 3960, 3971, 4191; "Get In Touch Today" (CTA banners, item 20); "Schedule Scoping Call" (footers, item 23, plus `index` 2871); "Talk to us" (`index` ~3971); "Request Support" (`service.html` 404, `index` ~3960).
    - Watch for CSS `text-transform: capitalize` on `.theme-btn`, which renders "Book A Scoping Call" even when the source text is sentence case. Override it where needed.
  - **Fix:** Visible brand text is "Geniebag Solutions". The primary booking CTA is "Book a scoping call" in the header, offcanvas, hero, CTA banners, footers and modals. Tier buttons stay specific, in sentence case (for example "Book a health check").
  - **Verify:** In the rendered DOM, the primary CTA text is identical in the header, hero, CTA banner, footer and modals. `grep -in "genie bag" *.html`, excluding comments, returns nothing.

### Optional / leftovers

- [ ] **5. Sticky bottom CTA bar on mobile.** Audit priority: High-optional. Only if wanted: show it at ≤767px and hide it on `/contact`. It must not overlap the back-to-top button.
- [ ] Remove the dead `<script src="assets/js/ajax-mail.js">` from `about.html`, `faq.html` and `service.html`, and the file itself if nothing else uses it.
- [ ] Not a code task: because recruitment is not a service, the client should remove recruitment wording from outside marketing (job boards, LinkedIn, ads) that links to the site.

---

## 5. Verification checklist

### Viewports
Test every phase at **320, 360, 375, 390, 768, 991, 992, 1024, 1199, 1294 and 1440px**. 991 and 992 are either side of the nav breakpoint; 1199 and 1200 are either side of the old one.

### Running the headless Chrome checks (Windows, Git Bash)

1. Start the static server: `npm run dev` (http://127.0.0.1:3000). It does **not** serve `api/`.
2. Save the script below as a file **outside the repo** (for example in a temp folder) and run:
   ```bash
   MSYS_NO_PATHCONV=1 node check-menu.js "<outDir>" "/" "320,360,375,390,768,991,992,1024,1199,1294,1440"
   MSYS_NO_PATHCONV=1 node check-menu.js "<outDir>" "/contact" "320,1024"
   ```
   **`MSYS_NO_PATHCONV=1` is required in Git Bash.** Without it, `/` gets rewritten to `C:/Program Files/Git/` and every page fails to load.
3. It prints header metrics per width and, below 992px, opens the menu and prints panel metrics. It saves `<page>-<width>-header.png` and `-menu.png` to `<outDir>`. `<outDir>/../chrome-profile` is used as a throwaway Chrome profile. It needs Node 18+ (it uses the global `fetch` and `WebSocket`; Node 22 was used) and Chrome at the default path.

```js
// check-menu.js: headless Chrome via the DevTools protocol. Usage: node check-menu.js <outDir> <path> <w,w,...>
const { spawn } = require("child_process");
const fs = require("fs");
const [outDir, pagePath, widthsArg] = process.argv.slice(2);
const widths = widthsArg.split(",").map(Number);
fs.mkdirSync(outDir, { recursive: true });
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",
  ["--headless=new", "--remote-debugging-port=9333", "--user-data-dir=" + outDir + "/../chrome-profile", "--hide-scrollbars", "about:blank"]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  let targets;
  for (let i = 0; i < 40; i++) { try { targets = await (await fetch("http://127.0.0.1:9333/json")).json(); break; } catch { await sleep(250); } }
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0; const pending = {};
  ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value;
  const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(`${outDir}/${name}.png`, Buffer.from(r.result.data, "base64")); };
  await send("Page.enable");
  for (const w of widths) {
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: w < 992 ? 760 : 900, deviceScaleFactor: 1, mobile: w < 992 });
    await send("Page.navigate", { url: "http://127.0.0.1:3000" + pagePath });
    await sleep(4500); // preloader + ScrollSmoother
    const header = await evaluate(`(() => {
      const vis = (el) => { if (!el) return null; const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return s.display !== "none" && s.visibility !== "hidden" && r.width > 0 ? { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) } : null; };
      const links = [...document.querySelectorAll("#mobile-menu > ul > li > a")].map(vis);
      return { vw: innerWidth, navLinksVisible: links.filter(Boolean).length, navRows: new Set(links.filter(Boolean).map(x => x.t)).size,
        cta: vis(document.querySelector(".header-1 .header-right .theme-btn")), hamburger: vis(document.querySelector(".header__hamburger")),
        overflowX: document.documentElement.scrollWidth > innerWidth, pageHeight: document.documentElement.scrollHeight,
        h1Count: document.querySelectorAll("h1").length };
    })()`);
    console.log(`\n=== ${pagePath} @ ${w}px header`, JSON.stringify(header));
    await shot(`${pagePath.replace(/\W/g, "") || "home"}-${w}-header`);
    if (header.hamburger) {
      await evaluate(`document.querySelector(".sidebar__toggle").click()`);
      await sleep(800);
      const panel = await evaluate(`(() => {
        const box = (el) => { const r = el.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height) }; };
        const p = document.querySelector(".offcanvas__info");
        const items = [...p.querySelectorAll(".mean-nav > ul > li > a, .offcanvas__close button, .offcanvas__book, .offcanvas__link")];
        const clipped = items.filter((a) => { const r = a.getBoundingClientRect(); return r.left < 0 || r.right > innerWidth; }).map((a) => a.textContent.trim() || a.className);
        return { panel: box(p), clipped, book: box(p.querySelector(".offcanvas__book")), email: box(p.querySelector(".offcanvas__link")),
          menuLinks: [...p.querySelectorAll(".mean-nav > ul > li > a")].map(a => a.textContent.trim()) };
      })()`);
      console.log(`    panel open`, JSON.stringify(panel));
      await shot(`${pagePath.replace(/\W/g, "") || "home"}-${w}-menu`);
    }
  }
  ws.close(); chrome.kill();
})().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
```

You can extend the `evaluate` expressions per phase. Useful one-liners to paste in:
- Small text scan (item 27): `[...document.querySelectorAll("body *")].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 13).map(e => e.className + ": " + e.textContent.trim().slice(0, 30))`
- Touch targets (item 21): `[...document.querySelectorAll(".gbc-chip, .gbc-consent label")].map(e => Math.round(e.getBoundingClientRect().height))`
- To screenshot the full page height, pass `captureBeyondViewport: true` with a `clip` to `Page.captureScreenshot`. To emulate reduced motion, use `Emulation.setEmulatedMedia { features: [{ name: "prefers-reduced-motion", value: "reduce" }] }`. To turn JS off, use `Emulation.setScriptExecutionDisabled { value: true }`.

### Per-phase pass/fail checks

**Phase 1: form** (needs a Vercel preview or `npx vercel dev` with the env vars set)
- [ ] Valid submission in the browser: the network tab shows `POST /api/contact` → **200** `{"ok":true}`, the email arrives at info@geniebag.com with reply-to set to the visitor, the "Thanks!" panel shows, and the URL contains no form data.
- [ ] Success shows **only** on a 2xx response with `ok:true`. Test this by removing `RESEND_API_KEY` from the preview (or point `CONTACT_FROM` at an unverified domain): the response is 500/502, an **inline error** with info@geniebag.com appears, and no success panel shows.
- [ ] Invalid input is blocked client-side (empty name, bad email, unticked consent), with nothing sent. Direct API tests:
  ```bash
  curl -s -X POST -H "Accept: application/json" -d "name=Test&email=bad&consent=yes" https://<preview>/api/contact   # 400
  curl -s -X POST -H "Accept: application/json" -d "name=Test&email=t@example.com" https://<preview>/api/contact       # 400 (no consent)
  curl -s https://<preview>/api/contact                                                                                # 405
  ```
- [ ] With JS disabled, submitting the form shows the HTML "Thank you" page, and the email arrives.
- [ ] Selected service chips appear in the email's "Services:" line.

**Phase 2: menu and nav** (passed in local headless Chrome; re-check on a real phone)
- [ ] At 320, 360 and 375px every menu label and the close icon are fully visible (`clipped: []`).
- [ ] At 390 and 768px the menu's top item is "Book a Scoping Call" and goes to the contact form in one tap.
- [ ] At 992–1440px: 5 nav links on one row, the CTA visible, no hamburger. At ≤991px: a hamburger and no inline nav.
- [ ] No horizontal overflow at any width.

**Phase 6: SEO**
- [ ] 7 unique `<title>`s and descriptions. OG tags present and the `og:image` URL returns 200.
- [ ] `h1Count === 1` on every page after JS runs.
- [ ] The favicon shows the brand mark in the tab.

**Phase 5: layout**
- [ ] Service cards line up with the logo at 1024/1440. The CTA banner is identical on all pages. Chips and consent are ≥44px. The logo is ≥36px tall at 320. No wrapped buttons at 1024–1440. One number per card. No empty block over 200px in About. FAQ question 1 is visible at 1440×900. No text under 13px.

**Phase 3: animations and length**
- [ ] With JS off, all text is visible. With reduced motion, there is no animation. No letter-by-letter headings. Anchor links land on visible content.
- [ ] Homepage `pageHeight` at 390px is under about 10,000. No empty band over 200px. No hero arrows under 768px, and swipe works. Back-to-top covers nothing at 390px.
- [ ] Re-run the full Phase 2 menu check: ScrollSmoother changes can break the offcanvas and anchors.

**Phase 4: trust and naming**
- [ ] No `javascript:void(0)` and no bare `linkedin.com` links. The claims grep is clean. Module names and the brand name are identical everywhere. The primary CTA is "Book a scoping call" everywhere. No fake contact data, testimonials or stats are rendered.

**Before merging to `main`** (the owner does this, not the agent): Lighthouse (performance and accessibility), real iOS Safari and Android devices, keyboard-only navigation through the menu and the form.

---

## 6. Known risks and open questions

- **Phase 3 is the riskiest work.**
  - `main.js` combines GSAP ScrollSmoother (the page sits inside `#smooth-wrapper` / `#smooth-content`) with a custom per-frame `.wow` reveal written specifically to work around ScrollSmoother (see the comment at ~111).
  - Changing reveal logic or section heights can break anchor scrolling, the offcanvas, sticky header behaviour and the Method timeline's own scroll logic (commit `c508665`).
  - Change one thing at a time. Re-test anchors (`/contact#contact-form`, `/service#compliance`), the mobile menu and fast scrolling after each change.
- **Homepage length (item 10)** means rewriting the Method timeline, which has a lot of inline CSS and JS in `index.html` (~1781–2970). Check the whole block before deleting anything, and make sure no scripts elsewhere query `.gb-timeline*` (grep `main.js` and the inline scripts).
- **Favicon:** brand favicons were added in `bd80ce2` on 23 Nov, possibly after the audit ran. Check the live site before changing anything.
- **The form has not been tested end to end.** `RESEND_API_KEY` is not set in Vercel yet. With only the default `onboarding@resend.dev` sender, mail **will not reach info@geniebag.com** until `geniebag.com` is verified in Resend and `CONTACT_FROM` is set. Tell the owner if this blocks testing.
- **Rate limiting in `api/contact.js` is per serverless instance.** It slows bursts but is not real protection. Spam protection is the honeypot only. If spam becomes a problem, add Cloudflare Turnstile or Vercel KV-backed limiting.
- **Local dev does not run the API.** `npm run dev` gives a 404 for `/api/contact`, so form submissions fail locally with the inline error. That is expected. Use `npx vercel dev` (needs a Vercel login) or a preview deploy.
- **CSS specificity:** many styles are inline (`style="..."`) or in page `<style>` blocks, sometimes with `!important`. A `main.css` rule may not win. Check computed styles, and edit the inline style when needed.
- **`.theme-btn` may apply `text-transform: capitalize`.** In the Phase 2 screenshots the menu button rendered "Book A Scoping Call". Sentence-case labels (item 18) need a CSS override.
- **The two offcanvas info variants** (see item 13) are an existing inconsistency, not a bug introduced by Phase 2.
- **Publicly deployed scratch files** (`premium-vertical-timeline-*.html`, `PREMIUM-TIMELINE-README.md`, root `Logo.jpeg`, `Logo2.png`, `Geniebag Solutions Logo.png`, `Orange Figure Reaching for Starry Bag.webp`) can be reached at their URLs because they are not in `.vercelignore`. Ask the owner before deleting the logo files. Some may be source assets.
- **Open client questions (🔒):** phone number, registered address, business hours, legal entity name and registration number, real social profile URLs, 3 testimonials with permission, client logos with permission, verifiable stats, and real team or office photos.
- **Audit coverage gaps** (the audit did not test these): real devices, Safari, swipe gestures, Lighthouse/Core Web Vitals, screen reader and full keyboard navigation.
