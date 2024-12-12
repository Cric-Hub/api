import express from "express";
import { createClub, updateClub, deleteClub, getClub, getClubs } from "../controllers/club.js";

const router = express.Router();

router.post("/", createClub);
router.put("/:id", updateClub);
router.delete("/:id", deleteClub);
router.get("/:id", getClub);
router.get("/", getClubs);

export default router;
