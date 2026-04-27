import { useEffect, useState } from "react";

const SYSTEM_CONFIG = {
  Slack: {
    color: "#611F69",
    label: "Slack",
    subtitle: "#events-procurement",
    eventType: "proposal.received",
    renderContent: (log) => {
      const p = log.payload;
      return (
        <div
          style={{
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid #e8e8e8",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "4px",
                background: "#611F69",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#fff",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              P
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#0a0a0a",
                }}
              >
                Planned Bot
              </div>
              <div style={{ fontSize: "10px", color: "#aaa" }}>
                #{" "}events-procurement
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#333",
              lineHeight: 1.5,
              borderLeft: "3px solid #611F69",
              paddingLeft: "10px",
              marginTop: "8px",
            }}
          >
            <strong>{p.vendor}</strong> submitted a new proposal for{" "}
            <strong>{p.event_name}</strong>
            <br />
            Proposed value: <strong>${Number(p.proposal_value).toLocaleString()}</strong>
          </div>
        </div>
      );
    },
  },
  Salesforce: {
    color: "#0070D2",
    label: "Salesforce",
    subtitle: "Opportunity created",
    eventType: "contract.signed",
    renderContent: (log) => {
      const p = log.payload;
      return (
        <div
          style={{
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid #e8e8e8",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#0070D2",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            New Opportunity
          </div>
          {[
            ["Deal Name", `${p.vendor} — ${p.package}`],
            ["Stage", "Closed Won"],
            ["Amount", `$${Number(p.value).toLocaleString()}`],
            ["Contract", p.contract_id],
            ["Close Date", new Date(p.signed_at).toLocaleDateString()],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                borderBottom: "1px solid #f5f5f5",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "#888" }}>{label}</span>
              <span style={{ color: "#0a0a0a", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  "SAP Concur": {
    color: "#0F6AB4",
    label: "SAP Concur",
    subtitle: "Expense report created",
    eventType: "payment.approved",
    renderContent: (log) => {
      const p = log.payload;
      return (
        <div
          style={{
            background: "#fff",
            borderRadius: "6px",
            border: "1px solid #e8e8e8",
            padding: "12px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#0F6AB4",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            Expense Report Entry
          </div>
          {[
            ["Report", "Q3 Events — Leadership"],
            ["Vendor", p.vendor],
            ["Amount", `$${Number(p.amount).toLocaleString()}`],
            ["Payment ID", p.payment_id],
            ["Status", "Approved"],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "4px 0",
                borderBottom: "1px solid #f5f5f5",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "#888" }}>{label}</span>
              <span style={{ color: "#0a0a0a", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
      );
    },
  },
};

const SYSTEM_ORDER = ["Slack", "Salesforce", "SAP Concur"];

function TargetCard({ config, log, disabled }) {
  const [flash, setFlash] = useState(false);

  // Flash when a new log arrives for this target
  useEffect(() => {
    if (log && !disabled) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1200);
      return () => clearTimeout(t);
    }
  }, [log?.id]);

  const active = log && !disabled;

  return (
    <div
      style={{
        background: flash ? `${config.color}08` : "#fff",
        border: `1px solid ${flash ? config.color + "40" : "#e8e8e8"}`,
        borderRadius: "10px",
        padding: "16px",
        transition: "all 0.4s ease",
        position: "relative",
        overflow: "hidden",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {/* Disabled overlay */}
      {disabled && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.7)",
            zIndex: 2,
            borderRadius: "10px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#aaa",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Disabled
          </span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: active ? config.color : "#ddd",
            transition: "background 0.3s",
            boxShadow: flash ? `0 0 8px ${config.color}60` : "none",
          }}
        />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a" }}>
          {config.label}
        </span>
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#aaa",
          marginBottom: active ? "14px" : "0",
        }}
      >
        {config.subtitle}
      </div>

      {/* Content — appears when webhook fires */}
      {active && (
        <div
          style={{
            animation: "fadeSlideIn 0.4s ease forwards",
          }}
        >
          {config.renderContent(log)}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes fadeSlideIn { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
        }
      `}</style>
    </div>
  );
}

export default function TargetSystems({ logs, webhooks }) {
  // Map each system to its most recent log entry
  const latestBySystem = {};
  for (const log of logs) {
    if (log.status === "delivered") {
      latestBySystem[log.target_system] = log;
    }
  }

  // Map webhook active states by target_system
  const disabledSystems = new Set();
  for (const wh of webhooks) {
    if (!wh.active) disabledSystems.add(wh.target_system);
  }

  return (
    <div style={{ padding: "24px 20px", overflowY: "auto", height: "100%" }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          marginBottom: "20px",
        }}
      >
        Target Systems
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {SYSTEM_ORDER.map((name) => {
          const config = SYSTEM_CONFIG[name];
          return (
            <TargetCard
              key={name}
              config={config}
              log={latestBySystem[name] || null}
              disabled={disabledSystems.has(name)}
            />
          );
        })}
      </div>
    </div>
  );
}
