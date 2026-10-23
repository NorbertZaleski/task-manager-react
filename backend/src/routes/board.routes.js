import express from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";
import { createColumn, deleteColumn, updateColumn } from "../controllers/column.controller.js";
import { requireBoardMember } from "../middleware/requireBoardMember.js";


const router = express.Router();


router.get("/", getAllBoards);
router.get("/:boardId", requireBoardMember(), getBoard);

router.post("/", createBoard);
router.post("/:boardId/columns", requireBoardMember(), createColumn);

router.patch("/:boardId", requireBoardMember("admin"), updateBoard);
router.patch("/:boardId/columns/:columnId", requireBoardMember(),  updateColumn);

router.delete("/:boardId", requireBoardMember("owner"), deleteBoard);
router.delete("/:boardId/columns/:columnId", requireBoardMember(),  deleteColumn);


export default router;