import mongoose from "mongoose";
import Board from "../models/Board.model.js";
import Note from "../models/Note.model.js";

export async function getAllNotes(req, res) {
    try {
        const {boardId} = req.params;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({ message: "Invalid board id" });
        }

        const board = await Board.findOne({_id: boardId, user: req.user.id});
        if (!board) return res.status(404).json({message:"Board not found"});

        const notes = await Note.find({board: boardId}).sort({createdAt: -1});

        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getNote(req,res) {
    try {
        const note = await Note.findById(req.params.id).populate('board');

        if (!note || note.board.user.toString() !== req.user.id) {
            return res.status(404).json({message:"Forbidden"});
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createNote(req,res) {
    try {
        const {board:boardId, title, content, category} = req.body;

        const board = await Board.findOne({_id: boardId, user: req.user.id});
        if (!board) return res.status(404).json({message:"Board not found"});

        const note = new Note({board: board._id, title, content, category});

        const savedNote = await note.save();
        res.status(201).json({note: savedNote});
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateNote(req, res) {
    try {
        const {title, content, category} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, content, category}, {new: true});

        if (!updatedNote) return res.status(404).json({message: "Note not found"});

        res.status(200).json("note updated", updateNote);
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteNote(req, res){
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) return res.status(404).json({message: "Note not found"});

        res.status(200).json("note deleted", deleteNote);
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};