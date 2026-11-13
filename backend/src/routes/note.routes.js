import express from "express";
import { createNote, deleteAttachment, deleteNote, downloadAttachment, getAllNotes, getNote, setNoteChecklists, setNoteCompleted, setNoteDueDate, setNoteLabels, updateNote, uploadAttachments } from "../controllers/note.controller.js";
import { requireBoardMember, requireColumnAccess, requireNoteAccess } from "../middleware/boardAccess.js";
import { uploadFiles } from "../middleware/upload.js";

const router = express.Router();

router.get("/board/:boardId", requireBoardMember("member"), getAllNotes);
router.get("/:id", requireNoteAccess("member"), getNote);
router.get("/:id/attachments/:attachmentId", requireNoteAccess("member"), downloadAttachment);

router.post("/columns/:columnId/notes", requireColumnAccess("member"), createNote);
router.post("/:id/attachments", requireNoteAccess("member"), uploadFiles, uploadAttachments);

router.patch("/:id", requireNoteAccess("member"), updateNote);
router.put("/:id/labels", requireNoteAccess("member"), setNoteLabels);
router.patch("/:id/due-date", requireNoteAccess("member"), setNoteDueDate);
router.patch("/:id/completed", requireNoteAccess("member"), setNoteCompleted);
router.put("/:id/checklists", requireNoteAccess("member"), setNoteChecklists);

router.delete("/:id", requireNoteAccess("member"), deleteNote);
router.delete("/:id/attachments/:attachmentId", requireNoteAccess("member"), deleteAttachment);

export default router;