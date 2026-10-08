import express from "express";
import { createBoard, deleteBoard, getAllBoards, getBoard, updateBoard } from "../controllers/board.controller.js";


const router = express.Router();


router.get("/", getAllBoards);
router.get("/:boardId", getBoard);

router.post("/", createBoard);

router.put("/:boardId", updateBoard);

router.delete("/:boardId", deleteBoard);


export default router;