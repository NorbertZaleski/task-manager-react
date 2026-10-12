import express from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";
import { createColumn } from "../controllers/column.controller.js";


const router = express.Router();


router.get("/", getAllBoards);
router.get("/:boardId", getBoard);

router.post("/", createBoard);
router.post("/:boardId/columns", createColumn);

router.patch("/:boardId", updateBoard);

router.delete("/:boardId", deleteBoard);


export default router;