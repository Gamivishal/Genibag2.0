# Client Inputs Required for Final 100% Sign-Off
**Project:** Geniebag Solutions (HR Compliance & Audit Consultancy)  
**Website:** https://genibag2-0.vercel.app/  
**Document Purpose:** Specifies all remaining business assets and copy required from the client to replace HTML placeholders across the website.

---

## Overview

The technical codebase, responsive styling, serverless API, GSAP animations, and SEO head structure are **100% complete and verified**.

In accordance with strict brand and audit guidelines, **zero fake or placeholder data has been rendered**. All sections awaiting verified client inputs are preserved as non-rendering HTML comment placeholders.

Once the client provides the 6 items below, they can be inserted directly into the designated lines across all 7 pages.

---

## 1. Company Telephone Number

| Detail | Specification |
| :--- | :--- |
| **Description** | Official client support or advisory phone line |
| **Expected Format** | E.164 international format for link (`tel:+91XXXXXXXXXX`) and readable format for display (e.g. `+91 98765 43210` or `+91 (0) 22 1234 5678`) |
| **Where It Appears** | 1. Header mobile offcanvas menu (`.offcanvas__cta`)<br>2. Offcanvas Contact Info section (`.off-contact-info`)<br>3. Contact Us page info cards (`contact.html`)<br>4. All 7 page footers (Column 4: Consultation) |
| **Target Files & Lines** | - `index.html`: lines 117, 135, 3126<br>- `about.html`: lines 117, 135, 1046<br>- `service.html`: lines 117, 135, 509<br>- `service-details.html`: lines 135, 153, 699<br>- `faq.html`: lines 123, 141, 435<br>- `contact.html`: lines 118, 136, 235, 559<br>- `404.html`: lines 117, 135, 318 |

### Ready-to-Insert Snippet:
```html
<!-- In Mobile Offcanvas: -->
<a href="tel:+91XXXXXXXXXX" class="offcanvas__link">
    <i class="fa-solid fa-phone" aria-hidden="true"></i> +91 XXXXX XXXXX
</a>

<!-- In Footer Column 4: -->
<p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    <a href="tel:+91XXXXXXXXXX" style="color: #EF6939; text-decoration: none; font-weight: 500;">
        <i class="fa-solid fa-phone" style="margin-right: 6px;"></i>+91 XXXXX XXXXX
    </a>
</p>
```

---

## 2. Registered Office Address & Operating Hours

| Detail | Specification |
| :--- | :--- |
| **Description** | Official registered or corporate office address and working days/hours |
| **Expected Format** | Full postal address (e.g. `Level 4, Business Tower, Bandra Kurla Complex, Mumbai, MH 400051`) and business hours (e.g. `Monday – Friday: 9:30 AM – 6:30 PM IST`) |
| **Where It Appears** | 1. Contact Us page (`contact.html`) primary info cards<br>2. Offcanvas menu contact panel (`.off-contact-info`)<br>3. Footer Column 4 on all 7 pages |
| **Target Files & Lines** | - `contact.html`: line 240 (`.gbc-info`)<br>- `index.html`: lines 135, 3126<br>- `about.html`: lines 135, 1046<br>- `service.html`: lines 135, 509<br>- `service-details.html`: lines 153, 699<br>- `faq.html`: lines 141, 435<br>- `404.html`: lines 135, 318 |

---

## 3. Legal Entity Name & Corporate Registration (CIN / LLPIN)

| Detail | Specification |
| :--- | :--- |
| **Description** | Registered statutory company name and Corporate Identity Number / LLPIN |
| **Expected Format** | Legal Name: `Geniebag Solutions Private Limited` (or LLP)<br>Registration: `CIN: U74999MH202XPTCXXXXXX` |
| **Where It Appears** | Footer copyright bottom bar across all 7 pages |
| **Target Files & Lines** | - `index.html`: line 3138<br>- `about.html`: line 1058<br>- `service.html`: line 521<br>- `service-details.html`: line 711<br>- `faq.html`: line 447<br>- `contact.html`: line 571<br>- `404.html`: line 330 |

### Ready-to-Insert Snippet:
```html
<p style="margin: 0; font-size: 14px; color: #94A3B8;">
    © 2026 <strong style="color: #ffffff;">Geniebag Solutions Private Limited</strong> (The Management Basket). All Rights Reserved. | CIN: UXXXXXXXXXXXXXXX
</p>
```

---

## 4. Official LinkedIn Company Page URL

| Detail | Specification |
| :--- | :--- |
| **Description** | Active LinkedIn company profile URL |
| **Expected Format** | `https://www.linkedin.com/company/geniebag-solutions/` |
| **Where It Appears** | 1. Header and Offcanvas social links<br>2. Footer social widget on all 7 pages<br>3. Leadership bio card on `about.html` (Founder LinkedIn) |
| **Target Files & Lines** | - `index.html`: lines 144, 3079<br>- `about.html`: lines 144, 856, 999<br>- `service.html`: lines 144, 462<br>- `service-details.html`: lines 162, 652<br>- `faq.html`: lines 150, 388<br>- `contact.html`: lines 145, 512<br>- `404.html`: lines 144, 271 |

### Ready-to-Insert Snippet:
```html
<a href="https://www.linkedin.com/company/YOUR-HANDLE" target="_blank" rel="noopener noreferrer" aria-label="Geniebag Solutions on LinkedIn">
    <i class="fa-brands fa-linkedin-in"></i>
</a>
```

---

## 5. Three Authentic Client Testimonials

| Detail | Specification |
| :--- | :--- |
| **Description** | 3 genuine quotes from leadership or HR heads who used Geniebag's compliance audit services |
| **Expected Format** | Per testimonial:<br>1. **Quote:** 2–3 sentences on audit rigor, clarity, or corrective action impact.<br>2. **Client Name:** Full name of client contact.<br>3. **Designation:** E.g., *Head of People & Culture*, *Chief Operating Officer*.<br>4. **Organization:** Company name (with written authorization). |
| **Where It Appears** | `index.html` above the Flexible Engagement Tiers section (`#tiers`) |
| **Target File & Lines** | `index.html`: line 2524 |

---

## 6. Four to Six Authorized Client Logos

| Detail | Specification |
| :--- | :--- |
| **Description** | Vector or transparent high-res brand marks of enterprise or growth-stage clients served |
| **Expected Format** | `.svg` or transparent `.png` (min height 48px, monochrome or brand color) |
| **Where It Appears** | `index.html` client logo strip accompanying the testimonials section |
| **Target File & Lines** | `index.html`: line 2524 (within `.client-logos` row) |

---

## 7. Vercel Resend Email Environment Variable

| Detail | Specification |
| :--- | :--- |
| **Description** | API key for the contact form's transactional email delivery via Resend (https://resend.com) |
| **Setting Location** | Vercel Project Dashboard $\rightarrow$ Project Settings $\rightarrow$ Environment Variables |
| **Variables** | 1. `RESEND_API_KEY`: Secret API key (`re_...`)<br>2. `CONTACT_TO`: `info@geniebag.com`<br>3. `CONTACT_FROM`: `Geniebag Website <website@geniebag.com>` (requires domain verification in Resend) |

---

## Summary of Action When Data is Delivered

Once the client provides the answers to the 7 sections above, development will take approximately **2.0 to 2.5 hours** to populate all files, run regression checks, and deploy to production.
