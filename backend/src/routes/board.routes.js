import express from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";
import { createColumn, deleteColumn, updateColumn } from "../controllers/column.controller.js";
import { requireBoardMember, requireColumnAccess } from "../middleware/boardAccess.js";
import { addMember, deleteMember, updateMember } from "../controllers/boardMembers.controller.js";
import { getBoardLabels } from "../controllers/label.controller.js";

const router = express.Router();


router.get("/", getAllBoards);
router.get("/:boardId", requireBoardMember(), getBoard);
router.get("/:boardId/labels", requireBoardMember(), getBoardLabels);

router.post("/", createBoard);
router.post("/:boardId/columns", requireBoardMember(), createColumn);
router.post("/:boardId/members", requireBoardMember("admin"), addMember);

router.patch("/:boardId", requireBoardMember("admin"), updateBoard);
router.patch("/:boardId/columns/:columnId", requireColumnAccess("admin"),  updateColumn);
router.patch("/:boardId/members", requireBoardMember("admin"), updateMember);

router.delete("/:boardId", requireBoardMember("owner"), deleteBoard);
router.delete("/:boardId/columns/:columnId", requireColumnAccess("admin"),  deleteColumn);
router.delete("/:boardId/members", requireBoardMember("admin"), deleteMember);


export default router;