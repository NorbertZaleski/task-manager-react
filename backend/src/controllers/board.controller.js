import Board from "../models/Board.model.js";

export async function getAllBoards(req, res) {
    try {
        const userId = req.user?._id;
        const boards = await Board.find({user: userId}).sort({createdAt: -1});

        if (!boards) return res.status(404).json({message:"Boards not found"});

        res.status(200).json(boards);
    } catch (error) {
        console.error("Error in getAllBoards controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getBoard(req,res) {
    try {
        const board = await Board.findById(req.params.id);

        if (!board) return res.status(404).json({message:"Board not found"});

        res.status(200).json(board);
    } catch (error) {
        console.error("Error in getBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createBoard(req,res) {
    try {
        const {title, content, category} = req.body;
        const board = new Board({title, content, category});

        const savedBoard = await board.save();
        res.status(201).json(savedBoard);
    } catch (error) {
        console.error("Error in createBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateBoard(req, res) {
    try {
        const {title, content, category} = req.body;
        const updatedBoard = await Board.findByIdAndUpdate(req.params.id, {title, content, category}, {new: true});

        if (!updatedBoard) return res.status(404).json({message: "Board not found"});

        res.status(200).json("Board updated", updateBoard);
    } catch (error) {
        console.error("Error in updateBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteBoard(req, res){
    try {
        const deletedBoard = await Board.findByIdAndDelete(req.params.id);

        if (!deletedBoard) return res.status(404).json({message: "Board not found"});

        res.status(200).json("Board deleted", deleteBoard);
    } catch (error) {
        console.error("Error in deleteBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};