import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
}, { _id: false });

const boardSchema = new mongoose.Schema({
    members: {
        type: [memberSchema],
        validate: [(v) => v.length > 0, "board must have at least one member"],
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [40, "title can't be longer than 40 characters"],
    },
    background: {
        type: {type: String, enum: ["color", "image"], default: "color"},
        value: {type: String, default: "#9ca3af"},
    }
}, {timestamps: true});

boardSchema.index({ "members.user": 1 });

const Board = mongoose.model("Board", boardSchema);

export default Board;