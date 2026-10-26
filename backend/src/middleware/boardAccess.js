import mongoose from "mongoose";
import BoardMember from "../models/BoardMember.model.js";
import Column from "../models/Column.model.js";
import Note from "../models/Note.model.js";
import ROLE_RANK from "../utils/roles.js";

export async function getMembership(boardId, userId) {
    if (!mongoose.isValidObjectId(boardId) || !mongoose.isValidObjectId(userId)) return null;
    return BoardMember.findOne({ board: boardId, user: userId }).lean();
}

export function hasRole(membership, minRole = "member") {
    const have = ROLE_RANK[membership?.role];
    const need = ROLE_RANK[minRole];
    return have !== undefined && need !== undefined && have >= need;
}

export const requireBoardMember = (minRole = "member") => async (req, res, next) => {
    try {
        const membership = await getMembership(req.params.boardId, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        if (!hasRole(membership, minRole)) {
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
        const { columnId } = req.params;
        if (!mongoose.isValidObjectId(columnId)) {
            return res.status(404).json({ message: "Column not found" });
        }

        const column = await Column.findById(columnId).select("board").lean();
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
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ message: "Note not found" });
        }

        const note = await Note.findById(id).select("board").lean();
        if (!note) return res.status(404).json({ message: "Note not found" });

        req.params.boardId = note.board.toString();
        return requireBoardMember(minRole)(req, res, next);
    } catch (error) {
        console.error("Error in requireNoteAccess", error);
        res.status(500).json({ message: "Internal server error" });
    }
};