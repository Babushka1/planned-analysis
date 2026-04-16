import Database from "better-sqlite3";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "vendors.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── Webhook tables ─────────────────────────────────────────────────────────
db.exec(`
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
`);

// ─── Seed webhooks if empty ──────────────────────────────────────────────────
const count = db.prepare("SELECT COUNT(*) AS c FROM webhooks").get();
if (count.c === 0) {
  const insert = db.prepare(
    "INSERT INTO webhooks (event_type, target_system, target_url, description) VALUES (?, ?, ?, ?)"
  );

  insert.run(
    "proposal.received",
    "Slack",
    "https://hooks.slack.com/services/T00000/B00000/XXXXXXXXXXXX",
    "Post to #events-procurement channel"
  );

  insert.run(
    "contract.signed",
    "Salesforce",
    "https://hooks.salesforce.com/services/apexrest/planned/opportunity",
    "Create Opportunity record with contract value"
  );

  insert.run(
    "payment.approved",
    "SAP Concur",
    "https://us.api.concursolutions.com/api/v3.0/expense/entries",
    "Create expense report entry with line items"
  );
}

export default db;
