import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import plannedLogo from "./assets/planned.png";

// ─── Data (unchanged) ─────────────────────────────────────────────────────────
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
        source: "Capterra reviews (Madison B., Hugo M.)",
        sourceUrl: "https://www.capterra.com/p/234623/Planned/reviews/",
      },
      {
        title: "Document Sharing UX Is Broken",
        description:
          "Users find it challenging to send and receive documents through the inbox/messaging feature. Planned's own team acknowledged this in review responses, saying they're working on a fix.",
        severity: "High",
        source: "Capterra review (Greg B.)",
        sourceUrl: "https://www.capterra.com/p/234623/Planned/reviews/",
      },
      {
        title: "No Public API Available",
        description:
          "GetApp confirms Planned does not offer an API. This blocks integrations with CRMs (Salesforce, HubSpot), travel management tools, expense systems, and custom enterprise workflows — a dealbreaker for large organizations.",
        severity: "Critical",
        source: "GetApp listing",
        sourceUrl: "https://www.getapp.com/collaboration-software/a/planned/",
      },
      {
        title: "Vendor Response Delays",
        description:
          "During beta/rollout periods, users had to contact their Planned rep manually to get vendor replies. The automated vendor outreach pipeline has reliability gaps.",
        severity: "Medium",
        source: "Capterra review (Robert B.)",
        sourceUrl: "https://www.capterra.com/p/234623/Planned/reviews/",
      },
      {
        title: "Vendors Can't Edit Their Own Listings",
        description:
          "Suppliers on the marketplace cannot self-manage their profiles or add team members without contacting Planned support. This creates friction and dependency on Planned staff.",
        severity: "Medium",
        source: "Capterra review (Hugo M.)",
        sourceUrl: "https://www.capterra.com/p/234623/Planned/reviews/",
      },
      {
        title: "Visual Presentation Needs Work",
        description:
          'A supplier-side user explicitly said "I think we can work on visual presentation!" — suggesting the UI/UX for how venues and proposals are displayed could be more polished or branded.',
        severity: "Low",
        source: "Capterra review (Alma G.)",
        sourceUrl: "https://www.capterra.com/p/234623/Planned/reviews/",
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
  "Small (1-2 weeks)":      { background: "#0a0a0a", color: "#fff" },
  "Small-Medium (2 weeks)": { background: "#0a0a0a", color: "#fff" },
  "Medium (2-3 weeks)":     { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  "Medium (3 weeks)":       { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  "Medium (3-4 weeks)":     { background: "#f0f0f0", color: "#0a0a0a", border: "1px solid #d0d0d0" },
  "Large (4-6 weeks)":      { background: "#e8e8e8", color: "#333", border: "1px solid #ccc" },
};

// ─── Narrative metadata (section intros + transition quotes) ──────────────────
const NARRATIVE = [
  {
    id: "pain-points",
    label: "User Pain Points",
    headline: "Here's what's broken.",
    intro:
      "Event planners working with Planned have flagged recurring friction across communication, integrations, and vendor management. These aren't edge cases — they're the platform's most-requested fixes.",
    pullQuoteBefore: null,
  },
  {
    id: "gaps",
    label: "Feature Gaps vs. Competitors",
    headline: "Here's where they're falling behind.",
    intro:
      "Planned's core competitors — Cvent, Bizzabo, Stova — offer capabilities that Planned is missing. Some gaps are by design for a focused sourcing platform. Others are real enterprise blockers.",
    pullQuoteBefore:
      "So what do these pain points look like against the competitive landscape?",
  },
  {
    id: "strategy",
    label: "Strategic Observations",
    headline: "Here's the context behind those gaps.",
    intro:
      "Understanding Planned's strategic position explains both the gaps and the opportunities. They're not trying to beat Cvent — they're trying to make Cvent irrelevant for a specific buyer.",
    pullQuoteBefore:
      "These gaps don't exist in a vacuum. Planned is making deliberate bets.",
  },
  {
    id: "projects",
    label: "Projects We Can Build",
    headline: "Here's how we solve it.",
    intro:
      "Given the pain points, the competitive gaps, and Planned's strategic focus on the non-professional planner, these are the highest-leverage builds — ordered by effort and impact.",
    pullQuoteBefore:
      "The non-professional planner is the unlock. Every project should make their job easier.",
  },
];

// ─── Squiggly wave path ────────────────────────────────────────────────────────
const buildWavePath = (segments = 24) => {
  let d = "M 0 20 Q 25 0, 50 20";
  for (let i = 1; i <= segments; i++) {
    d += ` T ${50 + i * 50} 20`;
  }
  return d;
};
const WAVE_PATH = buildWavePath(24); // 0 → 1250px

// ─── Hooks ─────────────────────────────────────────────────────────────────────
const PRM =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  // If user prefers reduced motion, start as visible — no animation
  const [inView, setInView] = useState(PRM);

  useEffect(() => {
    if (PRM) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // fire once only
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ─── Squiggly Divider ─────────────────────────────────────────────────────────
function SquigglyDivider({ color = "#e8e8e8", py = 40, strokeWidth = 2.5 }) {
  const [ref, inView] = useInView(0.05);
  return (
    <div ref={ref} style={{ padding: `${py}px 0`, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1250 40"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "28px", display: "block" }}
        aria-hidden="true"
      >
        <path
          d={WAVE_PATH}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          pathLength="1"
          style={{
            strokeDasharray: "1",
            strokeDashoffset: inView ? "0" : "1",
            transition: PRM
              ? "none"
              : "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>
    </div>
  );
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────
function PullQuote({ text }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      style={{
        background: "#fafafa",
        borderTop: "1px solid #f0f0f0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 72px) 40px",
          textAlign: "center",
          opacity: inView ? 1 : 0,
          transform: inView
            ? "scale(1) translateY(0)"
            : "scale(0.97) translateY(14px)",
          transition: PRM
            ? "none"
            : "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <p
          style={{
            fontSize: "clamp(17px, 2vw, 22px)",
            fontWeight: 400,
            color: "#555",
            lineHeight: 1.65,
            margin: 0,
            fontStyle: "italic",
            letterSpacing: "-0.2px",
          }}
        >
          &ldquo;{text}&rdquo;
        </p>
      </div>
    </div>
  );
}

// Demo links for specific project cards
const DEMO_LINKS = {
  "6. Supplier Onboarding Self-Service Portal": "/demo/vendor-listing",
  "8. API Middleware / Webhook Connector": "/demo/webhook-connector",
};

// ─── Item Card (always expanded) ──────────────────────────────────────────────
function ItemCard({ item, index, color }) {
  const demoLink = DEMO_LINKS[item.title];
  const [ref, inView] = useInView(0.08);
  const delay = PRM ? 0 : Math.min(index, 7) * 80;

  return (
    <div
      ref={ref}
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderLeft: `3px solid ${color}`,
        borderRadius: "10px",
        padding: "22px 22px 20px 20px",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: PRM
          ? "none"
          : `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {/* Tags row */}
      {(item.severity || item.effort) && (
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "12px",
          }}
        >
          {item.severity && (
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.4px",
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
                ...(effortStyle[item.effort] ||
                  effortStyle["Medium (2-3 weeks)"]),
              }}
            >
              {item.effort}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#0a0a0a",
          margin: "0 0 10px 0",
          lineHeight: 1.4,
          letterSpacing: "-0.1px",
        }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: "#555",
          margin: "0",
          lineHeight: 1.65,
        }}
      >
        {item.description}
      </p>

      {/* Metadata footer */}
      {(item.source || item.competitor || item.tech || item.impact) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 20px",
            marginTop: "16px",
            paddingTop: "14px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          {item.source && (
            <div>
              <div
                style={{
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "10px",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                Source
              </div>
              {item.sourceUrl ? (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#555", fontSize: "12px", textDecoration: "underline", textUnderlineOffset: "2px" }}
                >
                  {item.source}
                </a>
              ) : (
                <div style={{ color: "#555", fontSize: "12px" }}>
                  {item.source}
                </div>
              )}
            </div>
          )}
          {item.competitor && (
            <div>
              <div
                style={{
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "10px",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                Competitors with this
              </div>
              <div style={{ color: "#333", fontSize: "12px" }}>
                {item.competitor}
              </div>
            </div>
          )}
          {item.tech && (
            <div>
              <div
                style={{
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "10px",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                Tech stack
              </div>
              <div style={{ color: "#333", fontSize: "12px" }}>{item.tech}</div>
            </div>
          )}
          {item.impact && (
            <div>
              <div
                style={{
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontSize: "10px",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                Impact
              </div>
              <div style={{ color: "#333", fontSize: "12px", fontWeight: 500 }}>
                {item.impact}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demo link */}
      {demoLink && (
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f0f0f0" }}>
          <Link
            to={demoLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
              color: color,
              textDecoration: "none",
            }}
          >
            See the demo &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Narrative Section ────────────────────────────────────────────────────────
function NarrativeSection({ narrative, category }) {
  const [headingRef, headingInView] = useInView(0.15);

  return (
    <section
      id={category.id}
      style={{ background: "#fff", borderTop: "1px solid #f0f0f0" }}
    >
      <div className="section-inner">
        <div
          ref={headingRef}
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? "translateY(0)" : "translateY(32px)",
            transition: PRM
              ? "none"
              : "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: category.color,
              marginBottom: "14px",
            }}
          >
            {narrative.label}
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4.5vw, 52px)",
              fontWeight: 700,
              color: "#0a0a0a",
              margin: "0 0 20px 0",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
            }}
          >
            {narrative.headline}
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.5vw, 17px)",
              color: "#666",
              maxWidth: "640px",
              lineHeight: 1.7,
              letterSpacing: "-0.1px",
            }}
          >
            {narrative.intro}
          </p>
        </div>

        <div className="card-grid">
          {category.items.map((item, i) => (
            <ItemCard key={i} item={item} index={i} color={category.color} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (PRM) return;
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const parallax = PRM ? 0 : scrollY * 0.22;

  return (
    <section
      style={{
        position: "relative",
        background: "#0a0a0a",
        overflow: "hidden",
        minHeight: "72vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Parallax background squiggle */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -4,
          left: 0,
          right: 0,
          transform: `translateY(${parallax}px)`,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1250 40"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "64px", display: "block" }}
        >
          <path
            d={WAVE_PATH}
            stroke="#ffffff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Second offset squiggle for depth */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          transform: `translateY(${parallax * 0.6}px)`,
          opacity: 0.05,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1250 40"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "48px", display: "block" }}
        >
          <path
            d={WAVE_PATH}
            stroke="#ffffff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(72px, 10vw, 120px) 48px clamp(72px, 8vw, 100px)",
          width: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "44px" }}>
          <img
            src={plannedLogo}
            alt="Planned"
            style={{
              height: "48px",
              display: "block",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "20px",
          }}
        >
          Product Deep Dive
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(40px, 7.5vw, 88px)",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 24px 0",
            lineHeight: 1.02,
            letterSpacing: "-2.5px",
            maxWidth: "820px",
          }}
        >
          Planned.com Analysis
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 64px 0",
            maxWidth: "560px",
            lineHeight: 1.6,
            letterSpacing: "-0.2px",
          }}
        >
          A corporate event sourcing and payment platform — here&rsquo;s where
          it excels, where it falls short, and how to build what&rsquo;s
          missing.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "clamp(28px, 5vw, 64px)",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "230K+", label: "suppliers" },
            { value: "$54.6M", label: "raised" },
            { value: "71", label: "employees" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: "clamp(22px, 3vw, 34px)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-0.5px",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: "7px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing Section ──────────────────────────────────────────────────────────
function ClosingSection() {
  const [headingRef, headingInView] = useInView(0.1);

  const startOrder = [
    {
      week: "Week 1–2",
      project: "#9 AI Meeting Request Assistant",
      note: "Quickest win — showcases AI, directly helps non-professional planners",
    },
    {
      week: "Week 3–5",
      project: "#1 Smart Contract Analyzer",
      note: "Builds on Planned's existing AI capability, high value for procurement",
    },
    {
      week: "Week 5–7",
      project: "#4 Budget Forecaster",
      note: "Net-new feature competitors lack, great for demos and sales",
    },
    {
      week: "Week 7+",
      project: "#3 Communication Hub",
      note: "Largest scope — solves the #1 pain point across all user reviews",
    },
  ];

  return (
    <section style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0" }}>
      <div className="section-inner">
        <div
          ref={headingRef}
          style={{
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? "translateY(0)" : "translateY(28px)",
            transition: PRM
              ? "none"
              : "opacity 0.65s ease, transform 0.65s ease",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#27AE60",
              marginBottom: "14px",
            }}
          >
            Recommended Start Order
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 3.5vw, 44px)",
              fontWeight: 700,
              color: "#0a0a0a",
              margin: "0 0 48px 0",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            Where to start.
          </h2>
        </div>

        <div>
          {startOrder.map(({ week, project, note }, i) => {
            return (
              <ClosingRow
                key={i}
                week={week}
                project={project}
                note={note}
                index={i}
                parentInView={headingInView}
                isFirst={i === 0}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClosingRow({ week, project, note, index, parentInView, isFirst }) {
  const delay = PRM ? 0 : 300 + index * 100;
  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(16px, 3vw, 32px)",
        padding: "24px 0",
        borderTop: isFirst ? "2px solid #0a0a0a" : "1px solid #e8e8e8",
        alignItems: "flex-start",
        opacity: parentInView ? 1 : 0,
        transform: parentInView ? "translateY(0)" : "translateY(16px)",
        transition: PRM
          ? "none"
          : `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          minWidth: "80px",
          fontSize: "10px",
          fontWeight: 700,
          color: "#0a0a0a",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          paddingTop: "3px",
        }}
      >
        {week}
      </div>
      <div>
        <div
          style={{
            fontWeight: 600,
            color: "#0a0a0a",
            fontSize: "15px",
            marginBottom: "5px",
          }}
        >
          {project}
        </div>
        <div style={{ color: "#888", fontSize: "13px", lineHeight: 1.55 }}>
          {note}
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const [ref, inView] = useInView(0.1);
  return (
    <footer
      style={{
        background: "#0a0a0a",
        overflow: "hidden",
        paddingTop: "48px",
      }}
    >
      {/* Squiggle decoration */}
      <div
        ref={ref}
        style={{ paddingBottom: "0", overflow: "hidden" }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1250 40"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "28px", display: "block" }}
        >
          <path
            d={WAVE_PATH}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            pathLength="1"
            style={{
              strokeDasharray: "1",
              strokeDashoffset: inView ? "0" : "1",
              transition: PRM
                ? "none"
                : "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </svg>
      </div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 48px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <img
          src={plannedLogo}
          alt="Planned"
          style={{
            height: "28px",
            filter: "brightness(0) invert(1)",
            opacity: 0.5,
          }}
        />
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            margin: 0,
            letterSpacing: "0.3px",
          }}
        >
          Product Analysis · 2025
        </p>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function PlannedAnalysis() {
  return (
    <div
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <HeroSection />

      {NARRATIVE.map((narrative) => {
        const category = categories.find((c) => c.id === narrative.id);
        return (
          <div key={narrative.id}>
            {narrative.pullQuoteBefore && (
              <PullQuote text={narrative.pullQuoteBefore} />
            )}
            <SquigglyDivider color={category.color} py={0} />
            <NarrativeSection narrative={narrative} category={category} />
          </div>
        );
      })}

      <SquigglyDivider color="#27AE60" py={0} />
      <ClosingSection />
      <Footer />
    </div>
  );
}
