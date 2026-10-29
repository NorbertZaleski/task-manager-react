import mongoose from "mongoose";
import Note from "../models/Note.model.js";
import Label from "../models/Label.model.js";
import Column from "../models/Column.model.js";
import { toClientNote } from "./board.controller.js";
import { getMembership } from "../middleware/boardAccess.js";

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

        const membership = await getMembership(boardId, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

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

        const note = await Note.findById(id).populate("labels").lean();
        if (!note) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        res.status(200).json(toClientNote(note));
    } catch (error) {
        console.error("Error in getNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createNote(req,res) {
    try {
        const { columnId } = req.params;
        const { title, content="", labels = [] } = req.body;

        if (!mongoose.isValidObjectId(columnId)) {
            return res.status(400).json({ message: "Invalid column ID" });
        }

        const column = await Column.findById(columnId);
        if (!column) return res.status(404).json({ message: "Column not found" });

        const membership = await getMembership(column.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        const labelIds = await resolveLabels(labels, column.board);
        if (!labelIds) return res.status(400).json({ message: "Invalid labels" });

        const last = await Note.findOne({ column: column._id }).sort({ position: -1 });
        const position = last ? last.position + 1 : 0;

        const note = await Note.create({
            board: column.board,
            column: column._id,
            title,
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

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

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
            const column = await Column.findOne({ _id: columnId, board: note.board });
            if (!column) return res.status(404).json({ message: "Column not found" });
            note.column = column._id;
        }

        if (labels !== undefined) {
            const labelIds = await resolveLabels(labels, note.board);
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
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        await note.deleteOne();

        res.status(200).json({message: "note deleted", note: note});
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};