import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
        index: true,
    },
    title: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: [40, "title can't be longer than 40 characters"],
    },
    color: { 
        type: String, 
        default: "#e5e7eb" 
    },
    position: { 
        type: Number, 
        default: 0 
    },
}, { timestamps: true });

const Column = mongoose.model("Column", columnSchema);

export default Column;