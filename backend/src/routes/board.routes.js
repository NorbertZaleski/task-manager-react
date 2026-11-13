import express from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";
import { createColumn, deleteColumn, updateColumn } from "../controllers/column.controller.js";
import { requireBoardMember, requireColumnAccess } from "../middleware/boardAccess.js";
import { addMember, deleteMember, updateMember } from "../controllers/boardMembers.controller.js";
import { createLabel, deleteLabel, getBoardLabels, updateLabel } from "../controllers/label.controller.js";
import { createComment, deleteComment, getNoteActivity, updateComment } from "../controllers/noteActivity.controller.js";

const router = express.Router();


router.get("/", getAllBoards);
router.get("/:boardId", requireBoardMember("member"), getBoard);
router.get("/:boardId/labels", requireBoardMember("member"), getBoardLabels);
router.get("/:boardId/notes/:noteId/activity", requireBoardMember("member"), getNoteActivity);

router.post("/", requireBoardMember("member"), createBoard);
router.post("/:boardId/columns", requireBoardMember("member"), createColumn);
router.post("/:boardId/members", requireBoardMember("admin"), addMember);
router.post("/:boardId/labels", requireBoardMember("member"), createLabel);
router.post("/:boardId/notes/:noteId/comments", requireBoardMember("member"), createComment);

router.patch("/:boardId", requireBoardMember("admin"), updateBoard);
router.patch("/:boardId/columns/:columnId", requireColumnAccess("member"),  updateColumn);
router.patch("/:boardId/members", requireBoardMember("admin"), updateMember);
router.patch("/:boardId/labels/:id", requireBoardMember("member"), updateLabel);
router.patch("/:boardId/notes/:noteId/comments/:commentId", requireBoardMember("member"), updateComment);

router.delete("/:boardId", requireBoardMember("owner"), deleteBoard);
router.delete("/:boardId/columns/:columnId", requireColumnAccess("member"),  deleteColumn);
router.delete("/:boardId/members", requireBoardMember("admin"), deleteMember);
router.delete("/:boardId/labels/:id", requireBoardMember("member"), deleteLabel);
router.delete("/:boardId/notes/:noteId/comments/:commentId", requireBoardMember("member"), deleteComment);


export default router;