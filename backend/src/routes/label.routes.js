import express from "express";
import { createLabel, deleteLabel, getBoardLabels, updateLabel } from "../controllers/label.controller.js";


const router = express.Router();


router.get("/boards/:boardId", getBoardLabels);

router.post("/boards/:boardId", createLabel);

router.patch("/:id", updateLabel);

router.delete("/:id", deleteLabel);


export default router;