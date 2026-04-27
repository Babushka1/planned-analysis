import { Router } from "express";
import db from "../db.js";

const router = Router();

// ─── Demo sequence ──────────────────────────────────────────────────────────
const DEMO_SEQUENCE = [
  {
    event_type: "proposal.received",
    payload: () => ({
      event: "proposal.received",
      vendor: "The Meridian Grand",
      event_name: "Q3 Leadership Retreat",
      proposal_value: 18500,
      submitted_at: new Date().toISOString(),
    }),
  },
  {
    event_type: "contract.signed",
    payload: () => ({
      event: "contract.signed",
      contract_id: "PLN-2024-0847",
      vendor: "The Meridian Grand",
      package: "Weekend Event Package",
      value: 18500,
      signed_at: new Date().toISOString(),
    }),
  },
  {
    event_type: "payment.approved",
    payload: () => ({
      event: "payment.approved",
      payment_id: "PAY-9281",
      vendor: "The Meridian Grand",
      amount: 18500,
      approved_at: new Date().toISOString(),
    }),
  },
];

let sequenceIndex = 0;

// ─── GET /api/webhooks — list all webhooks ──────────────────────────────────
router.get("/", (_req, res) => {
  const webhooks = db.prepare("SELECT * FROM webhooks ORDER BY id").all();
  res.json(webhooks);
});

// ─── PATCH /api/webhooks/:id — toggle active ────────────────────────────────
router.patch("/:id", (req, res) => {
  const webhook = db.prepare("SELECT * FROM webhooks WHERE id = ?").get(req.params.id);
  if (!webhook) return res.status(404).json({ error: "Webhook not found" });

  const active = req.body.active != null ? (req.body.active ? 1 : 0) : (webhook.active ? 0 : 1);
  db.prepare("UPDATE webhooks SET active = ? WHERE id = ?").run(active, req.params.id);

  const updated = db.prepare("SELECT * FROM webhooks WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// ─── POST /api/webhooks/simulate — fire next event ──────────────────────────
router.post("/simulate", (_req, res) => {
  if (sequenceIndex >= DEMO_SEQUENCE.length) {
    return res.json({ done: true });
  }

  const step = DEMO_SEQUENCE[sequenceIndex];
  const payload = step.payload();

  const webhook = db
    .prepare("SELECT * FROM webhooks WHERE event_type = ?")
    .get(step.event_type);

  if (!webhook) {
    sequenceIndex++;
    return res.status(500).json({ error: "Webhook config not found for " + step.event_type });
  }

  const status = webhook.active ? "delivered" : "skipped";
  const firedAt = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO webhook_logs (webhook_id, event_type, payload, target_system, fired_at, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    webhook.id,
    step.event_type,
    JSON.stringify(payload),
    webhook.target_system,
    firedAt,
    status
  );

  const logEntry = db.prepare("SELECT * FROM webhook_logs WHERE id = ?").get(result.lastInsertRowid);
  logEntry.payload = JSON.parse(logEntry.payload);

  sequenceIndex++;

  res.json({
    done: false,
    remaining: DEMO_SEQUENCE.length - sequenceIndex,
    log: logEntry,
  });
});

// ─── GET /api/webhooks/logs — list all logs ─────────────────────────────────
router.get("/logs", (_req, res) => {
  const logs = db
    .prepare("SELECT * FROM webhook_logs ORDER BY fired_at ASC")
    .all()
    .map((l) => ({ ...l, payload: JSON.parse(l.payload) }));
  res.json(logs);
});

// ─── POST /api/webhooks/reset — reset demo ──────────────────────────────────
router.post("/reset", (_req, res) => {
  sequenceIndex = 0;
  db.prepare("DELETE FROM webhook_logs").run();
  res.json({ reset: true });
});

export default router;
