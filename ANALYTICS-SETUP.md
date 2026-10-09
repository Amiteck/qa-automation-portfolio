# Analytics Setup

This version uses:

1. Cloudflare Web Analytics for landing-page visitors, page views, referrers,
   device/browser breakdown, and performance.
2. Paddle Billing's Checkout Conversion / Checkouts report for first-time
   checkout starts, checkout conversion, source domain/referrer, and completed
   purchases.

This intentionally avoids building a separate tracking database and does not
add advertising trackers.

## Enable Cloudflare Web Analytics

In Cloudflare Dashboard:

Web Analytics
→ Add a site
→ Hostname: amiteck.github.io
→ Finish setup

Cloudflare will show a JavaScript snippet containing a public site token.

Open:

analytics.js

Replace:

CLOUDFLARE_WEB_ANALYTICS_TOKEN_HERE

with the token from Cloudflare's snippet.

Do not paste any Paddle API key, Paddle webhook secret, or Cloudflare secret
into analytics.js.

Then commit and push the site.

## Which pages are tracked

Tracked:
- index.html
- terms.html
- privacy.html
- refunds.html
- recover.html
- success.html

Not tracked:
- sandbox checkout/test pages
- private live diagnostic pages

This avoids contaminating launch metrics with our own integration testing.

## Funnel to monitor

Visitors:
Cloudflare Web Analytics → unique visitors to the product site.

Checkout starts:
Paddle → Billing metrics / Checkouts report → first-time checkouts begun.

Purchases:
Paddle → completed one-time transactions.

Useful calculations:

Landing → checkout rate
= first-time checkouts / unique landing visitors

Checkout → purchase rate
= completed first-time checkouts / first-time checkouts begun

Visitor → purchase rate
= completed purchases / unique landing visitors

Cloudflare Web Analytics does not currently support custom events or UTM
query-string reporting, so this setup intentionally does not count raw button
clicks. A successfully loaded Paddle checkout is a stronger funnel signal and
Paddle already reports it.

Paddle's Checkouts report can be used to compare source domain/referrer,
country, product, currency, and checkout variant.
