import express from "express";
import { createClub, updateClub, deleteClub, getClub, getClubs } from "../controllers/club.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyAdmin,createClub);
router.put("/:id",verifyUser, updateClub);
router.delete("/:id",verifyAdmin, deleteClub);
router.get("/:id", getClub);
router.get("/", getClubs);

export default router;
