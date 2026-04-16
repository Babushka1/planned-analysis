import express from "express";
import cors from "cors";
import vendorRoutes from "./routes/vendors.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/vendors", vendorRoutes);

app.listen(PORT, () => {
  console.log(`Vendor API running on http://localhost:${PORT}`);
});
