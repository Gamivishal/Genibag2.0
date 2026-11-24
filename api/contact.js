/*
 * Contact form endpoint (Vercel serverless function): POST /api/contact
 *
 * Sends each enquiry by email through Resend (https://resend.com).
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  required. Without it every submission fails with an error (never a fake success).
 *   CONTACT_TO      optional, default "info@geniebag.com". Comma-separate for several recipients.
 *   CONTACT_FROM    optional, default "Geniebag Website <onboarding@resend.dev>".
 *                   The resend.dev sender only delivers to the Resend account owner's own address,
 *                   so for production verify geniebag.com in Resend and set e.g.
 *                   "Geniebag Website <website@geniebag.com>".
 *
 * Replies as JSON when the request sends "Accept: application/json" (the contact.js fetch).
 * A plain HTML form post (JavaScript disabled) gets a small HTML confirmation or error page instead.
 */

const DEFAULT_TO = "info@geniebag.com";
const DEFAULT_FROM = "Geniebag Website <onboarding@resend.dev>";
const FALLBACK_EMAIL = "info@geniebag.com";

const LIMITS = { name: 100, email: 200, phone: 40, subject: 150, services: 300, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Light per-instance throttle. Serverless instances are short-lived, so this only slows bursts.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map();

function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > RATE_MAX;
}

function clean(value, max) {
    if (Array.isArray(value)) value = value.join(", ");
    return String(value == null ? "" : value).trim().slice(0, max);
}

function oneLine(value) {
    return value.replace(/[\r\n]+/g, " ");
}

function wantsJson(req) {
    return String(req.headers.accept || "").includes("application/json");
}

function parseBody(req) {
    const body = req.body;
    if (!body) return {};
    if (typeof body === "object") return body;
    // Fallback if the runtime left the body as a string.
    try {
        return JSON.parse(body);
    } catch (_) {
        return Object.fromEntries(new URLSearchParams(String(body)));
    }
}

function htmlPage(title, text, ok) {
    const colour = ok ? "#0D9787" : "#C8321F";
    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${title} – Geniebag Solutions</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F8FAFF;font-family:"DM Sans",system-ui,sans-serif;color:#111B34;padding:16px;box-sizing:border-box}
main{max-width:480px;background:#fff;border:1px solid #E1E9F5;border-top:4px solid ${colour};border-radius:16px;padding:32px;box-shadow:0 10px 30px rgba(17,27,52,.08)}
h1{font-size:24px;margin:0 0 12px}p{color:#526075;line-height:1.6;margin:0 0 24px}
a{display:inline-block;background:#EF6939;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600}
</style></head>
<body><main><h1>${title}</h1><p>${text}</p><a href="/contact">Back to Geniebag Solutions</a></main></body></html>`;
}

function reply(req, res, status, ok, message) {
    if (wantsJson(req)) {
        res.status(status).json(ok ? { ok: true } : { ok: false, error: message });
        return;
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(status).send(
        ok
            ? htmlPage("Thank you", "We have received your enquiry and will reply within one business day.", true)
            : htmlPage("Your enquiry was not sent", message, false)
    );
}

module.exports = async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return reply(req, res, 405, false, "Please use the contact form.");
    }

    const data = parseBody(req);

    // Honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
    if (clean(data.company_website, 200) !== "") {
        return reply(req, res, 200, true);
    }

    const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
        return reply(req, res, 429, false,
            `Too many enquiries from your connection. Please try again later or email ${FALLBACK_EMAIL}.`);
    }

    const name = oneLine(clean(data.name, LIMITS.name));
    const email = oneLine(clean(data.email, LIMITS.email));
    const phone = oneLine(clean(data.phone, LIMITS.phone));
    const subject = oneLine(clean(data.subject, LIMITS.subject));
    const services = oneLine(clean(data.services, LIMITS.services));
    const message = clean(data.message, LIMITS.message);
    const consent = clean(data.consent, 10) === "yes";

    const problems = [];
    if (!name) problems.push("your name");
    if (!EMAIL_RE.test(email)) problems.push("a valid email address");
    if (!consent) problems.push("your consent to be contacted");
    if (problems.length) {
        return reply(req, res, 400, false, `Please provide ${problems.join(", ")} and try again.`);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("contact: RESEND_API_KEY is not set");
        return reply(req, res, 500, false,
            `Our form is temporarily unavailable. Please email us at ${FALLBACK_EMAIL}.`);
    }

    const to = (process.env.CONTACT_TO || DEFAULT_TO).split(",").map((s) => s.trim()).filter(Boolean);
    const from = process.env.CONTACT_FROM || DEFAULT_FROM;

    // Plain text only: no HTML is built from visitor input.
    const text = [
        "New scoping-call enquiry from the website",
        "",
        `Name:         ${name}`,
        `Email:        ${email}`,
        `Phone:        ${phone || "-"}`,
        `Organisation: ${subject || "-"}`,
        `Services:     ${services || "-"}`,
        "",
        "Message:",
        message || "-",
        "",
        "Consent to be contacted: yes",
        `Submitted: ${new Date().toISOString()}`,
    ].join("\n");

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from,
                to,
                reply_to: email,
                subject: `Scoping call enquiry: ${name}${subject ? ` (${subject})` : ""}`,
                text,
            }),
        });
        if (!response.ok) {
            console.error("contact: Resend responded", response.status, await response.text());
            return reply(req, res, 502, false,
                `We could not send your enquiry just now. Please try again or email ${FALLBACK_EMAIL}.`);
        }
    } catch (err) {
        console.error("contact: send failed", err);
        return reply(req, res, 502, false,
            `We could not send your enquiry just now. Please try again or email ${FALLBACK_EMAIL}.`);
    }

    return reply(req, res, 200, true);
};
