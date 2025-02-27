import express from "express";
import { updateRankings } from "../controllers/ranking.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/update-rankings", updateRankings);

export default router;