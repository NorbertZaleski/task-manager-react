import express from "express";
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../controllers/note.controller.js";
import { requireNoteAccess } from "../middleware/boardAccess.js";

const router = express.Router();

router.get("/board/:boardId", getAllNotes);
router.get("/:id", getNote);

router.post("/columns/:columnId/notes", createNote);

router.patch("/:id", requireNoteAccess("member"), updateNote);

router.delete("/:id", deleteNote);

export default router;