import mongoose from "mongoose";
import BoardMember from "../models/BoardMember.model.js";
import User from "../models/User.model.js";
import ROLE_RANK from "../utils/roles.js";

const toClientMember = (user, role) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    role,
});

export async function addMember(req,res) {
    try {
        const { boardId } = req.params;
        const { userId, role = "member" } = req.body;
        
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        if (!["admin", "member"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (ROLE_RANK[role] > ROLE_RANK[req.membership.role]) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(userId).select("name email avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existing = await BoardMember.exists({ board: boardId, user: user._id });
        if (existing) {
            return res.status(409).json({ message: "User is already a member" });
        }

        await BoardMember.create({board: boardId, user: user._id, role});

        res.status(201).json(toClientMember(user, role));
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "User is already a member" });
        }
        console.error("Error in addMember controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function updateMemberRole(req, res) {
    try {
        const { boardId, userId } = req.params;
        const { role } = req.body;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        if (!["admin", "member"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const target = await BoardMember.findOne({ board: boardId, user: userId });
        if (!target) {
            return res.status(404).json({ message: "Member not found" });
        }

        if (target.role === "owner") {
            return res.status(403).json({ message: "Cannot change owner's role" });
        }

        if (
            req.membership.role !== "owner" &&
            ROLE_RANK[target.role] >= ROLE_RANK[req.membership.role]
        ) {
            return res.status(403).json({ message: "Forbidden" });
        }

        target.role = role;
        await target.save();

        const user = await User.findById(userId).select("name email avatar");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(toClientMember(user, role));
    } catch (error) {
        console.error("Error in updateMember controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function removeMember(req, res) {
    try {
        const { boardId, userId } = req.params;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const target = await BoardMember.findOne({ board: boardId, user: userId });
        if (!target) {
            return res.status(404).json({ message: "Member not found" });
        }

        if (target.role === "owner") {
            return res.status(403).json({ message: "Cannot remove the owner" });
        }

        if (
            req.membership.role !== "owner" &&
            ROLE_RANK[target.role] >= ROLE_RANK[req.membership.role]
        ) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await target.deleteOne();

        res.status(200).json({ message: "Member removed", userId });
    } catch (error) {
        console.error("Error in deleteMember controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};