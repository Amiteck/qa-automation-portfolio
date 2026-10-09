# Live Paddle verification

Before deploying:

1. Open `live-checkout.js`.
2. Replace `LIVE_CLIENT_TOKEN_HERE` with the real Paddle Live client-side token.
3. Do not add `Paddle.Environment.set("sandbox")`.
4. Commit and push.
5. Open:
   `https://amiteck.github.io/qa-automation-portfolio/live-checkout.html`

This page is unlinked and noindex. It charges a real $59 payment.

Expected flow:
live checkout -> live-success.html -> live Worker -> access-live/ -> ZIP.

Then test live recovery at:
`https://amiteck.github.io/qa-automation-portfolio/live-recover-test.html`
