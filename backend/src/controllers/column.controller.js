import mongoose, { mongo } from "mongoose";
import Board from "../models/Board.model.js";
import Column from "../models/Column.model.js";
import { toClientColumn } from "./board.controller.js";
import Note from "../models/Note.model.js";
import { getMembership } from "../utils/boardAccess.js";

export async function createColumn(req,res) {
    try {
        
        const { boardId } = req.params;
        const { title } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({message: "Title is required"});
        }

        const last = await Column.findOne({board: boardId}).sort({position: -1});
        const position = last ? last.position + 1 : 0;

        const column = await Column.create({board: boardId, title: title.trim(), position});

        res.status(201).json(toClientColumn(column.toObject()));
    } catch (error) {
        console.log("Error in createColumn controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function updateColumn(req, res) {
    try {
        const { boardId, columnId } = req.params;
        const { title } = req.body;

        if (!mongoose.isValidObjectId(columnId)) {
            return res.status(404).json({ message: "Column not found" });
        }

        const column = await Column.findOne({ _id: columnId, board: boardId });
        if (!column) return res.status(404).json({ message: "Column not found" });

        const membership = await getMembership(column.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Column not found" });

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ message: "Title is required" });
            }
            if (title.trim().length > 30) {
                return res.status(400).json({ message: "Title is too long (max 30 characters)" });
            }
            column.title = title.trim();
        }

        await column.save();

        return res.status(200).json({ message: "Column updated", column });
    } catch (error) {
        console.error("Error in updateColumn controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function deleteColumn(req,res){
    try {
        const { boardId, columnId } = req.params;

        if (!mongoose.isValidObjectId(columnId)) {
            return res.status(404).json({ message: "Column not found" });
        }

        const column = await Column.findOne({ _id: columnId, board: boardId });
        if (!column) return res.status(404).json({ message: "Column not found" });

        const membership = await getMembership(column.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Column not found" });
        
        await Promise.all([
            Note.deleteMany({column: column._id}),
            Column.deleteOne({_id: column._id}),
        ]);

        res.status(200).json({message:"Column deleted"});
    } catch (error) {
        console.error("Error in deleteColumn controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};