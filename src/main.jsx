import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import VendorListingDemo from "./demos/VendorListingDemo.jsx";
import WebhookConnectorDemo from "./demos/WebhookConnectorDemo.jsx";
import CommunicationHubDemo from "./demos/CommunicationHubDemo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/demo/vendor-listing" element={<VendorListingDemo />} />
        <Route path="/demo/webhook-connector" element={<WebhookConnectorDemo />} />
        <Route path="/demo/communication-hub" element={<CommunicationHubDemo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
