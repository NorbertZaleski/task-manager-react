import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [60, 'Name can be at most 60 characters'],
        set: (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : v),
        validate: {
            validator: (v) =>
                /^\p{L}[\p{L}'’-]*(?: \p{L}[\p{L}'’-]*)+$/u.test(v),
            message: 'Please enter your first and last name (letters only)',
        },
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-z0-9_]+$/, 'Username can contain only letters, numbers and _'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
}, {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;