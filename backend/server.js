import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(routes);
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "API rodando."});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
