import express from "express";
import { ThresholdsController } from "../controllers/thresholdsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (Monitoring bisa diakses siapa saja/guest)
router.get("/", ThresholdsController.list);
router.get("/latest", ThresholdsController.latest);

// Protected Routes (Hanya user login yang bisa ubah/hapus)
router.post("/", requireAuth, ThresholdsController.create);
router.delete("/", requireAuth, ThresholdsController.deleteAll);

export default router;