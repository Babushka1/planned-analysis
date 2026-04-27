import express from "express";
import cors from "cors";
import vendorRoutes from "./routes/vendors.js";
import webhookRoutes from "./routes/webhooks.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/vendors", vendorRoutes);
app.use("/api/webhooks", webhookRoutes);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
