import express from "express";
import leads from "./leadRoutes.js";

const router = express.Router();
{
  router.get("/", (req, res) => {
    res.status(200).send({ mensagem: "Bem-vindo à API" });
  });

  router.use("/leads", leads);
}

export default router;
