import express from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";
import { createColumn, deleteColumn, updateColumn } from "../controllers/column.controller.js";
import { requireBoardMember, requireColumnAccess, requirePermission } from "../middleware/boardAccess.js";
import { addMember, removeMember, updateMemberRole } from "../controllers/boardMembers.controller.js";
import { createLabel, deleteLabel, getBoardLabels, updateLabel } from "../controllers/label.controller.js";
import { createComment, deleteComment, getNoteActivity, updateComment } from "../controllers/noteActivity.controller.js";
import { getPermissions, updatePermissions } from "../controllers/boardPermissions.controller.js";

const router = express.Router();

// READ
router.get("/", getAllBoards);
router.get("/:boardId", requireBoardMember("member"), getBoard);
router.get("/:boardId/permissions", requireBoardMember("member"), getPermissions);
router.get("/:boardId/labels", requireBoardMember("member"), getBoardLabels);
router.get("/:boardId/notes/:noteId/activity", requireBoardMember("member"), getNoteActivity);

// CREATE
router.post("/", createBoard);
router.post("/:boardId/columns", requirePermission("manageColumns"), createColumn);
router.post("/:boardId/members", requirePermission("inviteMembers"), addMember);
router.post("/:boardId/labels", requirePermission("manageLabels"), createLabel);
router.post("/:boardId/notes/:noteId/comments", requireBoardMember("member"), createComment);

// UPDATE
router.patch("/:boardId", requirePermission("renameBoard"), updateBoard);
router.patch("/:boardId/permissions", requirePermission("editPermissions"), updatePermissions);
router.patch("/:boardId/columns/:columnId", requirePermission("manageColumns"), updateColumn);
router.patch("/:boardId/members/:userId", requirePermission("changeMemberRoles"), updateMemberRole);
router.patch("/:boardId/labels/:id", requirePermission("manageLabels"), updateLabel);
router.patch("/:boardId/notes/:noteId/comments/:commentId", requireBoardMember("member"), updateComment);

// DELETE
router.delete("/:boardId", requirePermission("deleteBoard"), deleteBoard);
router.delete("/:boardId/columns/:columnId", requirePermission("manageColumns"), deleteColumn);
router.delete("/:boardId/members/:userId", requirePermission("removeMembers"), removeMember);
router.delete("/:boardId/labels/:id", requirePermission("manageLabels"), deleteLabel);
router.delete("/:boardId/notes/:noteId/comments/:commentId", requireBoardMember("member"), deleteComment);

export default router;