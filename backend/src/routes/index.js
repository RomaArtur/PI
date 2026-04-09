import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import leads from "./leadRoutes.js";
import login from "./authRoutes.js";
import vendedores from "./vendedorRoutes.js";
import produtos from "./produtoRoutes.js";

const router = express.Router();
{
  router.get("/", (req, res) => {
    res.status(200).send({ mensagem: "Bem-vindo à API" });
  });

  router.get("/health", (req, res) => {
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const uploadsOk = fs.existsSync(uploadsDir);
    res.status(200).json({
      ok: true,
      mongo: {
        readyState: mongoose.connection?.readyState ?? null,
      },
      uploads: {
        dir: uploadsDir,
        exists: uploadsOk,
      },
      uptimeSec: Math.round(process.uptime()),
      timestamp: Date.now(),
    });
  });

  router.use("/leads", leads);
  router.use("/vendedores", vendedores);
  router.use("/produtos", produtos);
  router.use("/login", login);
}

export default router;
