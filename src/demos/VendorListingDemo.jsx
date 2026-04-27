import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import VendorEditor from "./VendorEditor";
import MarketplacePreview from "./MarketplacePreview";

const API = "http://localhost:3001/api/vendors/1";

export default function VendorListingDemo() {
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);

  const fetchVendor = useCallback(async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to load vendor");
      setVendor(await res.json());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

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
        <div style={{ fontSize: "15px" }}>
          Could not connect to the API server.
        </div>
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

  if (!vendor) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', -apple-system, sans-serif",
          color: "#aaa",
          fontSize: "14px",
        }}
      >
        Loading vendor data...
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
        background: "#fff",
      }}
    >
      {/* Header bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "52px",
          borderBottom: "1px solid #e8e8e8",
          flexShrink: 0,
          background: "#fafafa",
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
        <div style={{ display: "flex", gap: "0" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#0a0a0a",
              padding: "6px 16px",
              background: "#fff",
              borderRadius: "6px 0 0 6px",
              border: "1px solid #e0e0e0",
            }}
          >
            Vendor Portal
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#888",
              padding: "6px 16px",
              background: "#f5f5f5",
              borderRadius: "0 6px 6px 0",
              border: "1px solid #e0e0e0",
              borderLeft: "none",
            }}
          >
            Live Preview
          </div>
        </div>
        <div style={{ width: "120px" }} /> {/* spacer for centering */}
      </header>

      {/* Split panels */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left — Editor */}
        <div
          style={{
            flex: "1 1 50%",
            borderRight: "1px solid #e8e8e8",
            overflow: "hidden",
          }}
        >
          <VendorEditor
            vendor={vendor}
            onVendorChange={setVendor}
            onRefresh={fetchVendor}
          />
        </div>

        {/* Right — Preview */}
        <div style={{ flex: "1 1 50%", overflow: "hidden" }}>
          <MarketplacePreview vendor={vendor} />
        </div>
      </div>
    </div>
  );
}
