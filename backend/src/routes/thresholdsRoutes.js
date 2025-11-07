// Di dalam file backend/src/routes/thresholdsRoutes.js

import express from "express";
import { ThresholdsController } from "../controllers/thresholdsController.js";

const router = express.Router();

router.get("/", ThresholdsController.list);
router.post("/", ThresholdsController.create);
router.get("/latest", ThresholdsController.latest);
router.delete("/", ThresholdsController.deleteAll); // TAMBAHKAN BARIS INI

export default router;