import express from "express";
import leads from "./leadRoutes.js";
import vendedores from "./vendedorRoutes.js";

const router = express.Router();
{
  router.get("/", (req, res) => {
    res.status(200).send({ mensagem: "Bem-vindo à API" });
  });

  router.use("/leads", leads);
  router.use("/vendedores", vendedores);
}

export default router;
