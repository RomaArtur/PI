import express from "express";
import MediaController from "../controllers/MediaController.js";
import { checarAutenticacao } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploads.js";

const router = express.Router();

router.get("/", checarAutenticacao, MediaController.listar);
router.post(
  "/",
  checarAutenticacao,
  (req, res, next) => upload.array("imagens", 12)(req, res, next),
  MediaController.upload,
);
router.delete("/:id", checarAutenticacao, MediaController.excluir);

export default router;
