// utils/rankings.js
import Player from "../models/Player.js";

const calculateRankings = async () => {
    try {
        const players = await Player.find();

        // Calculate batting rankings
        const sortedByBatting = [...players].sort((a, b) => b.batting.runs - a.batting.runs);
        sortedByBatting.forEach((player, index) => {
            player.battingRank = index + 1; // Update top-level batting rank
        });

        // Calculate bowling rankings
        const sortedByBowling = [...players].sort((a, b) => b.bowling.wickets - a.bowling.wickets);
        sortedByBowling.forEach((player, index) => {
            player.bowlingRank = index + 1; // Update top-level bowling rank
        });

        // Calculate all-rounder rankings
        const sortedByAllRounder = [...players].sort((a, b) => {
            const aScore = a.batting.runs + a.bowling.wickets * 20 + a.fielding.catches * 10 + a.fielding.runOuts * 20 + a.fielding.stumpings * 15;
            const bScore = b.batting.runs + b.bowling.wickets * 20 + b.fielding.catches * 10 + b.fielding.runOuts * 20 + b.fielding.stumpings * 15;
            return bScore - aScore;
        });
        sortedByAllRounder.forEach((player, index) => {
            player.allRounderRank = index + 1; // Update top-level all-rounder rank
        });

        // Save updated rankings to the database
        await Promise.all(players.map((player) => player.save()));

        console.log("Rankings updated successfully");
    } catch (err) {
        console.error("Error updating rankings:", err);
    }
};

export default calculateRankings;
