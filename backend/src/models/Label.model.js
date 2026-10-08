import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: "",
    },
    color: {
        type: String,
        required: true,
        default: '#FFFFFF',
    }
});

const Label = mongoose.model("Label", labelSchema);

export default Label;