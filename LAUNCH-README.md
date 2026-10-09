# Production Launch Setup (v8)

This package is wired to the LIVE Paddle environment.

## Before uploading to GitHub Pages

1. Open `paddle-config.js`.
2. Replace:
   `LIVE_CLIENT_TOKEN_HERE`
   with the same LIVE Paddle client-side token already used successfully on
   the private `live-checkout.html` test.
3. Do not put the Paddle API key or webhook secret in this file.
4. Do not add `Paddle.Environment.set("sandbox")`.

Configured LIVE price IDs:

- Launch $39:
  `pri_01m4fts6jzt2bjbyez78sssb31`
- Standard $59:
  `pri_01m4fkwgh8v4t0f2z5sgq6rqrg`

Live Worker:
`https://qa-portfolio-fulfillment-live.igor9063.workers.dev`

## Customer flow

Main landing page
→ Buy now — $39
→ Paddle Live checkout
→ transaction.completed
→ live Worker
→ success.html
→ private R2 ZIP download

## Recovery

`recover.html` now uses the LIVE Worker and LIVE Paddle API.

## Private diagnostics retained

- `live-checkout.html` — private $59 live checkout test
- `live-success.html`
- `live-recover-test.html`
- sandbox pages are retained for reference

## Before public launch

Set the exact 14-day launch end date in customer-facing copy once the public
launch date is fixed. Do not claim a countdown before the actual launch starts.
