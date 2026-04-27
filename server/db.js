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

// ─── Vendor tables ──────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    location TEXT,
    hero_image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Owner', 'Editor', 'Viewer')),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
  );

  CREATE TABLE IF NOT EXISTS pricing_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
  );
`);

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

// ─── Seed vendor data ───────────────────────────────────────────────────────
const vendorCount = db.prepare("SELECT COUNT(*) AS c FROM vendors").get();
if (vendorCount.c === 0) {
  db.prepare(`
    INSERT INTO vendors (id, name, tagline, description, location, hero_image_url)
    VALUES (1, ?, ?, ?, ?, ?)
  `).run(
    "The Meridian Grand",
    "Where business meets unforgettable experiences",
    "A premier event venue in the heart of Chicago's Loop district. The Meridian Grand offers 15,000 sq ft of flexible meeting and event space across three floors, with floor-to-ceiling windows overlooking Millennium Park. Ideal for corporate retreats, product launches, board meetings, and client dinners. Full-service catering, dedicated AV team, and on-site event coordinator included with all packages.",
    "Chicago, IL",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"
  );

  const insertMember = db.prepare(
    "INSERT INTO team_members (vendor_id, name, email, role) VALUES (1, ?, ?, ?)"
  );
  insertMember.run("Sarah Chen", "sarah@meridian.com", "Owner");
  insertMember.run("James Okafor", "james@meridian.com", "Editor");

  const insertPricing = db.prepare(
    "INSERT INTO pricing_packages (vendor_id, label, price) VALUES (1, ?, ?)"
  );
  insertPricing.run("Half-Day Meeting Room", 3500);
  insertPricing.run("Full-Day Buyout", 12000);
  insertPricing.run("Weekend Event Package", 18500);
}

// ─── Seed webhook data ──────────────────────────────────────────────────────
const webhookCount = db.prepare("SELECT COUNT(*) AS c FROM webhooks").get();
if (webhookCount.c === 0) {
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
