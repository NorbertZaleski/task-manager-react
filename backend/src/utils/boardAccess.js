import mongoose from "mongoose";
import BoardMember from "../models/BoardMember.model.js";
import ROLE_RANK from "./roles.js";

export async function getMembership(boardId, userId, minRole = "member") {
    if (!mongoose.isValidObjectId(boardId)) return null;

    const membership = await BoardMember.findOne({ board: boardId, user: userId }).lean();
    if (!membership) return null;
    if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) return null;

    return membership;
}