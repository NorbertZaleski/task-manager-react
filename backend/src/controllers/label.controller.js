import mongoose from "mongoose";
import Board from "../models/Board.model.js";
import Label from "../models/Label.model.js";
import Note from "../models/Note.model.js";


export async function getBoardLabels(req,res){
    try {
        const { boardId } = req.params;

        if (!mongoose.isValidObjectId(boardId)){
            return res.status(400).json({message:"Invalid board ID"});
        }

        const board = await Board.findOne({_id: boardId, user: req.user.id});
        if (!board){return res.status(404).json({message:"Board not found"})};

        const labels = await Label.find({board: boardId});

        res.status(200).json(labels);
    } catch (error) {
        console.error("Error in getBoardLabels controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createLabel(req,res){
    try {
        const {boardId} = req.params;
        const {title, color} = req.body;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({message:"Invalid board ID"});
        }

        const board = await Board.findOne({_id: boardId, user: req.user.id});
        if (!board) {return res.status(404).json({message: "Board not found"})};

        const label = new Label({board: boardId, title, color});

        const newLabel = await label.save();
        return res.status(201).json({label: newLabel});
    } catch (error) {
        console.error("Error in createLabel controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateLabel(req,res){
    try {
        const label = await Label.findById(req.params.id).populate("board", "user");
        if (!label || label.board) return res.status(404).json({message: "Label not found"});

        if (label.board.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "Not authorized"});
        }

        const { title, color } = req.body;
        if (title !== undefined) label.title = title;
        if (color !==undefined) label.color = color;
        
        await label.save();
        res.status(200).json({message: "updated label", label: label});
    } catch (error) {
        console.error("Error in updateLabel controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteLabel(req,res){
    try {
        const label = await Label.findById(req.params.id).populate("board", "user");
        if (!label || !label.board) return res.status(404).json({message: "Label not found"});

        if (label.board.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "Not authorized"});
        }

        await Note.updateMany({labels: label._id}, {$pull: {labels: label._id}});
        await label.deleteOne();

        return res.status(200).json({message: "label deleted", label: label});
    } catch (error) {
        console.error("Error in deleteLabel controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};