import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    background: {
        type: {type: String, enum: ["color", "image"], default: "color"},
        value: {type: String, default: "9ca3af"},
    }
}, {timestamps: true});

const Board = mongoose.model("Board", boardSchema);

export default Board;