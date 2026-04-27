const EVENT_ICONS = {
  "proposal.received": "\u{1F4E9}",
  "contract.signed": "\u{1F4DD}",
  "payment.approved": "\u{2705}",
};

const EVENT_LABELS = {
  "proposal.received": "Proposal Received",
  "contract.signed": "Contract Signed",
  "payment.approved": "Payment Approved",
};

const SYSTEM_COLORS = {
  Salesforce: "#0070D2",
  Slack: "#611F69",
  "SAP Concur": "#0F6AB4",
};

export default function WebhookConfig({ webhooks, onToggle }) {
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
        Configured Webhooks
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {webhooks.map((wh) => {
          const color = SYSTEM_COLORS[wh.target_system] || "#888";
          return (
            <div
              key={wh.id}
              style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: "10px",
                padding: "16px",
                opacity: wh.active ? 1 : 0.55,
                transition: "opacity 0.2s",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>
                    {EVENT_ICONS[wh.event_type] || "\u{1F514}"}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0a0a0a",
                    }}
                  >
                    {EVENT_LABELS[wh.event_type] || wh.event_type}
                  </span>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => onToggle(wh.id, !wh.active)}
                  style={{
                    width: "40px",
                    height: "22px",
                    borderRadius: "11px",
                    border: "none",
                    background: wh.active ? "#27AE60" : "#ddd",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: "3px",
                      left: wh.active ? "21px" : "3px",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                  />
                </button>
              </div>

              {/* Target */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "12px", fontWeight: 600, color }}>
                  {wh.target_system}
                </span>
              </div>

              <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>
                {wh.description}
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#bbb",
                  fontFamily: "ui-monospace, monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {wh.target_url}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
