import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: true,
        default: '#FFFFFF',
    }
});

const Category = mongoose.model("Category", categorySchema);

export default Category;