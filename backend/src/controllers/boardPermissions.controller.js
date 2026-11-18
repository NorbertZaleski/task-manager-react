import Board from "../models/Board.model.js";
import ROLE_RANK from "../utils/roles.js";
import {
    DEFAULT_PERMISSIONS,
    LOCKED_PERMISSIONS,
    resolvePermissions,
} from "../utils/permissions.js";

export const getPermissions = (req, res) => {
    res.status(200).json({
        permissions: req.permissions,
        role: req.membership.role,
    });
};

export const updatePermissions = async (req, res) => {
    try {
        const set = {};

        for (const [key, role] of Object.entries(req.body)) {
            if (!(key in DEFAULT_PERMISSIONS) || LOCKED_PERMISSIONS.includes(key)) {
                return res.status(400).json({ message: `Invalid permission: ${key}` });
            }
            if (!(role in ROLE_RANK)) {
                return res.status(400).json({ message: `Invalid role: ${role}` });
            }
            set[`permissions.${key}`] = role;
        }

        if (Object.keys(set).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const updated = await Board.findByIdAndUpdate(
            req.board._id,
            { $set: set },
            { new: true, runValidators: true }
        ).lean();

        res.status(200).json({ permissions: resolvePermissions(updated.permissions) });
    } catch (error) {
        console.error("Error in updatePermissions controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};