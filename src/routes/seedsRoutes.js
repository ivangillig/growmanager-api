import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getAllSeeds, createSeed } from "../controllers/seedsController.js";

const router = Router();

router.get("/", authenticateUser, getAllSeeds);
router.post("/", authenticateUser, createSeed);

export default router;
