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

export async function updateUser(req,res){
    try {
        const {name, email, password} = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id);

        if (!updatedUser) return res.status(404).json({message: "User not found"});

        res.status(200).json({message:"user updated: ", user: updatedUser});
    } catch (error) {
        console.error("Error in updateUser controller", error);
        res.status(500).json({message:"Internal server error"});
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