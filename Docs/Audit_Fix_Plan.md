# Audit Fix Plan: Geniebag Solutions website

Source: `Docs/Recruitment_Website_Design_Audit.pdf` (23 Nov 2026, 27 actions: 4 High, 14 Medium, 9 Low)
Site: https://genibag2-0.vercel.app (static HTML on Vercel, `cleanUrls: true`)

---

## 0. How this project is built (read before you change anything)

| Fact | What it means for the fixes |
|---|---|
| 7 plain HTML pages: `index`, `about`, `service`, `service-details`, `faq`, `contact`, `404`. No templating or includes. | Header, offcanvas menu, CTA banner and footer are **copied into every page**. Each shared fix has to be made 7 times, and the copies have to stay identical. |
| `assets/css/main.css` is edited by hand (last change 23 Nov). `assets/scss/*` has not changed since the template (April). | **Do not recompile SCSS.** It would overwrite every brand change. Put new CSS in `main.css`, or better in a new `assets/css/fixes.css` loaded after it. |
| Many inline `style="..."` attributes and `<style>` blocks (index.html has 9). | Some fixes (footer social icons, CTA banner) mean editing inline styles in each page. |
| `contact.php` is in `.vercelignore` and never runs on Vercel. It is also broken: recipient `example@example.com`, wrong `mail()` arguments. | It cannot be the form endpoint. Delete it or leave it ignored. |
| GSAP ScrollSmoother + ScrollTrigger + SplitText run from `assets/js/main.js` (~line 930 onward). | The animation fixes (Phase 3) go here. |
| `_redirects` and `.htaccess` are for Netlify and Apache. Vercel uses only `vercel.json`. | Add new routes (e.g. `/employers`) by creating the `.html` file. `cleanUrls` handles the rest. |

### A finding that is worse than the audit says
The audit says enquiries are "likely not delivered". In fact **none are delivered, and the visitor is told they were.** In `assets/js/contact.js:363-367`, when the form has no `action`, the code waits 1.1 s and shows the success screen without sending anything. Every enquiry since launch has been lost without anyone knowing. This is the first thing to fix.

---

## 1. Decisions needed from the client before building

| # | Decision | Why it blocks work |
|---|---|---|
| D1 | **Is recruitment a service?** (a) Yes: build Employers + Jobs + Submit CV. (b) No: stay an HR compliance and audit consultancy and remove recruitment from all marketing that links to the site. | The site is an audit consultancy: README, all 6 modules, the PPTX. The audit was written as a recruitment-site review. Option (b) removes the largest High item. **Recommendation: (b), unless the client actually places candidates.** |
| D2 | **Form endpoint:** a Vercel serverless function (`/api/contact`) that sends email through Resend, SendGrid or SMTP, *or* Formspree. | A Vercel function needs an email-provider API key in Vercel environment variables. Formspree needs no code but is a third-party service with plan limits. **Recommendation: Vercel function + Resend.** |
| D3 | **Real trust content:** phone, registered address, business hours, legal entity name and registration number, LinkedIn company URL (and any other live social profiles), 3 testimonials with permission, client logos with permission, verifiable stats (audits done, years, states, industries). | The audit's trust items cannot be done without real data. **Do not invent any of it.** |
| D4 | **One brand name:** "Geniebag Solutions" (recommended) versus "Genie Bag HR Consultancy". One primary CTA label: "Book a scoping call". | Every page and modal is renamed to match. |
| D5 | Real team or office photos available? | Needed for the Low "Imagery" item only. |

---

## 2. Phases

Each phase ends with a deploy to a Vercel preview, followed by the "How to verify" checks from the audit table.

### Phase 1: Stop losing enquiries (High, start now, needs D2)

1. **Form endpoint**
   - Add `api/contact.js` (Vercel Node function). Accept POST only. Validate `name`, `email`, `message`, `phone`, `subject`, consent. Add a honeypot field and basic rate limiting. Send to `info@geniebag.com` through the provider. Return JSON `{ok:true}` or `{ok:false,error}`. Store the API key in a Vercel env var, never in the repo.
   - `contact.html:244`: add `action="/api/contact" method="post"` and a hidden honeypot input.
   - `assets/js/ajax-mail.js`: add `dataType: 'json'`. Treat only a 2xx response with `ok:true` as success. On failure, show an inline error that includes `info@geniebag.com`. Stop using `response` text as the message.
   - `assets/js/contact.js:363-367`: **remove the fake-success branch.** If there is no `action`, show an error.
   - JS disabled: the function must accept a normal form POST and redirect to `/contact?sent=1` (or a thank-you page), so the form still works without JS.
   - Remove `contact.php` (or keep it ignored) so no one thinks it is live.
2. **Pass the consent value.** The consent checkbox at `contact.html:299` has no `name`, so it is never sent. Add `name="consent" value="yes"`.

### Phase 2: Mobile menu and navigation (High + Low, CSS and HTML only)

3. **Clipped offcanvas at 320px.** In `main.css` (~6849, 7034-7041), the widths 470/390/340px combined with `translateX(-15px)` push the panel off-screen. Set `.offcanvas__info { width: min(470px, calc(100vw - 16px)); }` and keep the same rule at the 575/450 breakpoints. Check the open-state transform so the left edge stays at x ≥ 0. Add left padding to `.offcanvas__wrapper`.
4. **Booking CTA in the menu (all 7 pages).** At the top of the `.offcanvas__info` block (`index.html:83`, and the same block on every other page), add a full-width "Book a scoping call" button → `/contact#contact-form`, a `tel:` link (needs D3) and a `mailto:info@geniebag.com` link. This also fixes the empty desktop side panel (Screenshot 8).
5. **Sticky mobile CTA bar (optional).** Show a bottom bar at ≤767px, hidden on `/contact`.
6. **Hamburger at ≥1200px.** Hide `.header__hamburger` at desktop widths (`main.css` ~6201), or keep it once the panel has real content (item 4). Recommendation: hide it.
7. **Nav breakpoint.** Show the desktop nav from 992px with a 20px gap between links and a smaller CTA, so all 5 links and the CTA fit at 1024px.
8. **Recruitment nav** (only if D1 = Yes): add "For Employers" and "Jobs" to the nav, the menu panel and the footer on all 7 pages. See Phase 6.

### Phase 3: Content visible without JS, and a shorter homepage (Medium)

9. **Reveal animations** (`main.js` ~930-1140):
   - Text must be visible in the CSS. Animate *from* `opacity:0` with `gsap.from()` only after JS has loaded (for example, add `.js-anim` to `<html>` and scope the hidden state to it).
   - Remove the SplitText typewriter effect on H1/H2. A short fade or slide-in of the whole line is acceptable.
   - Wrap all ScrollTrigger and SplitText setup in `matchMedia('(prefers-reduced-motion: no-preference)')`. Some code already checks this (line 937). Make it cover everything.
   - Check that anchor jumps (`#contact-form`, `#compliance` …) arrive at fully rendered content when ScrollSmoother is on.
10. **Shorten the homepage** (currently ~20,300px at 390px; target under 10,000px):
    - Method timeline: show a 3×2 card grid on desktop and a carousel or accordion on mobile. Remove the empty dark band after Stage 06. (`PREMIUM-TIMELINE-README.md` and the two `premium-vertical-timeline-*.html` files are the current timeline. Retire them when the new version replaces it.)
    - Replace the full tiers section on Home with a short teaser that links to `/service`.
    - Review other long sections ("A Closer Look at Your HR Operating System" and others) for any that can be cut or collapsed.
11. **Hero slider** (`index.html:343-400`): hide the arrows below 768px and place the pagination dots under the CTAs. Only the first slide keeps `<h1>`. Change the others to `<h2>` (Swiper loop clones then produce no extra H1s).
12. **Scroll-to-top** (`.back-to-top`, `main.css` ~11336): show it after 1.5 screens of scroll, make it 40px, and add bottom padding to the last section on mobile, or hide it below 768px.

### Phase 4: Trust and consistency (Medium, needs D3 and D4)

13. **Contact details everywhere.** Add phone, address, hours and email to the footer, the contact info cards and the menu panel. Add the legal name and registration number to the footer bottom bar. Do this on all 7 pages.
14. **Social links.** The footer has `javascript:void(0)` LinkedIn, Twitter and Facebook links (`index.html:4209-4211` and the same block on other pages), and the header uses `https://linkedin.com`. Point each to the real profile with `target="_blank" rel="noopener"` and an `aria-label`. Delete any icon without a live profile.
15. **Unsupported claims.** Remove or substantiate:
    - `service.html:589` "Confidential & Legally Vetted Deliverable"
    - `contact.html:367` "ISO-Aligned & Statutory Confidentiality"
    - `index.html:~1615` stats strip ("0 Unnecessary Disruption", "100% Statutory & Practical Scope"). Replace with verifiable numbers from D3.
    - Run `grep -i "vetted\|iso\|guarantee\|certified"` across `*.html` until every hit is supported or gone. Wording must match the FAQ disclaimer.
16. **Testimonials and client logos.** Add a 3-testimonial block and a logo row to Home, above the tiers teaser. The template already has `_testimonial.scss` and `_brand.scss` styles in `main.css` to reuse.
17. **One name for each module.** Make a single list of the 6 module names (README has one) and apply it to the home cards, service cards, modal titles (`service.html` "HR Statutory & Compliance Audit" → "HR Compliance Review"), footer links and contact chips. The chips currently say "Compliance Review" and "Records Audit".
18. **One brand name and CTA label** (D4). Replace "Genie Bag HR Consultancy", "Genie Bag HR Audit Suite" (`service.html:553`) and the hero eyebrow. Change "Schedule Scoping Call", "Get In Touch Today", "Talk to us" and "Request Support" to "Book a scoping call" wherever they are the primary action. Tier buttons stay specific but use sentence case.

### Phase 5: Layout polish (Medium + Low)

19. **Service page container.** Give `.service-section-inners` and the tiers section `max-width:1200px; margin:0 auto; padding-inline:24px`.
20. **CTA banner.** Replace the 88px "LET'S MAKE HR clearer. stronger. ready." banner on `service`, `service-details`, `faq` and `404` with the homepage `.gbh-cta` component and the sentence-case headline "Let's make HR clearer, stronger, ready."
21. **Contact touch targets.** `.gbc-chip { min-height:44px; padding:10px 16px }`. Make the consent label the full click area, with 12px vertical padding.
22. **Header logo on mobile.** Use the SVG logo, or a logo-mark variant below 768px, so it is at least 36px tall and the tagline is not around 6px. (The logo changed in `4d50efb`. Re-check it on a phone.)
23. **Button wrapping.** Use `white-space:nowrap; padding-inline:24px` for the tier "Scope Health Check" button and the footer CTA.
24. **Service card numbering.** Keep the badge and remove the faded "01" background number.
25. **About whitespace.** Use `align-items:center` and remove fixed min-heights in the Purpose/Approach/Commitment and Philosophy blocks.
26. **FAQ hero.** Reduce it to the contact-page hero height (~400px desktop, ~260px mobile).
27. **Eyebrow labels.** Use at least 13px, `letter-spacing:.08em`, and check 4.5:1 contrast.
28. **Imagery** (D5). Use a unique photo per page, ideally real team or office photos.

### Phase 6: SEO and head tags (Medium)

29. Give each page a unique `<title>` and meta description. `about`, `contact`, `faq` and `service` currently share the same title. Add `og:title`, `og:description`, `og:image` (1200×630 branded image) and `twitter:card`.
30. **Favicon.** Commit `bd80ce2` (23 Nov) added brand favicons. They may have gone live after the audit ran. Check the live tab icon. If it is still generic, check the Vercel deploy cache.
31. One `<h1>` per page (see item 11). `404.html` has 2. Fix that too.

### Phase 7: Recruitment journeys (High, only if D1 = Yes)

32. `employers.html`: hiring-enquiry form (company, role(s), headcount, timeline, contact). Posts to the same `/api/contact` function with `type=employer`.
33. `jobs.html`: job cards (title, location, type, salary band, Apply). Start with a static JSON file (`assets/data/jobs.json`) rendered by JS, or hand-written cards if there are few roles. Include an empty state ("No open roles, send us your CV").
34. `submit-cv.html`: name, email, phone, role sought, CV upload (PDF/DOCX, max 5MB), consent. The upload needs a backend that accepts files. Vercel functions have a ~4.5MB request body limit, so either upload straight to Vercel Blob or S3 with a signed URL, or use a form service that supports files. **Plan this with D2.**
35. Add all three to the nav, menu panel and footer. Check that each form is reachable in ≤2 clicks from Home at 1440px and 390px.

If D1 = No, replace Phase 7 with: remove recruitment wording from any outside marketing (job boards, LinkedIn, ads) that links to the site.

---

## 3. Suggested order and size

| Order | Phase | Size | Blocked by |
|---|---|---|---|
| 1 | Phase 1: Form endpoint | ½–1 day | D2 (API key) |
| 2 | Phase 2: Mobile menu / nav | ½ day | D3 for the phone number only |
| 3 | Phase 6: SEO / head tags | ½ day | none |
| 4 | Phase 5: Layout polish | 1 day | D5 for imagery only |
| 5 | Phase 3: Animations + homepage length | 1–2 days | none (biggest regression risk; test carefully) |
| 6 | Phase 4: Trust + consistency | 1 day | D3, D4 |
| 7 | Phase 7: Recruitment | 2–3 days | D1 = Yes, D2 |

Phases 2, 5 and 6 touch the same header and footer blocks on all 7 pages. Do them in one pass per page to avoid editing each block several times.

## 4. Verification checklist (from the audit)

- [ ] Submit a test enquiry on the preview: network shows 200 from `/api/contact`, the email arrives at info@geniebag.com, the success screen shows, and the URL has no form data. Repeat with JS disabled. Repeat with the provider key removed: an error must show, not success.
- [ ] At 320/360/375px every menu label and the close icon are visible. At 390/768px the contact form is one tap from the menu, and `tel:` opens the dialler.
- [ ] At 1024px all 5 links and the CTA fit on one line. At 1440px there is no hamburger.
- [ ] With JS disabled every section shows its text. With reduced motion on, no animation runs.
- [ ] Homepage is under ~10,000px at 390px. No empty band is taller than 200px at any width.
- [ ] At 390px no control overlaps text (hero arrows, back-to-top).
- [ ] Each page has one H1, a unique title, and og tags. The favicon shows the logo.
- [ ] `grep` for "Vetted", "ISO", "guarantee" returns only supported claims. Module names and brand name are identical everywhere.
- [ ] Every social icon opens the right company profile in a new tab.
- [ ] Contact chips and consent are ≥44px tall at 320px. No text is under 13px at 390px.
- [ ] Not covered by the audit, do before launch: Lighthouse (performance and accessibility), real iOS Safari and Android devices, keyboard-only navigation through the menu and the form.
