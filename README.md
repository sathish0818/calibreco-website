# Calibreco Technology — Website

One-page marketing site for **Calibreco Technology**, a Chennai-based industrial
dimensional metrology and 3D scanning provider.

Built from the company profile deck (`Calibreco Company Profile.pptx`) — all copy,
photography, customer logos and the brand logo are sourced from that deck.

## Stack

Plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

```
index.html      markup for the single page
styles.css      design tokens + all styling
script.js       theme toggle, mobile nav, footer year
assets/img/     photography from the profile deck
assets/logos/   Calibreco logo, favicon, customer logos
```

## Booking

Visitors pick an instrument from the booking section, choose a date, shift and
duration, and submit their details. The site is static, so there is no server to
receive the order — instead the form composes the job sheet and hands it to
WhatsApp (with a `mailto:` fallback) for the visitor to send to the dispatch
desk. Both destinations live at the top of `script.js`:

```js
var WHATSAPP = '919600794700';   // dispatch desk, digits only, country code first
var MAILTO   = 'calibreco25@gmail.com';
```

The weekday Open/Booked chips are driven by the `AVAILABILITY` map in the same
file. They are **indicative only** — nothing reads a live calendar, so keep the
map in step with the real dispatch schedule, or delete the `.week` lists if you
would rather not show availability at all.

## Features

- Service booking: four bookable services, validated request form, WhatsApp/email dispatch
- Minimal design system: neutral ink scale plus one indigo accent drawn from the deck
- Light and dark theme with a header toggle — respects `prefers-color-scheme`,
  remembers the visitor's choice in `localStorage`, applied before first paint
- Fully responsive at 980px / 760px / 560px breakpoints
- Accessible: skip link, focus-visible rings, labelled controls, `prefers-reduced-motion`

## Running locally

No server is strictly required — open `index.html` directly. To serve it:

```bash
python3 -m http.server 4321
```

Then visit http://localhost:4321

## Sections

Hero · About · Vision/Mission/Values · Services · Capabilities · Industries ·
Customers · Contact

---

Designed by Box and Dots
