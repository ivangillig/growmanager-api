import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getAllSeeds } from "../controllers/seedsController.js";

const router = Router();

router.get("/", authenticateUser, getAllSeeds);

export default router;
