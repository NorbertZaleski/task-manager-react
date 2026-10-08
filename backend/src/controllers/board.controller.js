import Board from "../models/Board.model.js";
import Label from "../models/Label.model.js";
import Note from "../models/Note.model.js";

export async function getAllBoards(req, res) {
    try {
        const boards = await Board.find({user: req.user.id}).sort({createdAt: -1});

        res.status(200).json(boards);
    } catch (error) {
        console.error("Error in getAllBoards controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getBoard(req,res) {
    try {
        const board = await Board.findOne({_id: req.params.boardId, user: req.user.id});
        if (!board) return res.status(404).json({message:"Board not found"});

        const notes = await Note.find({board: board._id});

        res.status(200).json({...board.toObject(), notes});
    } catch (error) {
        console.error("Error in getBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createBoard(req,res) {
    try {
        const user = req.user?._id;
        const { title } = req.body;

        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const board = new Board({user, title});

        const savedBoard = await board.save();
        res.status(201).json({id: board._id, board: savedBoard});
    } catch (error) {
        console.error("Error in createBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateBoard(req, res) {
    try {
        const { title } = req.body;
        const updatedBoard = await Board.findOneAndUpdate(
            {_id: req.params.boardId, user: req.user.id}, 
            { title }, 
            {new: true, runValidators: true}
        );

        if (!updatedBoard) return res.status(404).json({message: "Board not found"});

        res.status(200).json({message: "Board updated", board: updatedBoard});
    } catch (error) {
        console.error("Error in updateBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteBoard(req, res){
    try {
        const deletedBoard = await Board.findOneAndDelete({
            _id: req.params.boardId,
            user: req.user.id,
        });

        if (!deletedBoard) return res.status(404).json({message: "Board not found"});

        await Note.deleteMany({board: deletedBoard._id});
        await Label.deleteMany({board: deleteBoard._id});

        res.status(200).json({message: "Board deleted", board: deletedBoard});
    } catch (error) {
        console.error("Error in deleteBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};