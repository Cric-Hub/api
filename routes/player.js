import express from "express";
import { createPlayer, 
        updatePlayer, 
        deletePlayer, 
        getPlayer, 
        getPlayers, 
        getPlayersByClub ,
        filterPlayers,
    } from "../controllers/player.js";
import {verifyClubAdmin,verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Create a new player
router.post("/", createPlayer);

// Get players by club ID (using query parameter)
router.get('/by-club/:clubId', getPlayersByClub);

// Update an existing player by ID
router.put("/:id",verifyClubAdmin, updatePlayer);

// Delete a player by ID
router.delete("/:id", deletePlayer);

// Get a player by ID
router.get("/:id", getPlayer);

// Get all players
router.get("/", getPlayers);

router.get('/filter', filterPlayers);



export default router;
