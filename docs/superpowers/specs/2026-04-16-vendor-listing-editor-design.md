# Vendor Listing Editor — Demo Design

**Branch:** `demo/vendor-listing-editor`
**Date:** 2026-04-16
**Problem addressed:** Vendors on Planned's marketplace cannot self-manage their profiles, add team members, or update pricing without contacting Planned support staff.

---

## Overview

A dual-view interactive demo that shows both sides of vendor self-service: the vendor editing their own listing on the left, and a live Planned marketplace preview updating on the right. Built as a new route in the existing planned-analysis site.

The demo is fully runnable locally with a single command (`npm install && npm run dev`) and persists changes across page refreshes via a real SQLite database.

---

## Routing & Entry Point

`react-router-dom` is added to the project. `main.jsx` wraps the app in `BrowserRouter` with two routes:

| Route | Component |
|---|---|
| `/` | Existing `PlannedAnalysis` (unchanged) |
| `/demo/vendor-listing` | New `VendorListingDemo` |

The "Supplier Onboarding Self-Service Portal" card (Project #6) on the main analysis page gains a "See the demo →" link that navigates to `/demo/vendor-listing`.

---

## Layout

Full-viewport split-screen with a fixed header bar:

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to analysis        Vendor Portal  |  Live Preview│
├────────────────────────┬────────────────────────────────┤
│                        │                                 │
│   VENDOR EDITOR        │   MARKETPLACE PREVIEW           │
│   (form, scrollable)   │   (card, live-updating)         │
│                        │                                 │
└────────────────────────┴────────────────────────────────┘
```

Panels are 50/50 on desktop. On mobile, they stack vertically (editor above, preview below).

---

## Left Panel — Vendor Editor

Three sections, pre-populated from the seeded demo vendor ("The Meridian Grand, Chicago"):

**1. Profile**
- Venue name (text input)
- Tagline (text input, one line)
- Description (textarea)
- Location (text input)
- Hero image URL (text input, previews in right panel)

**2. Team Members**
- List of current members showing name, email, and role badge (Owner / Editor / Viewer)
- "Add member" row: name input + email input + role select + Add button
- Remove button on each existing member (owners cannot remove themselves)
- Changes are saved immediately on add/remove (no Save button for team)

**3. Pricing Packages**
- Table of packages: label + price (e.g. "Full-Day Buyout · $12,000")
- "Add package" row: label input + price input + Add button
- Remove button on each row
- Changes are saved immediately on add/remove

**Save Changes button** at the bottom of the Profile section. Triggers `PATCH /api/vendors/1` with current profile fields. On success: green toast notification ("Changes saved"). On error: red toast ("Something went wrong — try again").

---

## Right Panel — Marketplace Preview

Reads from shared React state — updates instantly as the vendor types, with no network call. No debounce required at demo scale.

Styled to resemble a Planned marketplace listing card:
- Hero image (or a grey placeholder if URL is empty/invalid)
- Venue name and location badge
- Description excerpt (truncated to ~3 lines)
- Pricing highlights (first 2–3 packages shown)
- Team member avatars (initials-based, stacked)

A small "Marketplace Preview" label in the top-right corner makes the dual-view context legible.

---

## Backend — Express + SQLite

### Structure

```
server/
  index.js           — Express app, port 3001
  db.js              — SQLite init, schema creation, seed data
  routes/
    vendors.js       — all vendor API routes
  data/
    vendors.db       — SQLite file (gitignored, auto-created on first run)
```

### Schema

```sql
CREATE TABLE vendors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  location TEXT,
  hero_image_url TEXT
);

CREATE TABLE team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Owner', 'Editor', 'Viewer')),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE pricing_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  price INTEGER NOT NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);
```

### Seed Data

Inserted on first run if `vendors` table is empty:

**Vendor:** The Meridian Grand — Chicago, IL

**Team members:**
- Sarah Chen · sarah@meridian.com · Owner
- James Okafor · james@meridian.com · Editor

**Pricing packages:**
- Half-Day Meeting Room · $3,500
- Full-Day Buyout · $12,000
- Weekend Event Package · $18,500

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/vendors/1` | Returns full vendor object including team and pricing |
| `PATCH` | `/api/vendors/1` | Updates profile fields (name, tagline, description, location, hero_image_url) |
| `POST` | `/api/vendors/1/team` | Adds a team member (`{ name, email, role }`) |
| `DELETE` | `/api/vendors/1/team/:id` | Removes a team member by id |
| `POST` | `/api/vendors/1/pricing` | Adds a pricing package (`{ label, price }`) |
| `DELETE` | `/api/vendors/1/pricing/:id` | Removes a pricing package by id |

All responses are JSON. Errors return `{ error: string }` with an appropriate HTTP status.

### Dependencies

- `express` — HTTP server
- `better-sqlite3` — synchronous SQLite bindings (no async/await required server-side)
- `cors` — configured with `origin: '*'` for the demo (avoids Vite port conflicts)

---

## Dev Setup

`concurrently` added to devDependencies. `package.json` scripts:

```json
{
  "dev": "concurrently \"vite\" \"node server/index.js\"",
  "build": "vite build"
}
```

`server/data/vendors.db` added to `.gitignore`.

A product team member runs:

```bash
git checkout demo/vendor-listing-editor
npm install
npm run dev
# Vite on :5174, Express on :3001
# Open http://localhost:5174
```

---

## Frontend File List

```
src/
  demos/
    VendorListingDemo.jsx   — layout, initial fetch, shared state
    VendorEditor.jsx        — left panel (profile, team, pricing forms)
    MarketplacePreview.jsx  — right panel (live preview card)
```

Edits to existing files:
- `main.jsx` — add `BrowserRouter`, `Routes`, `Route`
- `src/App.jsx` — add "See the demo →" link on Project #6 card
- `package.json` — add `react-router-dom`, `concurrently`; add `express`, `better-sqlite3`, `cors` as dependencies

---

## Out of Scope

- Authentication / login — the demo opens directly to the vendor's listing
- Multiple vendors — the demo is hardcoded to vendor ID 1
- Image upload — hero image is a URL field only
- Availability calendar — out of scope per design decision
- 360° tours — out of scope per design decision
