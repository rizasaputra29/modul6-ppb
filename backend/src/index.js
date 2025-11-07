import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import readingsRoutes from "./routes/readingsRoutes.js";
import thresholdsRoutes from "./routes/thresholdsRoutes.js";

dotenv.config();

const app = express();

// ✅ Allow all origins (for local development)
app.use(
  cors({
    origin: "*", // atau tulis domain spesifik jika nanti di-deploy
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/readings", readingsRoutes);
app.use("/api/thresholds", thresholdsRoutes);

// ✅ Listen on all network interfaces
const port = process.env.PORT || 5050;
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Backend server running on port ${port}`);
});