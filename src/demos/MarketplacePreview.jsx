const fmt = (cents) => "$" + Number(cents).toLocaleString("en-US");

function AvatarStack({ team }) {
  if (!team || team.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: "0", marginTop: "16px" }}>
      {team.map((m, i) => (
        <div
          key={m.id || i}
          title={`${m.name} (${m.role})`}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: m.role === "Owner" ? "#0a0a0a" : "#e0e0e0",
            color: m.role === "Owner" ? "#fff" : "#555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            border: "2px solid #fff",
            marginLeft: i > 0 ? "-8px" : "0",
            position: "relative",
            zIndex: team.length - i,
          }}
        >
          {m.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>
      ))}
      <span
        style={{
          marginLeft: "10px",
          fontSize: "12px",
          color: "#888",
          alignSelf: "center",
        }}
      >
        {team.length} team member{team.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

export default function MarketplacePreview({ vendor }) {
  const hasImage = vendor.hero_image_url && vendor.hero_image_url.trim();

  return (
    <div
      style={{
        padding: "32px 28px",
        overflowY: "auto",
        height: "100%",
        background: "#f7f7f7",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "20px",
        }}
      >
        Marketplace Preview
      </div>

      {/* Listing card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Hero image */}
        <div
          style={{
            width: "100%",
            height: "200px",
            background: hasImage ? `url(${vendor.hero_image_url}) center/cover` : "#e8e8e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!hasImage && (
            <span style={{ color: "#bbb", fontSize: "13px" }}>No image</span>
          )}
        </div>

        <div style={{ padding: "24px" }}>
          {/* Name + location */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0a0a0a",
              margin: "0 0 6px 0",
              lineHeight: 1.3,
              letterSpacing: "-0.3px",
            }}
          >
            {vendor.name || "Untitled Venue"}
          </h2>

          {vendor.tagline && (
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                margin: "0 0 10px 0",
                fontStyle: "italic",
              }}
            >
              {vendor.tagline}
            </p>
          )}

          {vendor.location && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                color: "#888",
                background: "#f5f5f5",
                padding: "4px 10px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "14px" }}>&#x1f4cd;</span>
              {vendor.location}
            </div>
          )}

          {/* Description excerpt */}
          {vendor.description && (
            <p
              style={{
                fontSize: "13px",
                color: "#555",
                lineHeight: 1.65,
                margin: "0 0 20px 0",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {vendor.description}
            </p>
          )}

          {/* Pricing highlights */}
          {vendor.pricing && vendor.pricing.length > 0 && (
            <div style={{ marginBottom: "4px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#aaa",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "10px",
                }}
              >
                Pricing
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {vendor.pricing.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: "8px 14px",
                      background: "#fafafa",
                      borderRadius: "6px",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        marginBottom: "2px",
                      }}
                    >
                      {p.label}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#0a0a0a",
                      }}
                    >
                      {fmt(p.price)}
                    </div>
                  </div>
                ))}
              </div>
              {vendor.pricing.length > 3 && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#aaa",
                    marginTop: "6px",
                  }}
                >
                  +{vendor.pricing.length - 3} more package
                  {vendor.pricing.length - 3 !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Team */}
          <AvatarStack team={vendor.team || []} />
        </div>
      </div>
    </div>
  );
}
