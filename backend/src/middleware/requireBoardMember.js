import mongoose from "mongoose";
import BoardMember from "../models/BoardMember.model.js";
import ROLE_RANK from "../utils/roles.js";

export const requireBoardMember = (minRole = "member") => async (req, res, next) => {
    try {
        const { boardId } = req.params;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(404).json({ message: "Board not found" });
        }

        const membership = await BoardMember.findOne({
            board: boardId,
            user: req.user._id,
        }).lean();

        if (!membership) {
            return res.status(404).json({ message: "Board not found" });
        }

        if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.membership = membership;
        next();
    } catch (error) {
        console.error("Error in requireBoardMember", error);
        res.status(500).json({ message: "Internal server error" });
    }
};