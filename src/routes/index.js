import { Router } from "express";
import authRoutes from "./auth.routes.js";
import seedsRoutes from "./seedsRoutes.js";

const router = Router();

// API health check route
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
router.use("/auth", authRoutes);
router.use("/seeds", seedsRoutes);

export default router;
