import User from "../models/User.model.js";

export async function getAllUser(_,res){
    try {
        const users = await User.find();
        if (!users) return res.status(404).json({message: "Users not found"});
        res.status(200).json("users found: ", users);
    } catch (error) {
        console.error("Error in getAllUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getUser(req,res){
    try {
        const user = await User.find(req.params.id);
        if (!user) return res.status(404).json({message: "User not found"});
        res.status(200).json("user found: ", user);
    } catch (error) {
        console.error("Error in getUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createUser(req,res){
    try {
        const {name, email, password} = req.body;
        const user = new User({name, email, password});

        if (!user) return res.status(404).json({message: "User not found"});

        const savedUser = await user.save();
        res.status(201).json("new user created: ", savedUser);
    } catch (error) {
        console.error("Error in createUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateUser(req,res){
    try {
        const {name, email, password} = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id);

        if (!updatedUser) return res.status(404).json({message: "User not found"});

        res.status(200).json("user updated: ", updateUser);
    } catch (error) {
        console.error("Error in updateUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteUser(req,res){
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(404).json({message: "User not found"});

        res.status(200).json("User deleted: ", deleteUser);
    } catch (error) {
        console.error("Error in deleteUser controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}