import express from "express";
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../controllers/note.controller.js";

const router = express.Router();

router.get("/board/:boardId", getAllNotes);
router.get("/:id", getNote);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;