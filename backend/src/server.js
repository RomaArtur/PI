import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

connectDB();

app.use(helmet());

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

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log(`Endpoints disponíveis em: http://localhost:${PORT}/api`);
});

export default app;
