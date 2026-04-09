import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve to repo root: backend/src -> backend -> (repo root)
const DEBUG_LOG_PATH = path.resolve(__dirname, "../..", "debug-5768e2.log");
const AGENT_DEBUG_ENABLED = process.env.ENABLE_AGENT_DEBUG === "true";

const app = express();

connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const whitelist = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Acesso bloqueado."));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Debug log sink (fallback if collector fetch fails)
app.post("/__agent_log", (req, res) => {
  if (!AGENT_DEBUG_ENABLED) {
    return res.status(204).end();
  }

  try {
    const payload = {
      ...req.body,
      sessionId: "5768e2",
      timestamp: Date.now(),
    };
    fs.appendFileSync(DEBUG_LOG_PATH, `${JSON.stringify(payload)}\n`, "utf8");
  } catch (e) {
    console.error("agent log write failed:", e?.message || e);
  }
  res.status(204).end();
});

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.IP || "0.0.0.0";

app.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em: http://${HOST}:${PORT}`);
      console.log(`Endpoints disponíveis em: http://${HOST}:${PORT}/api`);
});

export default app;
