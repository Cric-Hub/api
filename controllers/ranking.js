import  calculateRankings  from "../utils/ranking.js";

export const updateRankings = async (req, res, next) => {
    try {
    await calculateRankings();
    res.status(200).json({ message: "Rankings updated successfully" });
} catch (err) {
    res.status(500).json({ message: "Error updating rankings", error: err.message });
}}
