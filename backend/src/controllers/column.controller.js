import mongoose, { mongo } from "mongoose";
import Board from "../models/Board.model.js";
import Column from "../models/Column.model.js";
import { toClientColumn } from "./board.controller.js";
import Note from "../models/Note.model.js";

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

export async function updateColumn(req,res) {
    try {
        const { columnId } = req.params;

        if (!mongoose.isValidObjectId(req.params.columnId)) {
            return res.status(404).json({message: "Column not found"});
        }

        const { title } = req.body;
        const update = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ message: "Title is required" });
            }
            update.title = title.trim();
        }
        
        if (title.trim().length > 50) {
            return res.status(400).json({ message: "Title is too long (max 50 characters)" });
        }

        const column = await Column.findById(columnId);
        if (!column) {
            return res.status(404).json({ message: "Column not found" });
        }

        const board = await Board.findOne({ _id: column.board, user: req.user.id });
        if (!board) {
            return res.status(404).json({ message: "Column not found" });
        }

        const updatedColumn = await Column.findByIdAndUpdate(
            columnId,
            update,
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedColumn) return res.status(404).json({message: "Column not found"});

        return res.status(200).json({message: "Column updated", column: updatedColumn});
    } catch (error) {
        console.error("Error in updateColumn controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function deleteColumn(req,res){
    try {
        const { columnId } = req.params;

        const column = await Column.findById(columnId);
        if (!column) return res.status(404).json({ message: "Column not found" });

        const board = await Board.findOne({_id: column.board, user: req.user.id});
        if (!board) return res.status(404).json({ message: "Column not found" });
        
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