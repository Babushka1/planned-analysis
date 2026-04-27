import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import WebhookConfig from "./WebhookConfig";
import ActivityFeed from "./ActivityFeed";
import TargetSystems from "./TargetSystems";

const API = "http://localhost:3001/api/webhooks";

export default function WebhookConnectorDemo() {
  const [webhooks, setWebhooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchWebhooks = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setWebhooks(await res.json());
    } catch {
      setError("Could not connect to the API server.");
    }
  }, []);

  const toggleWebhook = async (id, active) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setWebhooks((prev) =>
        prev.map((wh) => (wh.id === updated.id ? updated : wh))
      );
    } catch {
      // silent fail for toggle
    }
  };

  // Reset and start auto-play on mount
  useEffect(() => {
    const init = async () => {
      try {
        // Reset the demo sequence
        await fetch(`${API}/reset`, { method: "POST" });
        await fetchWebhooks();

        // Start auto-play after a brief delay
        setRunning(true);
      } catch {
        setError("Could not connect to the API server.");
      }
    };
    init();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchWebhooks]);

  // Auto-play timer
  useEffect(() => {
    if (!running) return;

    // Initial delay before first event
    const startDelay = setTimeout(() => {
      simulateNext();

      timerRef.current = setInterval(() => {
        simulateNext();
      }, 4000);
    }, 1500);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const simulateNext = async () => {
    try {
      const res = await fetch(`${API}/simulate`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (data.done) {
        setRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      setLogs((prev) => [...prev, data.log]);
    } catch {
      // stop on error
      setRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          fontFamily: "'Inter', -apple-system, sans-serif",
          color: "#555",
        }}
      >
        <div style={{ fontSize: "15px" }}>{error}</div>
        <div style={{ fontSize: "13px", color: "#aaa" }}>
          Make sure both Vite and Express are running:{" "}
          <code
            style={{
              background: "#f5f5f5",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            npm run dev
          </code>
        </div>
        <Link
          to="/"
          style={{ fontSize: "13px", color: "#0a0a0a", marginTop: "8px" }}
        >
          &larr; Back to analysis
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f7f7f7",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "52px",
          borderBottom: "1px solid #e8e8e8",
          flexShrink: 0,
          background: "#fff",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "13px",
            color: "#888",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>&larr;</span> Back to analysis
        </Link>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#0a0a0a",
          }}
        >
          Webhook Connector Demo
        </div>
        <div style={{ width: "120px" }} />
      </header>

      {/* Three panels */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left — Config */}
        <div
          style={{
            flex: "0 0 260px",
            borderRight: "1px solid #e8e8e8",
            overflow: "hidden",
            background: "#fafafa",
          }}
        >
          <WebhookConfig webhooks={webhooks} onToggle={toggleWebhook} />
        </div>

        {/* Center — Activity Feed */}
        <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
          <ActivityFeed logs={logs} running={running} />
        </div>

        {/* Right — Target Systems */}
        <div
          style={{
            flex: "0 0 300px",
            borderLeft: "1px solid #e8e8e8",
            overflow: "hidden",
            background: "#fafafa",
          }}
        >
          <TargetSystems logs={logs} webhooks={webhooks} />
        </div>
      </div>
    </div>
  );
}
