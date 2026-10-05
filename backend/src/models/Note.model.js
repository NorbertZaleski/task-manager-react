 import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Board',
        index: true,
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    }
}, {timestamps: true}
);


const Note = mongoose.model("Note", noteSchema);

export default Note;