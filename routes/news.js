import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/News.js";
import { verifyToken, verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/",verifyAdmin, createNews); // Create news
router.get("/", getAllNews); // Get all news
router.get("/:id", getNewsById); // Get news by ID
router.put("/:id",verifyAdmin, updateNews); // Update news
router.delete("/:id",verifyAdmin, deleteNews); // Delete news

export default router;
