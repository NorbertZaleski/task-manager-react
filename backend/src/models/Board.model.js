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
}, {timestamps: true});

const Board = mongoose.model("Board", boardSchema);

export default Board;