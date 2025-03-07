import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticateUser, (req, res) => {
  res.json(req.user);
});

export default router;
