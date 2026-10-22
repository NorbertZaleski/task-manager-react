 import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Board",
        index: true,
    },
    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column",
        required: true,
        index: true,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label",
    }],
    position: {
        type: Number,
        default: 0,
    },
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true }
);


const Note = mongoose.model("Note", noteSchema);

export default Note;