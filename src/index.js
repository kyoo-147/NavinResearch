const SIGN_IN_REDIRECT = "https://navinharness.navinresearch.com/login/";
const SIGN_IN_PATHS = /^\/(vi\/|zh-cn\/)?sign-in\/?$/i;

const CONSENT = `<script id="navin-consent-boot">
(function () {
  var KEY = "navin_consent_v1";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice === "accept" ? "granted" : "denied",
    wait_for_update: 500
  });
  if (choice === "accept") gtag("consent", "update", { analytics_storage: "granted" });
})();
</script>`;

const BANNER = `<style id="navin-consent-style">
#navin-consent{position:fixed;left:0;right:0;bottom:0;z-index:2147483646;
background:rgba(38,40,45,.72);backdrop-filter:blur(18px) saturate(120%);
-webkit-backdrop-filter:blur(18px) saturate(120%);
border-top:1px solid rgba(255,255,255,.10);color:#f1f2f4;
font:13px/1.55 -apple-system,"Segoe UI",Inter,sans-serif;
padding:14px 22px;display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}
#navin-consent[hidden]{display:none}
#navin-consent .copy{max-width:820px}
#navin-consent strong{font-weight:600;display:block;margin-bottom:2px;font-size:13.5px}
#navin-consent a{color:#cfd3da;text-decoration:underline}
#navin-consent .row{display:flex;gap:10px;flex-wrap:wrap}
#navin-consent button{height:34px;padding:0 16px;border-radius:999px;cursor:pointer;
border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.10);color:#fff;
font:inherit;font-size:12.5px}
#navin-consent button:hover{background:rgba(255,255,255,.20)}
#navin-consent button.accept{background:#fff;color:#111214;border-color:#fff}
@media (max-width:640px){#navin-consent{padding:12px 14px}}
</style>
<div id="navin-consent" hidden>
  <div class="copy">
    <strong>We use cookies</strong>
    We use cookies to help this site function, understand service usage, and improve it. Visit
    <a href="/privacy-policy/">Manage Cookies</a> to change preferences anytime.
  </div>
  <div class="row">
    <button type="button" data-consent="reject">Reject non-essential</button>
    <button type="button" class="accept" data-consent="accept">Accept all</button>
  </div>
</div>
<script id="navin-consent-ui">
(function () {
  var KEY = "navin_consent_v1";
  var box = document.getElementById("navin-consent");
  if (!box) return;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (!saved) box.hidden = false;
  box.addEventListener("click", function (event) {
    var btn = event.target.closest("button[data-consent]");
    if (!btn) return;
    var value = btn.getAttribute("data-consent");
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: value === "accept" ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
    box.hidden = true;
  });
})();
</script>`;

function withConsent(html) {
  if (html.indexOf("navin-consent-boot") !== -1) return html;
  const headOpen = html.match(/<head[^>]*>/i);
  if (!headOpen) return html;
  const at = headOpen.index + headOpen[0].length;
  let out = html.slice(0, headOpen.index) + headOpen[0] + CONSENT + html.slice(at);
  const bodyClose = out.lastIndexOf("</body>");
  out = bodyClose === -1 ? out + BANNER : out.slice(0, bodyClose) + BANNER + out.slice(bodyClose);
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (SIGN_IN_PATHS.test(url.pathname)) {
      return new Response(null, {
        status: 301,
        headers: {
          location: SIGN_IN_REDIRECT,
          "cache-control": "public, max-age=3600",
          "x-served-by": "navin-worker",
        },
      });
    }

    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get("content-type") || "";

    if (type.indexOf("text/html") !== -1) {
      const html = await response.text();
      const out = new Response(withConsent(html), {
        status: response.status,
        headers: response.headers,
      });
      out.headers.set("x-served-by", "navin-worker");
      out.headers.delete("content-length");
      return out;
    }

    const out = new Response(response.body, response);
    out.headers.set("x-served-by", "navin-worker");
    return out;
  },
};
