import express from "express";
import leads from "./leadRoutes.js";
import login from "./authRoutes.js";
import vendedores from "./vendedorRoutes.js";
import produtos from "./produtoRoutes.js";

const router = express.Router();
{
  router.get("/", (req, res) => {
    res.status(200).send({ mensagem: "Bem-vindo à API" });
  });

  router.use("/leads", leads);
  router.use("/vendedores", vendedores);
  router.use("/produtos", produtos);
  router.use("/login", login);
}

export default router;
