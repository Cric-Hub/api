import express from "express";
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/News.js";
import { verifyAdmin, verifyClubAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/",verifyAdmin, createNews); 
router.get("/", getAllNews); 
router.get("/:id", getNewsById); 
router.put("/:id",verifyAdmin, updateNews); 
router.delete("/:id",verifyAdmin, deleteNews); 

export default router;
