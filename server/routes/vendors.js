import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET /api/vendors/:id — full vendor with team + pricing
router.get("/:id", (req, res) => {
  const vendor = db
    .prepare("SELECT * FROM vendors WHERE id = ?")
    .get(req.params.id);

  if (!vendor) return res.status(404).json({ error: "Vendor not found" });

  vendor.team = db
    .prepare("SELECT * FROM team_members WHERE vendor_id = ? ORDER BY id")
    .all(req.params.id);

  vendor.pricing = db
    .prepare("SELECT * FROM pricing_packages WHERE vendor_id = ? ORDER BY id")
    .all(req.params.id);

  res.json(vendor);
});

// PATCH /api/vendors/:id — update profile fields
router.patch("/:id", (req, res) => {
  const vendor = db
    .prepare("SELECT * FROM vendors WHERE id = ?")
    .get(req.params.id);

  if (!vendor) return res.status(404).json({ error: "Vendor not found" });

  const { name, tagline, description, location, hero_image_url } = req.body;

  db.prepare(`
    UPDATE vendors
    SET name = COALESCE(?, name),
        tagline = COALESCE(?, tagline),
        description = COALESCE(?, description),
        location = COALESCE(?, location),
        hero_image_url = COALESCE(?, hero_image_url)
    WHERE id = ?
  `).run(name, tagline, description, location, hero_image_url, req.params.id);

  const updated = db
    .prepare("SELECT * FROM vendors WHERE id = ?")
    .get(req.params.id);
  updated.team = db
    .prepare("SELECT * FROM team_members WHERE vendor_id = ? ORDER BY id")
    .all(req.params.id);
  updated.pricing = db
    .prepare("SELECT * FROM pricing_packages WHERE vendor_id = ? ORDER BY id")
    .all(req.params.id);

  res.json(updated);
});

// POST /api/vendors/:id/team — add a team member
router.post("/:id/team", (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "name, email, and role are required" });
  }
  if (!["Owner", "Editor", "Viewer"].includes(role)) {
    return res.status(400).json({ error: "role must be Owner, Editor, or Viewer" });
  }

  const result = db
    .prepare("INSERT INTO team_members (vendor_id, name, email, role) VALUES (?, ?, ?, ?)")
    .run(req.params.id, name, email, role);

  const member = db
    .prepare("SELECT * FROM team_members WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(member);
});

// DELETE /api/vendors/:id/team/:memberId — remove a team member
router.delete("/:id/team/:memberId", (req, res) => {
  const member = db
    .prepare("SELECT * FROM team_members WHERE id = ? AND vendor_id = ?")
    .get(req.params.memberId, req.params.id);

  if (!member) return res.status(404).json({ error: "Team member not found" });
  if (member.role === "Owner") {
    return res.status(400).json({ error: "Cannot remove the Owner" });
  }

  db.prepare("DELETE FROM team_members WHERE id = ?").run(req.params.memberId);
  res.json({ deleted: true });
});

// POST /api/vendors/:id/pricing — add a pricing package
router.post("/:id/pricing", (req, res) => {
  const { label, price } = req.body;

  if (!label || price == null) {
    return res.status(400).json({ error: "label and price are required" });
  }

  const result = db
    .prepare("INSERT INTO pricing_packages (vendor_id, label, price) VALUES (?, ?, ?)")
    .run(req.params.id, label, Number(price));

  const pkg = db
    .prepare("SELECT * FROM pricing_packages WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(pkg);
});

// DELETE /api/vendors/:id/pricing/:pkgId — remove a pricing package
router.delete("/:id/pricing/:pkgId", (req, res) => {
  const pkg = db
    .prepare("SELECT * FROM pricing_packages WHERE id = ? AND vendor_id = ?")
    .get(req.params.pkgId, req.params.id);

  if (!pkg) return res.status(404).json({ error: "Pricing package not found" });

  db.prepare("DELETE FROM pricing_packages WHERE id = ?").run(req.params.pkgId);
  res.json({ deleted: true });
});

export default router;
