import mongoose from "mongoose";
import Board from "../models/Board.model.js";
import Column from "../models/Column.model.js";
import { toClientColumn } from "./board.controller.js";

export async function createColumn(req,res) {
    try {
        
        const { boardId } = req.params;
        const { title } = req.body;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(404).json({message: "Board not found"});
        }

        if (!title?.trim()) {
            return res.status(400).json({message: "Title is required"});
        }

        const board = await Board.findOne({ _id: boardId, user: req.user.id }).lean();
        if (!board) {
            return res.status(404).json({message: "Board not found"});
        }

        const last = await Column.findOne({board: board._id}).sort({position: -1});
        const position = last ? last.position + 1 : 0;

        const column = await Column.create({board: board._id, title: title.trim(), position});

        res.status(201).json(toClientColumn(column.toObject()));
    } catch (error) {
        console.log("Error in createColumn controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function deleteColumn(req,res){
    try {
        //
    } catch (error) {
        //
    }
};