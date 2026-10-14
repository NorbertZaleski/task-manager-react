import mongoose from "mongoose";
import Board from "../models/Board.model.js";
import Note from "../models/Note.model.js";
import Label from "../models/Label.model.js";
import Column from "../models/Column.model.js";
import { toClientNote } from "./board.controller.js";

async function resolveLabels(labels, boardId) {
    if (!Array.isArray(labels) || !labels.every((l) => mongoose.isValidObjectId(l))) return null;
    const unique = [...new Set(labels.map(String))];
    const count = await Label.countDocuments({ _id: { $in: unique }, board: boardId });
    return count === unique.length ? unique : null;
}

export async function getAllNotes(req, res) {
    try {
        const { boardId } = req.params;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({ message: "Invalid board id" });
        }

        const board = await Board.findOne({_id: boardId, user: req.user.id}).lean();
        if (!board) return res.status(404).json({message:"Board not found"});

        const notes = await Note.find({board: boardId}).sort({createdAt: -1}).lean();

        res.status(200).json(notes.map(toClientNote));
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getNote(req,res) {
    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({message: "Invalid note ID"});
        }

        const note = await Note.findById(id).lean();
        if (!note) return res.status(404).json({ message: "Note not found" });

        const board = await Board.findOne({ _id: note.board, user: req.user.id }).lean();
        if (!board) return res.status(404).json({ message: "Note not found" });

        res.status(200).json(toClientNote(note));
    } catch (error) {
        console.error("Error in getNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createNote(req,res) {
    try {
        const { columnId } = req.params;
        const { content, labels = [] } = req.body;

        if (!mongoose.isValidObjectId(columnId)) {
            return res.status(400).json({ message: "Invalid column ID" });
        }

        const column = await Column.findById(columnId);
        if (!column) return res.status(404).json({ message: "Column not found" });

        const board = await Board.findOne({_id: column.board, user: req.user.id});
        if (!board) return res.status(404).json({message:"Column not found"});

        const labelIds = await resolveLabels(labels, board._id);
        if (!labelIds) return res.status(400).json({ message: "Invalid labels" });

        const last = await Note.findOne({ column: column._id }).sort({ position: -1 });
        const position = last ? last.position + 1 : 0;

        const note = await Note.create({
            board: board._id,
            column: column._id,
            content,
            labels: labelIds,
            position,
        });

        res.status(201).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateNote(req, res) {
    try {
        const {id} = req.params;
        const {title, content, columnId, labels, position} = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        const board = await Board.findOne({ _id: note.board, user: req.user.id });
        if (!board) return res.status(404).json({ message: "Note not found" });

        if (title !== undefined) note.title = title;
        if (content !==undefined) note.content = content;

        if (position !== undefined) {
            if (typeof position !== "number" || !Number.isFinite(position)) {
                return res.status(400).json({ message: "Invalid position" });
            }
            note.position = position;
        }

        if (columnId !== undefined) {
            if (!mongoose.isValidObjectId(columnId)) {
                return res.status(400).json({ message: "Invalid column ID" });
            }
            const column = await Column.findOne({ _id: columnId, board: board._id });
            if (!column) return res.status(404).json({ message: "Column not found" });
            note.column = column._id;
        }

        if (labels !== undefined) {
            const labelIds = await resolveLabels(labels, board._id);
            if (!labelIds) return res.status(400).json({ message: "Invalid labels" });
            note.labels = labelIds;
        }

        await note.save();
        res.status(200).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteNote(req, res){
    try {
        const note = await Note.findById(req.params.id).populate("board", "user");

        if (!note || !note.board) return res.status(404).json({message: "Note not found"});

        if (note.board.user.toString() !== req.user.id) {
            return res.status(403).json({message: "Not authorized"});
        }

        await note.deleteOne();

        res.status(200).json({message: "note deleted", note: note});
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};