# Planned.com — Product Deep Dive

A scrolling narrative website analyzing Planned.com's product, competitive positioning, and opportunity landscape. Built as a research and presentation artifact.

## What it is

This site presents a structured analysis of Planned.com — a corporate event sourcing and payment platform — across four areas:

1. **User Pain Points** — Recurring friction reported by real users across review platforms (Capterra, SoftwareAdvice, GetApp)
2. **Feature Gaps vs. Competitors** — Where Planned falls short relative to Cvent, Bizzabo, Stova, and others
3. **Strategic Observations** — Planned's market position, funding, target persona, and AI differentiation
4. **Projects We Can Build** — Ten concrete product ideas that address the gaps, with effort estimates and tech stacks

The final section surfaces a recommended build order — the highest-leverage starting point given Planned's focus on non-professional planners.

## Structure

The site is a single-page scrolling narrative. Sections are presented in story order rather than as tabs, with connective pull quotes between each section and animated squiggly line dividers in each section's accent color.

```
Hero
  └─ User Pain Points
       └─ "So what do these problems look like competitively?"
  └─ Feature Gaps vs. Competitors
       └─ "These gaps don't exist in a vacuum."
  └─ Strategic Observations
       └─ "The non-professional planner is the unlock."
  └─ Projects We Can Build
  └─ Recommended Start Order
Footer
```

## Tech

- **React 19** + **Vite 8**
- No external UI or animation libraries — scroll animations use the native Intersection Observer API
- Responsive grid: 1 column (mobile) / 2 columns (tablet) / 3 columns (desktop)
- `prefers-reduced-motion` respected throughout
- Google Fonts (Inter)

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

Output goes to `dist/`.
