import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const AVATAR_COLORS = {
  S: "#3498DB",
  J: "#9B59B6",
  M: "#E74C3C",
  T: "#27AE60",
  Y: "#0a0a0a",
};

const SEED_EVENTS = [
  {
    id: 1,
    name: "Q3 Sales Kickoff",
    venue: "Westin Chicago River North",
    date: "Sep 15–17",
    unread: 2,
    messages: [
      {
        id: 1, from: "Sarah M.", role: "Venue Contact", avatar: "S",
        time: "9:02 AM", channel: "in-app",
        text: "Hi team — I've sent over the updated catering menu and room block options. Let me know if you'd like to adjust the attrition clause before we finalize.",
      },
      {
        id: 2, from: "You", role: "Planner", avatar: "Y",
        time: "9:18 AM", channel: "in-app",
        text: "Thanks Sarah. We'll need to reduce the F&B guarantee from 150 to 120 attendees. Can you get that reflected in the contract?",
      },
      {
        id: 3, from: "James K.", role: "Finance", avatar: "J",
        time: "10:05 AM", channel: "in-app",
        text: "@You — heads up, the revised budget cap is $85k total (down from $95k). This affects room block pricing.",
      },
      {
        id: 4, from: "Sarah M.", role: "Venue Contact", avatar: "S",
        time: "10:34 AM", channel: "in-app",
        text: "Understood on the count. I'll send a revised contract by EOD — room rate holds at $229/night for the adjusted block.",
      },
      {
        id: 5, from: "Sarah M.", role: "Venue Contact", avatar: "S",
        time: "10:35 AM", channel: "in-app",
        text: "Contract_v2_Westin_Q3SKO.pdf", isDoc: true,
      },
    ],
  },
  {
    id: 2,
    name: "Executive Leadership Retreat",
    venue: "Four Seasons Austin",
    date: "Oct 4–6",
    unread: 0,
    messages: [
      {
        id: 1, from: "Maria L.", role: "Venue Contact", avatar: "M",
        time: "Yesterday", channel: "email",
        text: "Good news — the rooftop terrace is available Oct 5th for your dinner. Capacity is 40 guests, which fits perfectly.",
      },
      {
        id: 2, from: "You", role: "Planner", avatar: "Y",
        time: "Yesterday", channel: "email",
        text: "Perfect. Can we also confirm the AV setup for morning sessions? We'll need simultaneous projection in two breakout rooms.",
      },
      {
        id: 3, from: "Maria L.", role: "Venue Contact", avatar: "M",
        time: "Yesterday", channel: "email",
        text: "Confirmed — two breakout rooms with full projection, lapel mics, and streaming capability. I'll include this in the BEO.",
      },
    ],
  },
  {
    id: 3,
    name: "HR All-Hands",
    venue: "Convene at 101 Park",
    date: "Nov 12",
    unread: 1,
    messages: [
      {
        id: 1, from: "Tom B.", role: "Venue Contact", avatar: "T",
        time: "Mon", channel: "in-app",
        text: "Welcome! I'm your dedicated coordinator at Convene. Happy to be your point of contact for the HR All-Hands. What questions do you have?",
      },
      {
        id: 2, from: "You", role: "Planner", avatar: "Y",
        time: "Mon", channel: "in-app",
        text: "Hi Tom! We're expecting 200–230 attendees. Does the main hall fit that in theater configuration?",
      },
      {
        id: 3, from: "Tom B.", role: "Venue Contact", avatar: "T",
        time: "Tue", channel: "in-app",
        text: "Theater-style fits 250 — you're good. I can also hold the adjacent breakout room at no charge for speaker prep. Want me to add it?",
      },
    ],
  },
];

function Avatar({ letter, size = 28 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: AVATAR_COLORS[letter] || "#888",
        color: "#fff", fontSize: size * 0.42, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, letterSpacing: 0,
      }}
    >
      {letter}
    </div>
  );
}

function Bubble({ msg }) {
  const isOwn = msg.from === "You";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "9px",
        marginBottom: "18px",
      }}
    >
      {!isOwn && <Avatar letter={msg.avatar} />}
      <div
        style={{
          maxWidth: "62%",
          display: "flex",
          flexDirection: "column",
          alignItems: isOwn ? "flex-end" : "flex-start",
          gap: "3px",
        }}
      >
        {!isOwn && (
          <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#0a0a0a" }}>
              {msg.from}
            </span>
            <span style={{ fontSize: "10px", color: "#bbb" }}>{msg.role}</span>
          </div>
        )}
        {msg.isDoc ? (
          <div
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", borderRadius: "10px",
              background: isOwn ? "#0a0a0a" : "#f2f2f2",
              color: isOwn ? "#fff" : "#0a0a0a",
              fontSize: "12px", fontWeight: 500,
              border: isOwn ? "none" : "1px solid #e4e4e4",
            }}
          >
            <span style={{ fontSize: "14px" }}>📄</span>
            <span style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>
              {msg.text}
            </span>
          </div>
        ) : (
          <div
            style={{
              padding: "10px 14px", borderRadius: "12px",
              background: isOwn ? "#0a0a0a" : "#f2f2f2",
              color: isOwn ? "#fff" : "#0a0a0a",
              fontSize: "13px", lineHeight: 1.55,
              border: isOwn ? "none" : "1px solid #e8e8e8",
            }}
          >
            {msg.text}
          </div>
        )}
        <div style={{ fontSize: "10px", color: "#ccc", display: "flex", gap: "6px" }}>
          <span>{msg.time}</span>
          {isOwn && <span>· Read ✓</span>}
          {msg.channel && (
            <span style={{
              background: "#f5f5f5", borderRadius: "3px",
              padding: "0 4px", color: "#bbb", fontSize: "9px",
              textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600,
            }}>
              {msg.channel === "in-app" ? "In-App" : "Email"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommunicationHubDemo() {
  const [events, setEvents] = useState(SEED_EVENTS);
  const [selectedId, setSelectedId] = useState(1);
  const [input, setInput] = useState("");
  const [channel, setChannel] = useState("in-app");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const selected = events.find((e) => e.id === selectedId);

  useEffect(() => {
    setEvents((prev) =>
      prev.map((e) => (e.id === selectedId ? { ...e, unread: 0 } : e))
    );
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const send = () => {
    if (!input.trim()) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === selectedId
          ? {
              ...e,
              messages: [
                ...e.messages,
                {
                  id: Date.now(),
                  from: "You", role: "Planner", avatar: "Y",
                  time: "Just now", channel,
                  text: input.trim(),
                },
              ],
            }
          : e
      )
    );
    setInput("");
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <div
      style={{
        fontFamily: FONT,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: "52px",
          borderBottom: "1px solid #e8e8e8", background: "#fafafa", flexShrink: 0,
        }}
      >
        <Link
          to="/"
          style={{ fontSize: "13px", color: "#888", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
        >
          &larr; Back to analysis
        </Link>

        <span style={{ fontSize: "12px", fontWeight: 600, color: "#0a0a0a", letterSpacing: "-0.1px" }}>
          Communication Hub &mdash; Demo
        </span>

        {/* Channel toggle */}
        <div
          style={{
            display: "flex", background: "#f0f0f0",
            borderRadius: "6px", padding: "2px", gap: "2px",
          }}
        >
          {["in-app", "email"].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              style={{
                padding: "4px 12px", borderRadius: "4px", border: "none",
                background: channel === ch ? "#fff" : "transparent",
                boxShadow: channel === ch ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                fontSize: "11px", fontWeight: 600, cursor: "pointer",
                color: channel === ch ? "#0a0a0a" : "#999",
              }}
            >
              {ch === "in-app" ? "In-App" : "Email"}
            </button>
          ))}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div
          style={{
            width: "248px", borderRight: "1px solid #e8e8e8",
            display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
          }}
        >
          <div
            style={{
              padding: "12px 16px 10px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                fontSize: "10px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "1px", color: "#ccc",
              }}
            >
              Events
            </div>
          </div>

          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedId(ev.id)}
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #f5f5f5",
                cursor: "pointer",
                background: ev.id === selectedId ? "#f7f7f7" : "#fff",
                borderLeft: ev.id === selectedId
                  ? "2px solid #0a0a0a"
                  : "2px solid transparent",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                <div
                  style={{
                    fontWeight: ev.unread > 0 ? 700 : 500,
                    fontSize: "13px", color: "#0a0a0a", lineHeight: 1.3,
                  }}
                >
                  {ev.name}
                </div>
                {ev.unread > 0 && (
                  <span
                    style={{
                      background: "#0a0a0a", color: "#fff",
                      fontSize: "10px", fontWeight: 700,
                      borderRadius: "10px", padding: "1px 7px",
                      flexShrink: 0,
                    }}
                  >
                    {ev.unread}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>{ev.venue}</div>
              <div style={{ fontSize: "11px", color: "#ccc", marginTop: "2px" }}>{ev.date}</div>
            </div>
          ))}
        </div>

        {/* Thread */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Thread header */}
          <div
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid #f0f0f0",
              flexShrink: 0,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#0a0a0a" }}>
              {selected?.name}
            </div>
            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
              {selected?.venue} &middot; {selected?.date}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {selected?.messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 24px 16px",
              borderTop: "1px solid #f0f0f0",
              flexShrink: 0,
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                flex: 1, border: "1px solid #e0e0e0", borderRadius: "10px",
                padding: "10px 14px", background: "#fafafa",
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={`Send via ${channel === "in-app" ? "in-app chat" : "email"}… (Enter to send)`}
                rows={2}
                style={{
                  width: "100%", border: "none", background: "transparent",
                  resize: "none", fontFamily: FONT, fontSize: "13px",
                  color: "#0a0a0a", outline: "none", lineHeight: 1.5,
                  minHeight: "36px", maxHeight: "100px",
                }}
              />
            </div>
            <button
              onClick={send}
              style={{
                background: "#0a0a0a", color: "#fff", border: "none",
                borderRadius: "8px", padding: "10px 18px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                flexShrink: 0, height: "42px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
