import express from "express";
import { createMatch, updateMatch, deleteMatch, getMatch, getMatches,getMatchesByClub } from "../controllers/match.js";
import { verifyAdmin,verifyClubAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/by-club/:clubId", getMatchesByClub);
router.post("/",createMatch);      
router.put("/:id", updateMatch);     
router.delete("/:id", deleteMatch);  
router.get("/:id", getMatch);        
router.get("/", getMatches);         

export default router;
