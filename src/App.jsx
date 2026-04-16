import { useState } from "react";

// Planned.com wordmark as SVG inline
const PlannedLogo = () => (
  <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="0"
      y="22"
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      fontWeight="600"
      fontSize="22"
      letterSpacing="-0.5"
      fill="#0a0a0a"
    >
      planned
    </text>
  </svg>
);

const categories = [
  {
    id: "pain-points",
    label: "User Pain Points",
    icon: "⚡",
    color: "#E74C3C",
    items: [
      {
        title: "In-Platform Communication Is Limited",
        description:
          "Multiple reviewers (both suppliers and clients) report that communicating directly on the platform — especially during contract negotiations — is clunky. Suppliers say chat-only communication is insufficient and want phone/email/in-person options surfaced within the workflow.",
        severity: "High",
        source: "Capterra, SoftwareAdvice reviews",
      },
      {
        title: "Document Sharing UX Is Broken",
        description:
          "Users find it challenging to send and receive documents through the inbox/messaging feature. Planned's own team acknowledged this in review responses, saying they're working on a fix.",
        severity: "High",
        source: "Capterra review (Greg B.)",
      },
      {
        title: "No Public API Available",
        description:
          "GetApp confirms Planned does not offer an API. This blocks integrations with CRMs (Salesforce, HubSpot), travel management tools, expense systems, and custom enterprise workflows — a dealbreaker for large organizations.",
        severity: "Critical",
        source: "GetApp listing",
      },
      {
        title: "Vendor Response Delays",
        description:
          "During beta/rollout periods, users had to contact their Planned rep manually to get vendor replies. The automated vendor outreach pipeline has reliability gaps.",
        severity: "Medium",
        source: "SoftwareAdvice review (Robert)",
      },
      {
        title: "Vendors Can't Edit Their Own Listings",
        description:
          "Suppliers on the marketplace cannot self-manage their profiles or add team members without contacting Planned support. This creates friction and dependency on Planned staff.",
        severity: "Medium",
        source: "SoftwareAdvice review",
      },
      {
        title: "Visual Presentation Needs Work",
        description:
          'A supplier-side user explicitly said "I think we can work on visual presentation!" — suggesting the UI/UX for how venues and proposals are displayed could be more polished or branded.',
        severity: "Low",
        source: "Capterra review (Alma)",
      },
    ],
  },
  {
    id: "gaps",
    label: "Feature Gaps vs. Competitors",
    icon: "🔍",
    color: "#3498DB",
    items: [
      {
        title: "No Native Mobile Event App for Attendees",
        description:
          "Competitors like Cvent, Whova, and Bizzabo offer branded mobile apps for attendees with schedules, maps, networking, and live engagement. Planned's attendee-facing experience is web-based only.",
        severity: "High",
        competitor: "Cvent, Whova, Bizzabo",
      },
      {
        title: "No Live Engagement Tools",
        description:
          "No live polling, Q&A, gamification, or real-time audience interaction features. Competitors like SpotMe, Bizzabo, and Cvent offer these as standard for in-person and hybrid events.",
        severity: "Medium",
        competitor: "SpotMe, Bizzabo, Cvent",
      },
      {
        title: "Limited Post-Event Analytics",
        description:
          "While Planned tracks spend and savings, it lacks deep attendee engagement scoring, session-level analytics, survey integration, and ROI attribution that enterprise competitors provide.",
        severity: "High",
        competitor: "Cvent, Bizzabo, Stova",
      },
      {
        title: "No Onsite Check-In / Badge Printing",
        description:
          "Planned is positioned as a sourcing-to-payment platform and lacks onsite execution tools like QR check-in, badge printing, RFID scanning, and lead retrieval that Cvent and Stova offer.",
        severity: "Medium",
        competitor: "Cvent, Stova",
      },
      {
        title: "No CRM or Marketing Automation Integration",
        description:
          "Without an API, Planned can't connect to Salesforce, HubSpot, Marketo, or other enterprise systems. Competitors offer native bi-directional sync for lead and contact data.",
        severity: "Critical",
        competitor: "Splash, Bizzabo, Cvent",
      },
      {
        title: "No Virtual/Hybrid Event Support",
        description:
          "Planned focuses exclusively on in-person events. No streaming, virtual venue, or hybrid-format capabilities exist on the platform.",
        severity: "Low",
        competitor: "Cvent, vFairs, Hopin",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects We Can Build",
    icon: "🛠️",
    color: "#27AE60",
    items: [
      {
        title: "1. Smart Contract Clause Analyzer",
        description:
          "Planned already flags key terms in contracts using AI. We can build a standalone tool that ingests venue/vendor contracts (PDF or text), extracts and categorizes clauses (cancellation, attrition, F&B minimums, force majeure, liability), compares them against industry benchmarks, and generates a plain-English risk summary with recommendations.",
        effort: "Medium (2-3 weeks)",
        tech: "Python, Claude API, PDF parsing (PyMuPDF), React dashboard",
        impact: "Directly enhances Planned's core differentiator",
      },
      {
        title: "2. Venue Recommendation Engine Prototype",
        description:
          "Build a conversational venue finder where a planner describes their event in natural language ('50-person leadership retreat near Austin, outdoor space, under $8k, mid-October') and gets ranked venue recommendations with pricing estimates, photo galleries, and availability indicators. Could pull from public venue data or mock Planned's 230k marketplace.",
        effort: "Medium (2-3 weeks)",
        tech: "Claude API, vector embeddings, React UI, geocoding API",
        impact: "Modernizes the sourcing flow — Planned's #1 feature",
      },
      {
        title: "3. Attendee Communication Hub",
        description:
          "Build a multi-channel communication dashboard that would solve the biggest user complaint. Features: threaded conversations per event, email + in-app messaging toggle, contract version tracking within threads, @mentions for team collaboration, and read receipts. This directly addresses the 'hard to communicate on the platform' pain point.",
        effort: "Large (4-6 weeks)",
        tech: "React, WebSocket/SSE, Node.js, email integration (SendGrid)",
        impact: "Solves the #1 user complaint across all review sites",
      },
      {
        title: "4. Event Budget Forecaster & Scenario Planner",
        description:
          "An interactive tool where planners input event parameters (headcount, city, event type, duration) and get AI-generated budget estimates broken down by category (venue, F&B, AV, travel, accommodation). Include a scenario comparison mode: 'What if we do Chicago vs. Miami?' or 'What if attendance drops 20%?' — with attrition cost modeling.",
        effort: "Medium (2-3 weeks)",
        tech: "React, Claude API, D3.js/Recharts for visualizations",
        impact: "New value-add feature Planned doesn't currently offer",
      },
      {
        title: "5. RFP Auto-Generator & Tracker",
        description:
          "A tool that takes a brief event description and generates a polished, standardized RFP document ready to send to venues. Include tracking: which venues opened it, who responded, response time analytics, and a comparison matrix of received proposals. Export to PDF or integrate with Planned's workflow.",
        effort: "Medium (3-4 weeks)",
        tech: "Claude API, React, PDF generation (jsPDF), email tracking pixels",
        impact: "Automates the most time-intensive planning task",
      },
      {
        title: "6. Supplier Onboarding Self-Service Portal",
        description:
          "A standalone portal where vendors can claim/create their listing, upload photos and 360° tours, set availability calendars, manage team member access, and update pricing — all without contacting Planned support. Directly addresses vendor-side friction from reviews.",
        effort: "Large (4-6 weeks)",
        tech: "React, Node.js, image upload/CDN, calendar component",
        impact: "Reduces support load, scales the marketplace",
      },
      {
        title: "7. Post-Event Feedback & Analytics Dashboard",
        description:
          "Build an automated post-event survey system that goes out to attendees after each event, collects NPS scores, satisfaction ratings by category (venue, food, AV, accommodations), and surfaces trends over time. Include AI-generated executive summaries comparing events quarter-over-quarter.",
        effort: "Small-Medium (2 weeks)",
        tech: "React, Claude API for summaries, Recharts, form builder",
        impact: "Fills a major gap vs. competitors like Cvent and Bizzabo",
      },
      {
        title: "8. API Middleware / Webhook Connector",
        description:
          "Since Planned has no API, build a middleware layer that could sit between Planned and enterprise systems. Even a proof-of-concept showing how event data could sync bidirectionally with Salesforce, SAP Concur, or Slack via webhooks would demonstrate the value of API investment to their product team.",
        effort: "Medium (3 weeks)",
        tech: "Node.js, Express, webhook handlers, OAuth flows, Zapier integration",
        impact: "Addresses the most critical enterprise gap",
      },
      {
        title: "9. AI Meeting Request Form (MRF) Assistant",
        description:
          "Planned already has MRF & approval flows. Build a smarter front-end where an employee can just describe what they need in plain language ('I need a room for 20 near our NYC office for a client dinner next Thursday') and the AI pre-fills the entire MRF, suggests policy-compliant options, and routes it for approval automatically.",
        effort: "Small (1-2 weeks)",
        tech: "Claude API, React form, JSON schema mapping",
        impact: "Makes MRFs effortless for non-professional planners",
      },
      {
        title: "10. Event ROI Calculator & Reporting Tool",
        description:
          "A standalone calculator where procurement teams input event costs, attendee data, and business outcomes (deals closed, leads generated, employee satisfaction scores) and get a computed ROI with visual breakdowns. Include benchmarking against industry averages and exportable executive reports.",
        effort: "Small-Medium (2 weeks)",
        tech: "React, Recharts/D3, PDF export, Claude API for narrative generation",
        impact: "Helps procurement justify event budgets with data",
      },
    ],
  },
  {
    id: "strategy",
    label: "Strategic Observations",
    icon: "🎯",
    color: "#9B59B6",
    items: [
      {
        title: "Positioned as Sourcing + Payment, Not Full Lifecycle",
        description:
          "Planned occupies a specific niche: vendor sourcing, contracting, payment, and compliance for corporate meetings. It's NOT trying to be a full event execution platform. This is both a strength (simplicity, focus) and a limitation (missing post-sourcing features). Industry analysts describe it as a 'vendor sourcing + financial control system.'",
      },
      {
        title: "AI Is Their Key Differentiator",
        description:
          "Planned's Head of AI (Nim Cheema) leads active AI implementation. Their AI reads contracts, auto-fills event briefs, matches suppliers, and extracts room block data. This is ahead of most competitors. Doubling down on AI capabilities is their clearest path to winning against Cvent.",
      },
      {
        title: "Target Market Is Shifting Up",
        description:
          "Originally targeting companies with 2,000+ employees, recent listings say 5,000+. This signals a push upmarket toward enterprise procurement teams — which makes API availability and CRM integration even more critical.",
      },
      {
        title: "Montréal HQ with $54.6M Raised",
        description:
          "71 employees, backed by Drive Capital, Outsiders Fund, and RBCx among 19 investors. The funding supports aggressive product development, but they're competing against Cvent (publicly traded, massive) with a fraction of the resources. Speed and UX quality are their advantages.",
      },
      {
        title: "The 'Non-Professional Planner' Angle Is Brilliant",
        description:
          "Planned explicitly targets occasional planners — executive assistants, marketing managers, team leads — who need to book events but aren't event professionals. This is a massive underserved market that Cvent's complexity actively alienates. Every project we build should keep this persona in mind.",
      },
    ],
  },
];

const severityStyle = {
  Critical: { background: "#0a0a0a", color: "#ffffff" },
  High:     { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  Medium:   { background: "#f0f0f0", color: "#555555", border: "1px solid #d0d0d0" },
  Low:      { background: "#f0f0f0", color: "#888888", border: "1px solid #d0d0d0" },
};

const effortStyle = {
  "Small (1-2 weeks)":     { background: "#0a0a0a", color: "#fff" },
  "Small-Medium (2 weeks)":{ background: "#0a0a0a", color: "#fff" },
  "Medium (2-3 weeks)":    { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  "Medium (3 weeks)":      { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  "Medium (3-4 weeks)":    { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  "Large (4-6 weeks)":     { background: "#e8e8e8", color: "#333", border: "1px solid #ccc" },
};

export default function PlannedAnalysis() {
  const [activeCategory, setActiveCategory] = useState("pain-points");
  const [expandedItem, setExpandedItem] = useState(null);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0a0a0a",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          padding: "32px 24px 24px",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ marginBottom: "16px" }}>
            <PlannedLogo />
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#0a0a0a",
              margin: "0 0 6px 0",
              lineHeight: 1.3,
              letterSpacing: "-0.3px",
            }}
          >
            Product Analysis
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Corporate event sourcing, contracting &amp; payment platform
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "12px",
            color: "#888",
            alignItems: "flex-end",
            paddingBottom: "2px",
          }}
        >
          <div><span style={{ display: "block", fontSize: "18px", fontWeight: 700, color: "#0a0a0a" }}>230K+</span>suppliers</div>
          <div><span style={{ display: "block", fontSize: "18px", fontWeight: 700, color: "#0a0a0a" }}>$54.6M</span>raised</div>
          <div><span style={{ display: "block", fontSize: "18px", fontWeight: 700, color: "#0a0a0a" }}>71</span>employees</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e8e8e8",
          overflowX: "auto",
          background: "#fafafa",
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedItem(null);
              }}
              style={{
                flex: "1 1 0",
                minWidth: "120px",
                padding: "14px 12px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #0a0a0a" : "2px solid transparent",
                color: isActive ? "#0a0a0a" : "#888",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
              <span
                style={{
                  display: "inline-block",
                  marginLeft: "6px",
                  fontSize: "11px",
                  color: isActive ? "#0a0a0a" : "#bbb",
                  fontWeight: 400,
                }}
              >
                {cat.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div style={{ padding: "16px 20px" }}>
        {currentCategory.items.map((item, i) => {
          const isExpanded = expandedItem === i;
          return (
            <div
              key={i}
              onClick={() => setExpandedItem(isExpanded ? null : i)}
              style={{
                background: isExpanded ? "#fafafa" : "#fff",
                border: "1px solid",
                borderColor: isExpanded ? "#d0d0d0" : "#e8e8e8",
                borderRadius: "8px",
                padding: "16px 18px",
                marginBottom: "8px",
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0a0a0a",
                      margin: "0 0 5px 0",
                      lineHeight: 1.4,
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {item.title}
                  </h3>
                  {!isExpanded && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        margin: 0,
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {item.severity && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "4px",
                        letterSpacing: "0.3px",
                        textTransform: "uppercase",
                        ...(severityStyle[item.severity] || severityStyle.Low),
                      }}
                    >
                      {item.severity}
                    </span>
                  )}
                  {item.effort && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "4px",
                        letterSpacing: "0.3px",
                        ...(effortStyle[item.effort] || effortStyle["Medium (2-3 weeks)"]),
                      }}
                    >
                      {item.effort}
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e8e8e8",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      margin: "0 0 14px 0",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "14px 24px",
                      fontSize: "12px",
                    }}
                  >
                    {item.source && (
                      <div>
                        <span style={{ color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px", fontWeight: 600 }}>Source</span>
                        <div style={{ color: "#555", marginTop: "2px" }}>{item.source}</div>
                      </div>
                    )}
                    {item.competitor && (
                      <div>
                        <span style={{ color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px", fontWeight: 600 }}>Competitors with this</span>
                        <div style={{ color: "#333", marginTop: "2px" }}>{item.competitor}</div>
                      </div>
                    )}
                    {item.tech && (
                      <div>
                        <span style={{ color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px", fontWeight: 600 }}>Tech stack</span>
                        <div style={{ color: "#333", marginTop: "2px" }}>{item.tech}</div>
                      </div>
                    )}
                    {item.impact && (
                      <div>
                        <span style={{ color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px", fontWeight: 600 }}>Impact</span>
                        <div style={{ color: "#333", fontWeight: 500, marginTop: "2px" }}>{item.impact}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommended Start Order */}
      {activeCategory === "projects" && (
        <div
          style={{
            margin: "0 20px 28px",
            padding: "20px 24px",
            background: "#fafafa",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#888",
              margin: "0 0 16px 0",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Recommended Start Order
          </h3>
          <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.7 }}>
            {[
              { week: "Week 1–2", project: "#9 AI Meeting Request Assistant", note: "Quickest win — showcases AI, directly helps non-professional planners" },
              { week: "Week 3–5", project: "#1 Smart Contract Analyzer", note: "Builds on Planned's existing AI capability, high value for procurement" },
              { week: "Week 5–7", project: "#4 Budget Forecaster", note: "Net-new feature competitors lack, great for demos and sales" },
              { week: "Week 7+",  project: "#3 Communication Hub", note: "Largest scope — solves the #1 pain point across all user reviews" },
            ].map(({ week, project, note }, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: i < 3 ? "12px" : 0, alignItems: "flex-start" }}>
                <span style={{ minWidth: "72px", fontSize: "11px", fontWeight: 600, color: "#0a0a0a", paddingTop: "1px", textTransform: "uppercase", letterSpacing: "0.3px" }}>{week}</span>
                <div>
                  <span style={{ fontWeight: 600, color: "#0a0a0a" }}>{project}</span>
                  <span style={{ color: "#888" }}> — {note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

