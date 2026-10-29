import express from "express";
import { createNote, deleteNote, getAllNotes, getNote, setNoteLabels, updateNote } from "../controllers/note.controller.js";
import { requireBoardMember, requireColumnAccess, requireNoteAccess } from "../middleware/boardAccess.js";

const router = express.Router();

router.get("/board/:boardId", requireBoardMember("member"), getAllNotes);
router.get("/:id", requireNoteAccess("member"), getNote);

router.post("/columns/:columnId/notes", requireColumnAccess("member"), createNote);

router.patch("/:id", requireNoteAccess("member"), updateNote);
router.put("/:id/labels", requireNoteAccess("member"), setNoteLabels);

router.delete("/:id", requireNoteAccess("member"), deleteNote);

export default router;