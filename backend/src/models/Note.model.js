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
    content: {
        type: String,
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label",
    }],
}, { timestamps: true }
);


const Note = mongoose.model("Note", noteSchema);

export default Note;