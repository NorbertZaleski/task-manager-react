import mongoose from "mongoose";
import BoardMember from "../models/BoardMember.model.js";
import ROLE_RANK from "../utils/roles.js";

export const requireBoardMember = (minRole = "member") => async (req, res, next) => {
    try {
        const { boardId } = req.params;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(404).json({ message: "Board not found" });
        }

        // 1. najpierw pobierz membership
        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
        }).lean();

        // 2. dopiero potem go sprawdzaj
        if (!membership) {
            return res.status(404).json({ message: "Board not found" });
        }

        const have = ROLE_RANK[membership.role];
        const need = ROLE_RANK[minRole];

        if (have === undefined || need === undefined || have < need) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.membership = membership;
        next();
    } catch (error) {
        console.error("Error in requireBoardMember", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const requireColumnAccess = (minRole = "member") => async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.columnId)) {
            return res.status(404).json({ message: "Column not found" });
        }

        const column = await Column.findById(req.params.columnId).select("board").lean();
        if (!column) return res.status(404).json({ message: "Column not found" });

        req.params.boardId = column.board.toString();
        return requireBoardMember(minRole)(req, res, next);
    } catch (error) {
        console.error("Error in requireColumnAccess", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const requireNoteAccess = (minRole = "member") => async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.noteId)) {
            return res.status(404).json({ message: "Note not found" });
        }

        const note = await Note.findById(req.params.noteId).select("board").lean();
        if (!note) return res.status(404).json({ message: "Note not found" });

        req.params.boardId = note.board.toString();
        return requireBoardMember(minRole)(req, res, next);
    } catch (error) {
        console.error("Error in requireNoteAccess", error);
        res.status(500).json({ message: "Internal server error" });
    }
};