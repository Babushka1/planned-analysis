# Webhook Connector — Demo Design

**Branch:** `demo/api-middleware`
**Date:** 2026-04-16
**Problem addressed:** Planned has no public API, blocking integrations with CRMs (Salesforce, HubSpot), travel management tools, expense systems, and custom enterprise workflows — a dealbreaker for large organizations.

---

## Overview

A self-running webhook connector demo that shows how Planned could integrate with enterprise systems via event-triggered webhooks. An admin dashboard displays three pre-configured webhooks, a live activity feed that auto-plays a scripted event sequence, and mock target system cards (Salesforce, Slack, SAP Concur) that visually react when their webhook fires.

The demo is fully runnable locally with `npm install && npm run dev` and persists webhook configurations to SQLite.

---

## Routing & Entry Point

New route added to `main.jsx`:

| Route | Component |
|---|---|
| `/demo/webhook-connector` | New `WebhookConnectorDemo` |

The "API Middleware / Webhook Connector" card (Project #8) on the main analysis page gains a "See the demo →" link that navigates to `/demo/webhook-connector`.

---

## Layout

Full-viewport, three-panel layout with a fixed header bar:

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to analysis          Webhook Connector Demo          │
├──────────────┬──────────────────────┬────────────────────────┤
│              │                      │                        │
│  WEBHOOK     │   LIVE ACTIVITY      │   TARGET SYSTEMS       │
│  CONFIG      │   FEED               │   (Salesforce, Slack,  │
│  (left)      │   (center, timeline) │    SAP Concur)         │
│              │                      │                        │
└──────────────┴──────────────────────┴────────────────────────┘
```

On screens below 900px, panels stack vertically: config → activity feed → target cards.

---

## Left Panel — Webhook Configuration

Three pre-configured webhooks, each shown as a card:

| Event | Target System | Description |
|---|---|---|
| Contract Signed | Salesforce | Creates an Opportunity record with contract value |
| Proposal Received | Slack | Posts a formatted message to #events-procurement |
| Payment Approved | SAP Concur | Creates an expense report entry with line items |

Each card displays:
- Event type label and icon
- Target system name and action description
- URL endpoint (fake but realistic, e.g. `https://hooks.salesforce.com/...`)
- Active/inactive toggle switch
- Colored status dot (green = active, grey = disabled)

Toggle state persists to SQLite.

---

## Center Panel — Live Activity Feed

An auto-playing timeline that runs a scripted three-event demo sequence on page load. Events appear one by one with ~4 second gaps:

```
11:02:14  PROPOSAL RECEIVED
          "The Meridian Grand" submitted a proposal for Q3 Leadership Retreat
          → Webhook fired to Slack (#events-procurement)

11:02:18  CONTRACT SIGNED
          Contract #PLN-2024-0847 executed — $18,500 Weekend Event Package
          → Webhook fired to Salesforce (Opportunity created)

11:02:23  PAYMENT APPROVED
          Payment #PAY-9281 approved — $18,500 to The Meridian Grand
          → Webhook fired to SAP Concur (Expense report created)
```

Each entry:
- Fades in when it appears
- Shows the webhook payload as expandable JSON below the summary
- Displays "Webhook skipped (disabled)" if the corresponding webhook is toggled off

A pulsing "Auto-play" indicator in the header shows when the sequence is running. The sequence plays once then stops (does not loop).

The frontend calls `POST /api/webhooks/simulate` on a ~4 second timer. Each call advances the server-side sequence by one step. The server drives the sequence order.

---

## Right Panel — Target System Cards

Three cards representing Salesforce, Slack, and SAP Concur:

**Salesforce card:**
- Shows a mock Opportunity record: deal name, stage, amount, close date
- Lights up with a green pulse when "Contract Signed" fires

**Slack card:**
- Shows a mock Slack message preview: channel name, bot avatar, formatted message with proposal details
- Lights up with a purple pulse when "Proposal Received" fires

**SAP Concur card:**
- Shows a mock expense report line: report name, vendor, amount, status
- Lights up with a blue pulse when "Payment Approved" fires

Default state: dimmed/idle. When webhook fires: brief pulse animation + content appears. If webhook is disabled: "Disabled" overlay on the card, event skips it.

---

## Backend — Express + SQLite

Self-contained on the `demo/api-middleware` branch (does not depend on the vendor demo branch). Server directory:

```
server/
  index.js              — Express app, mounts webhook routes
  db.js                 — SQLite init, schema, seed data (webhooks + vendor)
  routes/
    webhooks.js         — webhook config + simulation endpoints
```

### Additional Schema

```sql
CREATE TABLE IF NOT EXISTS webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  target_system TEXT NOT NULL,
  target_url TEXT NOT NULL,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  webhook_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  target_system TEXT NOT NULL,
  fired_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'delivered',
  FOREIGN KEY (webhook_id) REFERENCES webhooks(id)
);
```

### Seed Data

Three webhooks inserted on first run:

1. **Contract Signed → Salesforce**
   - URL: `https://hooks.salesforce.com/services/apexrest/planned/opportunity`
   - Description: "Create Opportunity record with contract value"

2. **Proposal Received → Slack**
   - URL: `https://hooks.slack.com/services/T00000/B00000/XXXX`
   - Description: "Post to #events-procurement channel"

3. **Payment Approved → SAP Concur**
   - URL: `https://us.api.concursolutions.com/api/v3.0/expense/entries`
   - Description: "Create expense report entry with line items"

### Demo Sequence Payloads

The server stores a three-step sequence. Each call to `/simulate` returns the next step:

**Step 1 — Proposal Received:**
```json
{
  "event": "proposal.received",
  "vendor": "The Meridian Grand",
  "event_name": "Q3 Leadership Retreat",
  "proposal_value": 18500,
  "submitted_at": "<current ISO timestamp>"
}
```

**Step 2 — Contract Signed:**
```json
{
  "event": "contract.signed",
  "contract_id": "PLN-2024-0847",
  "vendor": "The Meridian Grand",
  "package": "Weekend Event Package",
  "value": 18500,
  "signed_at": "<current ISO timestamp>"
}
```

**Step 3 — Payment Approved:**
```json
{
  "event": "payment.approved",
  "payment_id": "PAY-9281",
  "vendor": "The Meridian Grand",
  "amount": 18500,
  "approved_at": "<current ISO timestamp>"
}
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/webhooks` | List all configured webhooks |
| `PATCH` | `/api/webhooks/:id` | Toggle active/inactive (`{ active: 0 or 1 }`) |
| `POST` | `/api/webhooks/simulate` | Fire the next event in the sequence, return event + payload + log entry |
| `GET` | `/api/webhooks/logs` | Get all webhook fire logs, ordered by fired_at desc |
| `POST` | `/api/webhooks/reset` | Reset the sequence counter to step 0 and clear logs |

The `/simulate` endpoint:
1. Reads the current step counter (stored in-memory on the server, starts at 0)
2. Looks up the webhook for that event type
3. If webhook is active: creates a log entry with status "delivered" and returns it
4. If webhook is inactive: creates a log entry with status "skipped" and returns it
5. Advances the counter. After step 3, returns `{ done: true }` and stops.

### Dependencies

Same as vendor demo — `express`, `better-sqlite3`, `cors`. No new dependencies.

---

## Dev Setup

Same `concurrently` pattern:

```json
{
  "dev": "concurrently \"vite\" \"node server/index.js\""
}
```

A product team member runs:

```bash
git checkout demo/api-middleware
npm install
npm run dev
# Open http://localhost:5173/demo/webhook-connector
```

---

## Frontend File List

```
src/
  demos/
    WebhookConnectorDemo.jsx  — layout, auto-play timer, shared state
    WebhookConfig.jsx         — left panel (webhook cards + toggles)
    ActivityFeed.jsx          — center panel (live timeline)
    TargetSystems.jsx         — right panel (Salesforce/Slack/Concur mock cards)
```

Edits to existing files:
- `main.jsx` — add `/demo/webhook-connector` route
- `src/App.jsx` — add "See the demo →" link on Project #8 card
- `server/db.js` — add webhook + webhook_logs tables, seed webhooks
- `server/index.js` — mount `/api/webhooks` routes

---

## Out of Scope

- Real HTTP calls to external systems — all targets are mocked on the server
- Custom webhook creation — only the three pre-seeded webhooks exist
- Retry logic or failure simulation — all webhooks "succeed" or are "skipped"
- Webhook payload editing — payloads are generated server-side from the fixed sequence
- Authentication — no login required, dashboard opens directly
