import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { login, register } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateUser, (req, res) => {
  res.json(req.user);
});

export default router;
