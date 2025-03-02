import express from "express";
import { createMatch, updateMatch, deleteMatch, getMatch, getMatches,getMatchesByClub } from "../controllers/match.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/by-club/:clubId", getMatchesByClub);
router.post("/",createMatch);        // Create a match
router.put("/:id", updateMatch);     // Update a match
router.delete("/:id", deleteMatch);  // Delete a match
router.get("/:id", getMatch);        // Get a specific match
router.get("/", getMatches);         // Get all matches

export default router;
