import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true, maxlength: 500 },
    done: { type: Boolean, default: false },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date, default: null },
});

const checklistSchema = new mongoose.Schema({
    title: { type: String, default: "Lista zadań", maxlength: 100 },
    items: { type: [checklistItemSchema], default: [] },
});


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
    dueDate: { 
        type: Date, 
        default: null 
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    attachments: [{
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: String,
        size: Number,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
    }],
    checklists: { type: [checklistSchema], default: [] },
}, { timestamps: true }
);

noteSchema.index({ column: 1, position: 1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;