import express from "express";
import { createPlayer, 
        updatePlayer, 
        deletePlayer, 
        getPlayer, 
        getPlayers, 
        getPlayersByClub 
    } from "../controllers/player.js";

const router = express.Router();

// Create a new player
router.post("/", createPlayer);

// Get players by club ID (using query parameter)
router.get('/by-club/:clubId', getPlayersByClub);

// Update an existing player by ID
router.put("/:id", updatePlayer);

// Delete a player by ID
router.delete("/:id", deletePlayer);

// Get a player by ID
router.get("/:id", getPlayer);

// Get all players
router.get("/", getPlayers);



export default router;
