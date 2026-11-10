import mongoose from "mongoose";

const noteActivitySchema = new mongoose.Schema(
  {
    board: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Board", 
        required: true 
    },
    note: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Note", 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["comment", "activity"], 
        required: true 
    },

    text: { type: String, trim: true, maxlength: 2000 },
    editedAt: { type: Date },

    action: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

noteActivitySchema.index({ note: 1, createdAt: -1 });

export default mongoose.model("NoteActivity", noteActivitySchema);