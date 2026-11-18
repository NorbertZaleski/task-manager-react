import mongoose from "mongoose";
import Board from "../models/Board.model.js";
import BoardMember from "../models/BoardMember.model.js";
import Column from "../models/Column.model.js";
import Note from "../models/Note.model.js";
import ROLE_RANK from "../utils/roles.js";
import { resolvePermissions } from "../utils/permissions.js";

export async function getMembership(boardId, userId) {
    if (!mongoose.isValidObjectId(boardId) || !mongoose.isValidObjectId(userId)) return null;
    return BoardMember.findOne({ board: boardId, user: userId }).lean();
}

export function hasRole(membership, minRole = "member") {
    const have = ROLE_RANK[membership?.role];
    const need = ROLE_RANK[minRole];
    return have !== undefined && need !== undefined && have >= need;
}

async function authorize(req, res, next, rule) {
    const { boardId } = req.params;
    if (!mongoose.isValidObjectId(boardId)) {
        return res.status(404).json({ message: "Board not found" });
    }

    const [membership, board] = await Promise.all([
        getMembership(boardId, req.user._id),
        Board.findById(boardId).lean(),
    ]);

    if (!membership || !board) {
        return res.status(404).json({ message: "Board not found" });
    }

    const permissions = resolvePermissions(board.permissions);

    const minRole = typeof rule === "object" ? permissions[rule.permission] : rule;
    if (!minRole) throw new Error(`Unknown permission: ${rule.permission}`);

    if (!hasRole(membership, minRole)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    req.board = board;
    req.membership = membership;
    req.permissions = permissions;
    next();
}

const guard = (resolveBoardId) => (rule = "member") => async (req, res, next) => {
    try {
        const ok = await resolveBoardId(req, res);
        if (!ok) return;
        return await authorize(req, res, next, rule);
    } catch (error) {
        console.error("Error in access middleware", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const requireBoardMember = guard(async () => true);

export const requireColumnAccess = guard(async (req, res) => {
    const { columnId } = req.params;
    if (!mongoose.isValidObjectId(columnId)) {
        res.status(404).json({ message: "Column not found" });
        return false;
    }
    const column = await Column.findById(columnId).select("board").lean();
    if (!column) {
        res.status(404).json({ message: "Column not found" });
        return false;
    }
    req.params.boardId = column.board.toString();
    return true;
});

export const requireNoteAccess = guard(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        res.status(404).json({ message: "Note not found" });
        return false;
    }
    const note = await Note.findById(id).select("board").lean();
    if (!note) {
        res.status(404).json({ message: "Note not found" });
        return false;
    }
    req.params.boardId = note.board.toString();
    return true;
});

export const requirePermission = (action) => requireBoardMember({ permission: action });