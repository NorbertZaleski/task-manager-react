import express from "express";
import { createUser, deleteUser, getAllUser, getUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;