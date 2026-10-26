import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
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

const Board = mongoose.model("Board", boardSchema);

export default Board;