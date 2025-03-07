import express from "express"
import { getUsers, deleteUser, getUser, updateUser } from "../controllers/user.js"
import { verifyToken, verifyAdmin,verifyClubAdmin } from "../utils/verifyToken.js"



const router = express.Router()

//UPDATE
router.put("/:id",updateUser)

//DELETE
router.delete("/:id", verifyAdmin, deleteUser)

//GET
router.get("/:id", getUser)

//GET ALL
router.get("/", getUsers)

export default router