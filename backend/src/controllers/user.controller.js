import mongoose from "mongoose";
import User from "../models/User.model.js";

export async function getAllUser(_,res){
    try {
        const users = await User.find();
        if (!users) return res.status(404).json({message: "Users not found"});
        res.status(200).json({message: "users found: ", users: users});
    } catch (error) {
        console.error("Error in getAllUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getUser(req,res){
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({message: "User not found"});
        res.status(200).json({message: "user found: ", user: user});
    } catch (error) {
        console.error("Error in getUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function searchUsers(req, res){
    try {
        const q = String(req.query.q ?? "").trim();
        if (q.length < 2) return res.status(200).json([]);

        const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const rx = new RegExp(safe, "i");

        const users = await User.find({
            _id: {$ne: req.user._id},
            $or: [{name: rx}, {email: rx}],
        })
            .select("name email")
            .limit(10)
            .lean();

        res.status(200).json(users.map((u)=> ({id: u._id.toString(), name: u.name, email: u.email})));
    } catch (error) {
        console.log("Error in searchUsers controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function createUser(req,res){
    try {
        const {name, email, password} = req.body;
        const user = new User({name, email, password});

        if (!user) return res.status(404).json({message: "User not found"});

        const savedUser = await user.save();
        res.status(201).json({message:"new user created: ", user: savedUser});
    } catch (error) {
        console.error("Error in createUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateUser(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        if (String(req.user._id) !== id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const update = {};

        if (req.body.username !== undefined) {
            if (typeof req.body.username !== "string") {
                return res.status(400).json({ message: "Invalid username" });
            }
            const username = req.body.username.trim().toLowerCase();
            if (!/^[a-z0-9_.]{3,30}$/.test(username)) {
                return res.status(400).json({
                    message: "Username must be 3-30 characters: letters, numbers, _ and .",
                });
            }
            const taken = await User.exists({ username, _id: { $ne: id } });
            if (taken) return res.status(400).json({ message: "Username already taken" });
            update.username = username;
        }

        if (req.body.name !== undefined) update.name = req.body.name;

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        ).select("name username email avatar");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar ?? null,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: Object.values(error.errors)[0].message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username already taken" });
        }
        console.error("Error in updateUser controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function deleteUser(req,res){
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(404).json({message: "User not found"});

        res.status(200).json({message: "User deleted: ", user: deleteUser});
    } catch (error) {
        console.error("Error in deleteUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}