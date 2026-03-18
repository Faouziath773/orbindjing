import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import registerRoutes from "./routes/register.js";
import webhookRoutes from "./routes/webhook.js";
import adminRoutes from "./routes/admin.js";
import { getDb } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "..", ".env"), override: true });

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.APP_BASE_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false,
  })
);

app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get("/api/health", async (_req, res) => {
  await getDb();
  res.json({ status: "ok" });
});

app.use("/api", registerRoutes);
app.use("/api", webhookRoutes);
app.use("/api", adminRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
