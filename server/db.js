import Database from "better-sqlite3";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "vendors.db"));

// Enable WAL for better concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables
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

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) AS c FROM vendors").get();
if (count.c === 0) {
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

export default db;
