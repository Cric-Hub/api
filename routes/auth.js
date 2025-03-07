import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth.js";
import { verifyToken, verifyAdmin} from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register",verifyAdmin, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token" ,resetPassword);
router.put("/change-password/:id", changePassword);

export default router;
