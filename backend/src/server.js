import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());
app.use("/api", routes);

app.use(cors());
app.use(helmet());
app.use(routes);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor escutando em: http://localhost:${PORT}`);
});
