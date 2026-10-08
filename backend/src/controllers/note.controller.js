import mongoose from "mongoose";
import Board from "../models/Board.model.js";
import Note from "../models/Note.model.js";
import Label from "../models/Label.model.js";

export async function getAllNotes(req, res) {
    try {
        const { boardId } = req.params;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({ message: "Invalid board id" });
        }

        const board = await Board.findOne({_id: boardId, user: req.user.id}).populate("labels", "title color");
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

//FIX routing zmienić aby z adresu brać id board
export async function createNote(req,res) {
    try {
        const { boardId } = req.params;
        const { title, content, labels} = req.body;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({ message: "Invalid board ID" });
        }

        const board = await Board.findOne({_id: boardId, user: req.user.id});
        if (!board) return res.status(404).json({message:"Board not found"});

        const note = new Note({board: board._id, title, content, labels});

        const savedNote = await note.save();
        res.status(201).json({note: savedNote});
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateNote(req, res) {
    try {
        const {id} = req.params;
        const {title, content, labels} = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findById(id).populate("board", "user");
        if (!note || !note.board) return res.status(404).json({message: "Note not found"});

        if (note.board.user.toString() !== req.user.id()) {
            return res.status(403).json({message: "Not authorized"});
        }

        if (title !== undefined) note.title = title;
        if (content !==undefined) note.content = content;

        await note.save();
        await note.populate("labels", "title color")
        res.status(200).json({message: "note updated", note: note});
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteNote(req, res){
    try {
        const note = await Note.findById(req.params.id).populate("board", "user");

        if (!note || !note.board) return res.status(404).json({message: "Note not found"});

        if (note.board.user.toString() !== req.user.id) {
            return res.status(403).json({message: "Not authorized"});
        }

        await note.deleteOne();

        res.status(200).json({message: "note deleted", note: note});
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};