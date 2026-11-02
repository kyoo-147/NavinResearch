const SIGN_IN_REDIRECT = "https://navinharness.navinresearch.com/login/";
const SIGN_IN_PATHS = /^\/(vi\/|zh-cn\/)?sign-in\/?$/i;
const ROOT_HOSTS = new Set(["navinresearch.com", "www.navinresearch.com"]);
const POLICY_PATHS = new Set(["/policies/cookie-policy", "/policies/cookie-policy/", "/cookie-policy", "/cookie-policy/"]);

const CONSENT = `<script id="navin-consent-boot">
(function () {
  var KEY = "navin_consent_v2";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var prefs = null;
  try { prefs = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
  var analytics = !!(prefs && prefs.analytics);
  var marketing = !!(prefs && (prefs.marketing || prefs.personalized));
  var personalized = !!(prefs && prefs.personalized);
  gtag("consent", "default", {
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: personalized ? "granted" : "denied",
    ad_personalization: personalized ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
    wait_for_update: 500
  });
  if (prefs) {
    gtag("consent", "update", {
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: personalized ? "granted" : "denied",
      ad_personalization: personalized ? "granted" : "denied",
      analytics_storage: analytics ? "granted" : "denied"
    });
  }
})();
</script>`;

const UI = `<style id="navin-consent-style">
#navin-consent{position:fixed;left:0;right:0;bottom:0;z-index:2147483646;
background:rgba(247,247,248,.92);backdrop-filter:blur(20px) saturate(140%);
-webkit-backdrop-filter:blur(20px) saturate(140%);
border-top:1px solid rgba(0,0,0,.08);color:#0d0d0d;
font:15px/1.6 ui-sans-serif,-apple-system,"Segoe UI",Inter,Helvetica,Arial,sans-serif;
padding:22px 32px;display:flex;gap:28px;align-items:center;justify-content:space-between;flex-wrap:wrap}
#navin-consent[hidden]{display:none}
#navin-consent .copy{max-width:900px}
#navin-consent strong{font-weight:600;display:block;margin-bottom:4px;font-size:15px}
#navin-consent p{margin:0;color:#3f3f46;font-size:14.5px}
#navin-consent a{color:#0d0d0d;text-decoration:underline;text-underline-offset:2px}
#navin-consent .row{display:flex;gap:10px;flex-wrap:wrap}
#navin-consent button{height:40px;padding:0 20px;border-radius:999px;cursor:pointer;
border:1px solid rgba(0,0,0,.14);background:rgba(255,255,255,.6);color:#0d0d0d;
font:inherit;font-size:14px}
#navin-consent button:hover{background:#fff}
#navin-consent button.accept{background:#fff;border-color:rgba(0,0,0,.18);box-shadow:0 1px 2px rgba(0,0,0,.06)}
#navin-prefs{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;
background:rgba(20,20,22,.35);backdrop-filter:blur(3px);padding:20px}
#navin-prefs[hidden]{display:none}
#navin-prefs .card{width:min(430px,100%);max-height:86vh;overflow:auto;background:#fff;color:#0d0d0d;
border-radius:14px;padding:26px 26px 20px;box-shadow:0 30px 80px -20px rgba(0,0,0,.45);
font:14.5px/1.6 ui-sans-serif,-apple-system,"Segoe UI",Inter,Helvetica,Arial,sans-serif}
#navin-prefs h2{font-size:21px;font-weight:600;margin:0 0 12px}
#navin-prefs .intro{color:#3f3f46;margin:0 0 18px;font-size:13.5px}
#navin-prefs .opt{display:flex;gap:10px;margin-bottom:16px;align-items:flex-start}
#navin-prefs .opt input{margin-top:3px;width:16px;height:16px;accent-color:#0d0d0d}
#navin-prefs .opt strong{display:block;font-size:13.5px;font-weight:600;margin-bottom:2px}
#navin-prefs .opt span{color:#52525b;font-size:12.5px;line-height:1.5}
#navin-prefs .done{width:100%;height:44px;margin-top:8px;border:0;border-radius:999px;background:#0d0d0d;
color:#fff;font:inherit;font-weight:500;cursor:pointer}
@media (max-width:720px){#navin-consent{padding:16px 18px;gap:14px}#navin-consent .row{width:100%}}
</style>
<div id="navin-consent" hidden>
  <div class="copy">
    <strong>We use cookies</strong>
    <p>We use cookies to help this site function, understand service usage, and support product improvement.
       Visit <a href="#" data-open-prefs>Manage Cookies</a> to change preferences anytime.</p>
  </div>
  <div class="row">
    <button type="button" data-consent="manage">Manage Cookies</button>
    <button type="button" data-consent="reject">Reject non-essential</button>
    <button type="button" class="accept" data-consent="accept">Accept all</button>
  </div>
</div>
<div id="navin-prefs" hidden>
  <div class="card" role="dialog" aria-modal="true" aria-labelledby="navin-prefs-title">
    <h2 id="navin-prefs-title">Cookie Preferences</h2>
    <p class="intro">Websites and apps use cookies and other identifiers to store and retrieve information on your
      device. Some of this information may be shared with third parties for different purposes. Use the tool below
      to manage your preferences. You can change them anytime.
      <a href="/policies/cookie-policy/">Learn more</a></p>
    <label class="opt"><input type="checkbox" checked disabled><span><strong>Strictly necessary</strong>
      These cookies are required for the site to work and can't be turned off. They support essential functions
      like security, user authentication, and customer support.</span></label>
    <label class="opt"><input type="checkbox" data-pref="analytics"><span><strong>Analytics Cookies</strong>
      These cookies help us understand how visitors interact with our site. They allow us to measure traffic and
      improve site performance.</span></label>
    <label class="opt"><input type="checkbox" data-pref="marketing"><span><strong>Marketing measurement</strong>
      These cookies help us measure the effectiveness of our marketing campaigns.</span></label>
    <label class="opt"><input type="checkbox" data-pref="personalized"><span><strong>Personalized marketing</strong>
      This helps us personalize and measure our own marketing on third-party platforms.</span></label>
    <button type="button" class="done" data-consent="done">Done</button>
  </div>
</div>
<script id="navin-consent-ui">
(function () {
  var KEY = "navin_consent_v2";
  var box = document.getElementById("navin-consent");
  var modal = document.getElementById("navin-prefs");
  if (!box || !modal) return;

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function save(prefs) {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: prefs.analytics ? "granted" : "denied",
        ad_storage: prefs.marketing || prefs.personalized ? "granted" : "denied",
        ad_user_data: prefs.personalized ? "granted" : "denied",
        ad_personalization: prefs.personalized ? "granted" : "denied"
      });
    }
  }
  function apply(prefs) {
    modal.querySelectorAll("[data-pref]").forEach(function (el) {
      el.checked = !!prefs[el.getAttribute("data-pref")];
    });
  }

  var current = read();
  if (!current) box.hidden = false; else apply(current);

  box.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-consent]");
    if (!btn) return;
    var action = btn.getAttribute("data-consent");
    if (action === "manage" || event.target.hasAttribute("data-open-prefs")) {
      event.preventDefault();
      apply(read() || { analytics: false, marketing: false, personalized: false });
      modal.hidden = false;
      return;
    }
    if (action === "accept") { save({ analytics: true, marketing: true, personalized: true }); box.hidden = true; }
    if (action === "reject") { save({ analytics: false, marketing: false, personalized: false }); box.hidden = true; }
  });

  document.addEventListener("click", function (event) {
    if (event.target.hasAttribute && event.target.hasAttribute("data-open-prefs")) {
      event.preventDefault();
      apply(read() || { analytics: false, marketing: false, personalized: false });
      modal.hidden = false;
    }
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) { modal.hidden = true; return; }
    var done = event.target.closest('[data-consent="done"]');
    if (!done) return;
    var prefs = { analytics: false, marketing: false, personalized: false };
    modal.querySelectorAll("[data-pref]").forEach(function (el) {
      prefs[el.getAttribute("data-pref")] = el.checked;
    });
    save(prefs);
    modal.hidden = true;
    box.hidden = true;
  });
})();
</script>`;

const PRIVACY = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy Policy — Navin Research</title>
<style>
:root{color-scheme:light dark}
body{margin:0;background:#f7f7f8;color:#0d0d0d;font:16px/1.7 ui-sans-serif,-apple-system,"Segoe UI",Inter,Helvetica,Arial,sans-serif}
.wrap{max-width:760px;margin:0 auto;padding:64px 24px 96px}
h1{font-size:40px;line-height:1.15;letter-spacing:-.02em;margin:0 0 12px;font-weight:600}
h2{font-size:22px;margin:40px 0 10px;font-weight:600;letter-spacing:-.01em}
p,li{color:#3f3f46}
a{color:#0d0d0d;text-underline-offset:2px}
.lead{font-size:17px;color:#52525b;margin:0 0 8px}
footer{margin-top:56px;padding-top:20px;border-top:1px solid #e4e4e7;font-size:13.5px;color:#71717a}
@media (prefers-color-scheme:dark){body{background:#0d0d0d;color:#fafafa}p,li,.lead{color:#a1a1aa}
footer{color:#71717a;border-color:#27272a}a{color:#fafafa}}
</style></head><body><div class="wrap">
<h1>Privacy Policy</h1>
<p class="lead">Last updated 2 November 2026</p>
<p>This policy describes what information is collected when you visit this site or create an account, why it is
collected, and the choices you have. It applies to navinresearch.com, michaeltechs.xyz and their subdomains.</p>

<h2>1. Information we collect</h2>
<ul>
<li><strong>Account details</strong> — name, email address, and a hashed password (scrypt) when you register.
Passwords are never stored or logged in plain text.</li>
<li><strong>Sign-in metadata</strong> — time of sign-in, IP address and browser string, kept for security and abuse
investigation.</li>
<li><strong>Requests you send us</strong> — the contact and sales forms, including the message you write.</li>
<li><strong>Analytics</strong> — only if you accept analytics cookies: aggregated page views, referrer and
approximate region.</li>
</ul>

<h2>2. What we do not collect</h2>
<p>We do not collect payment card data on this site, we do not run advertising pixels, and we do not sell personal
information. Analytics scripts are not loaded at all until you accept them.</p>

<h2>3. Why we use it</h2>
<ul>
<li>To operate your account and keep the service secure.</li>
<li>To answer your enquiries and provide support.</li>
<li>To understand which parts of the site are used, so we can improve them.</li>
</ul>

<h2>4. Legal basis</h2>
<p>Where the GDPR applies, we rely on contract necessity for account operation, legitimate interest for security
logging, consent for analytics and marketing measurement, and consent for any optional communications.</p>

<h2>5. Sharing</h2>
<p>We share data only with service providers that are necessary to run the site — hosting and networking providers,
and our email provider. We do not sell or rent personal information.</p>

<h2>6. Retention</h2>
<p>Account records are kept while the account is active. Security logs are rotated regularly. Analytics data is
retained on a rolling basis and aggregated after the retention window.</p>

<h2>7. Your rights</h2>
<p>You may request access, correction, export or deletion of your data, and you may withdraw analytics consent at
any time. Write to <a href="mailto:privacy@navinresearch.com">privacy@navinresearch.com</a> and we will respond within
30 days.</p>

<h2>8. Cookies</h2>
<p>See our <a href="/policies/cookie-policy/">Cookie Policy</a> for the specific cookies used and how to change your
preferences.</p>

<h2>9. Contact</h2>
<p>Privacy questions: <a href="mailto:privacy@navinresearch.com">privacy@navinresearch.com</a>.</p>

<footer>Navin Research — <a href="/">navinresearch.com</a> · <a href="/policies/cookie-policy/">Cookie Policy</a></footer>
</div></body></html>`;

const POLICY = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cookie Policy — Navin Research</title>
<style>
:root{color-scheme:light dark}
body{margin:0;background:#f7f7f8;color:#0d0d0d;font:16px/1.7 ui-sans-serif,-apple-system,"Segoe UI",Inter,Helvetica,Arial,sans-serif}
.wrap{max-width:760px;margin:0 auto;padding:64px 24px 96px}
h1{font-size:40px;line-height:1.15;letter-spacing:-.02em;margin:0 0 12px;font-weight:600}
h2{font-size:22px;margin:40px 0 10px;font-weight:600;letter-spacing:-.01em}
h3{font-size:16px;margin:22px 0 6px;font-weight:600}
p,li{color:#3f3f46}
a{color:#0d0d0d;text-underline-offset:2px}
.lead{font-size:17px;color:#52525b;margin:0 0 8px}
table{width:100%;border-collapse:collapse;margin:14px 0;font-size:14px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #e4e4e7;vertical-align:top}
th{font-weight:600;color:#0d0d0d}
code{background:#ececee;padding:1px 5px;border-radius:4px;font-size:13px}
footer{margin-top:56px;padding-top:20px;border-top:1px solid #e4e4e7;font-size:13.5px;color:#71717a}
@media (prefers-color-scheme:dark){body{background:#0d0d0d;color:#fafafa}p,li{color:#a1a1aa}.lead{color:#a1a1aa}
th{color:#fafafa}td,th{border-color:#27272a}code{background:#27272a}footer{color:#71717a;border-color:#27272a}a{color:#fafafa}}
</style></head><body><div class="wrap">
<h1>Cookie Policy</h1>
<p class="lead">Last updated 2 November 2026</p>
<p>This policy explains how Navin Research ("we", "us") uses cookies and similar technologies on
navinresearch.com and its subdomains. It should be read together with our privacy policy.</p>

<h2>1. What cookies are</h2>
<p>Cookies are small text files that a website stores in your browser. They let a site remember your
choices between page loads — for example whether you kept the cookie banner closed, or whether you are
signed in. Similar technologies include local storage, pixels and SDK storage; we refer to all of them
here as "cookies".</p>

<h2>2. How we ask you</h2>
<p>When you first visit, a banner asks whether you accept non-essential cookies. Nothing beyond strictly
necessary storage runs until you choose. Your choice is stored on your device under the key
<code>navin_consent_v2</code>, and you can change it at any time with the <strong>Manage Cookies</strong>
link in that banner.</p>

<h2>3. Categories we use</h2>
<table>
<tr><th>Category</th><th>What it does</th><th>Default</th></tr>
<tr><td><strong>Strictly necessary</strong></td><td>Security, load balancing, and keeping you signed in.
These cannot be switched off.</td><td>Always on</td></tr>
<tr><td><strong>Analytics</strong></td><td>Google Analytics 4 measures pages viewed, referrers and
aggregate traffic so we can improve the product.</td><td>Off until you accept</td></tr>
<tr><td><strong>Marketing measurement</strong></td><td>Measures whether our own campaigns brought
visitors to the site.</td><td>Off until you accept</td></tr>
<tr><td><strong>Personalized marketing</strong></td><td>Allows measurement and personalisation of our
marketing on third-party platforms.</td><td>Off until you accept</td></tr>
</table>

<h2>4. Cookies we set</h2>
<table>
<tr><th>Name</th><th>Provider</th><th>Purpose</th><th>Lifetime</th></tr>
<tr><td><code>navin_session</code></td><td>Navin Research</td><td>Keeps you signed in to the platform.
HttpOnly, Secure, SameSite=Lax.</td><td>30 days</td></tr>
<tr><td><code>navin_consent_v2</code></td><td>Navin Research</td><td>Remembers your cookie choices.
Stored in local storage, not sent to our servers.</td><td>Until cleared</td></tr>
<tr><td><code>_ga</code>, <code>_ga_&lt;id&gt;</code></td><td>Google Analytics 4</td>
<td>Distinguishes visitors and sessions. Set only after you accept analytics.</td><td>Up to 2 years</td></tr>
<tr><td><code>g_state</code></td><td>Navin Research</td><td>Short-lived state used during Google sign-in
to prevent request forgery.</td><td>Session</td></tr>
</table>

<h2>5. What we do not do</h2>
<ul>
<li>We do not sell personal information.</li>
<li>We do not run advertising pixels on this site.</li>
<li>We do not load analytics scripts before you accept them.</li>
</ul>

<h2>6. Changing your choice</h2>
<p>Open the cookie banner with <strong>Manage Cookies</strong>, adjust the switches, and press
<strong>Done</strong>. Turning analytics off removes the analytics cookies on your next page load. You can
also clear site data in your browser at any time.</p>

<h2>7. Contact</h2>
<p>Questions about this policy: <a href="mailto:privacy@navinresearch.com">privacy@navinresearch.com</a>.
Postal and company details are on our contact page.</p>

<footer>Navin Research — <a href="/">navinresearch.com</a> · <a href="/policies/cookie-policy/">Cookie Policy</a></footer>
</div></body></html>`;

function withConsent(html) {
  if (html.indexOf("navin-consent-boot") !== -1) return html;
  const headOpen = html.match(/<head[^>]*>/i);
  if (!headOpen) return html;
  const at = headOpen.index + headOpen[0].length;
  let out = html.slice(0, headOpen.index) + headOpen[0] + CONSENT + html.slice(at);
  const bodyClose = out.lastIndexOf("</body>");
  out = bodyClose === -1 ? out + UI : out.slice(0, bodyClose) + UI + out.slice(bodyClose);
  return out;
}

function productPrefix(hostname) {
  if (ROOT_HOSTS.has(hostname)) return "";
  const m = hostname.match(/^([a-z0-9-]+)\.navinresearch\.com$/i);
  if (!m) return null;
  return "/" + m[1];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (SIGN_IN_PATHS.test(url.pathname)) {
      return new Response(null, { status: 301, headers: { location: SIGN_IN_REDIRECT, "cache-control": "public, max-age=3600" } });
    }

    if (POLICY_PATHS.has(url.pathname)) {
      return new Response(POLICY, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300", "x-served-by": "navin-worker" },
      });
    }

    const prefix = productPrefix(url.hostname);
    let assetRequest = request;
    if (prefix) {
      const target = new URL(request.url);
      target.pathname = prefix + (url.pathname === "/" ? "/" : url.pathname);
      assetRequest = new Request(target.toString(), request);
    }

    const response = await env.ASSETS.fetch(assetRequest);

    /* sites that ship no privacy page still get one */
    if (response.status === 404 &&
        (url.pathname === "/privacy-policy" || url.pathname === "/privacy-policy/")) {
      return new Response(PRIVACY, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300",
        },
      });
    }

    const type = response.headers.get("content-type") || "";
    if (type.indexOf("text/html") !== -1) {
      const html = await response.text();
      const out = new Response(withConsent(html), { status: response.status, headers: response.headers });
      out.headers.set("x-served-by", "navin-worker");
      out.headers.delete("content-length");
      return out;
    }
    const out = new Response(response.body, response);
    out.headers.set("x-served-by", "navin-worker");
    return out;
  },
};
