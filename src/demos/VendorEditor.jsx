import { useState } from "react";

const API = "http://localhost:3001/api/vendors/1";

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontFamily: "inherit",
  background: "#fff",
  color: "#0a0a0a",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "6px",
};

const btnStyle = {
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "opacity 0.15s",
};

function SectionTitle({ children }) {
  return (
    <h3
      style={{
        fontSize: "13px",
        fontWeight: 700,
        color: "#0a0a0a",
        textTransform: "uppercase",
        letterSpacing: "1px",
        margin: "0 0 20px 0",
        paddingBottom: "12px",
        borderBottom: "2px solid #0a0a0a",
      }}
    >
      {children}
    </h3>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ─── Profile Section ──────────────────────────────────────────────────────────
function ProfileSection({ vendor, onChange, onSave, saving, toast }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <SectionTitle>Profile</SectionTitle>
      <Field label="Venue Name">
        <input
          style={inputStyle}
          value={vendor.name}
          onChange={(e) => onChange({ ...vendor, name: e.target.value })}
        />
      </Field>
      <Field label="Tagline">
        <input
          style={inputStyle}
          value={vendor.tagline || ""}
          onChange={(e) => onChange({ ...vendor, tagline: e.target.value })}
        />
      </Field>
      <Field label="Description">
        <textarea
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
          value={vendor.description || ""}
          onChange={(e) => onChange({ ...vendor, description: e.target.value })}
        />
      </Field>
      <Field label="Location">
        <input
          style={inputStyle}
          value={vendor.location || ""}
          onChange={(e) => onChange({ ...vendor, location: e.target.value })}
        />
      </Field>
      <Field label="Hero Image URL">
        <input
          style={inputStyle}
          value={vendor.hero_image_url || ""}
          placeholder="https://..."
          onChange={(e) =>
            onChange({ ...vendor, hero_image_url: e.target.value })
          }
        />
      </Field>
      <button
        style={{
          ...btnStyle,
          background: "#0a0a0a",
          color: "#fff",
          padding: "10px 28px",
          opacity: saving ? 0.6 : 1,
        }}
        disabled={saving}
        onClick={onSave}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      {toast && (
        <span
          style={{
            marginLeft: "14px",
            fontSize: "13px",
            fontWeight: 500,
            color: toast.type === "success" ? "#27AE60" : "#E74C3C",
          }}
        >
          {toast.message}
        </span>
      )}
    </div>
  );
}

// ─── Team Section ─────────────────────────────────────────────────────────────
function TeamSection({ team, onAdd, onRemove }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");

  const handleAdd = async () => {
    if (!name.trim() || !email.trim()) return;
    await onAdd({ name: name.trim(), email: email.trim(), role });
    setName("");
    setEmail("");
    setRole("Viewer");
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <SectionTitle>Team Members</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {team.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              background: "#fafafa",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: m.role === "Owner" ? "#0a0a0a" : "#e8e8e8",
                color: m.role === "Owner" ? "#fff" : "#555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {m.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#0a0a0a" }}>
                {m.name}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>{m.email}</div>
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                background: m.role === "Owner" ? "#0a0a0a" : "#f0f0f0",
                color: m.role === "Owner" ? "#fff" : "#555",
              }}
            >
              {m.role}
            </span>
            {m.role !== "Owner" && (
              <button
                onClick={() => onRemove(m.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ccc",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "0 4px",
                }}
                title="Remove"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 120px", minWidth: "100px" }}>
          <label style={labelStyle}>Name</label>
          <input
            style={inputStyle}
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ flex: "1 1 160px", minWidth: "140px" }}>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ flex: "0 0 110px" }}>
          <label style={labelStyle}>Role</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Editor</option>
            <option>Viewer</option>
          </select>
        </div>
        <button
          style={{
            ...btnStyle,
            background: "#f0f0f0",
            color: "#0a0a0a",
            padding: "10px 18px",
            flexShrink: 0,
          }}
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────
function PricingSection({ pricing, onAdd, onRemove }) {
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");

  const handleAdd = async () => {
    if (!label.trim() || !price) return;
    await onAdd({ label: label.trim(), price: Number(price) });
    setLabel("");
    setPrice("");
  };

  const fmt = (cents) =>
    "$" + Number(cents).toLocaleString("en-US");

  return (
    <div>
      <SectionTitle>Pricing Packages</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {pricing.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              background: "#fafafa",
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
          >
            <div style={{ flex: 1, fontSize: "13px", fontWeight: 500, color: "#0a0a0a" }}>
              {p.label}
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#0a0a0a" }}>
              {fmt(p.price)}
            </div>
            <button
              onClick={() => onRemove(p.id)}
              style={{
                background: "none",
                border: "none",
                color: "#ccc",
                cursor: "pointer",
                fontSize: "18px",
                lineHeight: 1,
                padding: "0 4px",
              }}
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px" }}>
          <label style={labelStyle}>Package Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Full-Day Buyout"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div style={{ flex: "0 0 130px" }}>
          <label style={labelStyle}>Price ($)</label>
          <input
            style={inputStyle}
            type="number"
            placeholder="12000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button
          style={{
            ...btnStyle,
            background: "#f0f0f0",
            color: "#0a0a0a",
            padding: "10px 18px",
            flexShrink: 0,
          }}
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────
export default function VendorEditor({ vendor, onVendorChange, onRefresh }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: vendor.name,
          tagline: vendor.tagline,
          description: vendor.description,
          location: vendor.location,
          hero_image_url: vendor.hero_image_url,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("success", "Changes saved");
    } catch {
      showToast("error", "Something went wrong — try again");
    } finally {
      setSaving(false);
    }
  };

  const addTeamMember = async (member) => {
    try {
      const res = await fetch(`${API}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      showToast("error", "Failed to add team member");
    }
  };

  const removeTeamMember = async (id) => {
    try {
      const res = await fetch(`${API}/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      showToast("error", "Failed to remove team member");
    }
  };

  const addPricing = async (pkg) => {
    try {
      const res = await fetch(`${API}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      showToast("error", "Failed to add package");
    }
  };

  const removePricing = async (id) => {
    try {
      const res = await fetch(`${API}/pricing/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      showToast("error", "Failed to remove package");
    }
  };

  return (
    <div style={{ padding: "32px 28px", overflowY: "auto", height: "100%" }}>
      <ProfileSection
        vendor={vendor}
        onChange={onVendorChange}
        onSave={handleSave}
        saving={saving}
        toast={toast}
      />
      <TeamSection
        team={vendor.team || []}
        onAdd={addTeamMember}
        onRemove={removeTeamMember}
      />
      <PricingSection
        pricing={vendor.pricing || []}
        onAdd={addPricing}
        onRemove={removePricing}
      />
    </div>
  );
}
