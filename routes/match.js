import express from "express";
import { createMatch, updateMatch, deleteMatch, getMatch, getMatches } from "../controllers/match.js";

const router = express.Router();

router.post("/", createMatch);        // Create a match
router.put("/:id", updateMatch);     // Update a match
router.delete("/:id", deleteMatch);  // Delete a match
router.get("/:id", getMatch);        // Get a specific match
router.get("/", getMatches);         // Get all matches

export default router;
