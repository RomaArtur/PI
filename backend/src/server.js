import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(helmet({ crossOriginResourcePolicy: false }));

const whitelist = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5173",
  "https://pi-three-mauve.vercel.app",
  "https://stylodesigner.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acesso bloqueado por CORS."));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.IP || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em: http://${HOST}:${PORT}`);
  console.log(`Endpoints disponíveis em: http://${HOST}:${PORT}/api`);
});

server.on("error", (error) => {
  console.error("Erro crítico no servidor HTTP:", error);
});

process.on("uncaughtException", (err) => {
  console.error("Exceção não tratada (uncaughtException):", err);
});
