import express from "express";
import { createUser, deleteUser, getAllUser, getUser, searchUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/", getAllUser);
router.get("/:id", getUser);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;