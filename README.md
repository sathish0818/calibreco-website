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

## Features

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
