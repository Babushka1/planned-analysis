import { useRef, useEffect } from "react";

const EVENT_LABELS = {
  "proposal.received": "Proposal Received",
  "contract.signed": "Contract Signed",
  "payment.approved": "Payment Approved",
};

const EVENT_COLORS = {
  "proposal.received": "#611F69",
  "contract.signed": "#0070D2",
  "payment.approved": "#0F6AB4",
};

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function eventSummary(log) {
  const p = log.payload;
  switch (log.event_type) {
    case "proposal.received":
      return `"${p.vendor}" submitted a proposal for ${p.event_name}`;
    case "contract.signed":
      return `Contract ${p.contract_id} executed — $${Number(p.value).toLocaleString()} ${p.package}`;
    case "payment.approved":
      return `Payment ${p.payment_id} approved — $${Number(p.amount).toLocaleString()} to ${p.vendor}`;
    default:
      return log.event_type;
  }
}

function targetAction(log) {
  switch (log.target_system) {
    case "Slack":
      return "Slack (#events-procurement)";
    case "Salesforce":
      return "Salesforce (Opportunity created)";
    case "SAP Concur":
      return "SAP Concur (Expense report created)";
    default:
      return log.target_system;
  }
}

export default function ActivityFeed({ logs, running }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div
      style={{
        padding: "24px 24px",
        overflowY: "auto",
        height: "100%",
        background: "#0a0a0a",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
          }}
        >
          Live Activity Feed
        </div>
        {running && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#27AE60",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              AUTO-PLAY
            </span>
          </div>
        )}
      </div>

      {logs.length === 0 && (
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.2)",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          Waiting for events...
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {logs.map((log, i) => {
          const color = EVENT_COLORS[log.event_type] || "#888";
          const isSkipped = log.status === "skipped";

          return (
            <div
              key={log.id || i}
              style={{
                padding: "16px 0",
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                animation: "fadeSlideIn 0.4s ease forwards",
              }}
            >
              {/* Timestamp + event label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "ui-monospace, monospace",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {formatTime(log.fired_at)}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color,
                    background: `${color}22`,
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {EVENT_LABELS[log.event_type] || log.event_type}
                </span>
              </div>

              {/* Summary */}
              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.5,
                  marginBottom: "8px",
                }}
              >
                {eventSummary(log)}
              </div>

              {/* Webhook status */}
              <div
                style={{
                  fontSize: "11px",
                  color: isSkipped ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "10px",
                }}
              >
                <span>{isSkipped ? "\u{26D4}" : "\u{2192}"}</span>
                {isSkipped
                  ? "Webhook skipped (disabled)"
                  : `Webhook fired to ${targetAction(log)}`}
              </div>

              {/* JSON payload */}
              {!isSkipped && (
                <pre
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.5,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    margin: 0,
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "ui-monospace, monospace",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pulse { 0%, 100% { opacity: 1; } }
          @keyframes fadeSlideIn { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
        }
      `}</style>
    </div>
  );
}
