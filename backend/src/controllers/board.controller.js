import Board from "../models/Board.model.js";
import Label from "../models/Label.model.js";
import Note from "../models/Note.model.js";
import Column from "../models/Column.model.js";
import mongoose from "mongoose";

const toClientBoard = ({ _id, __v, ...rest }) => ({ id: _id.toString(), ...rest });

const toClientColumn = ({ _id, __v, board, ...rest }) => ({ id: _id.toString(), ...rest });

const toClientNote = ({ _id, __v, board, column, ...rest }) => ({
    id: _id.toString(),
    columnId: column.toString(),
    ...rest,
});

export async function getAllBoards(req, res) {
    try {
        const boards = await Board.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
        res.status(200).json(boards.map(toClientBoard));
    } catch (error) {
        console.error("Error in getAllBoards controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getBoard(req,res) {
    try {

        if (!mongoose.isValidObjectId(req.params.boardId)) {
            return res.status(404).json({ message: "Board not found" });
        }

        const board = await Board.findOne({_id: req.params.boardId, user: req.user.id}).lean();
        if (!board) return res.status(404).json({message:"Board not found"});

        const [columns, notes] = await Promise.all([
            Column.find({ board: board._id }).sort({ position: 1, createdAt: 1 }).lean(),
            Note.find({ board: board._id }).lean(),
        ]);

        res.status(200).json({
            ...toClientBoard(board),
            columns: columns.map(toClientColumn),
            notes: notes.map(toClientNote),
        });
    } catch (error) {
        console.error("Error in getBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createBoard(req, res) {
    try {
        const user = req.user?._id;
        const { title } = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const savedBoard = await Board.create({ user, title });

        const columns = await Column.insertMany([
            { board: savedBoard._id, title: "Do zrobienia", position: 0 },
            { board: savedBoard._id, title: "W trakcie", position: 1 },
            { board: savedBoard._id, title: "Zrobione", position: 2 },
        ]);

        res.status(201).json({
            id: savedBoard._id.toString(),
            title: savedBoard.title,
            columns: columns.map((c) => ({
                id: c._id.toString(),
                title: c.title,
                color: c.color,
            })),
            notes: [],
        });
    } catch (error) {
        console.error("Error in createBoard controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function updateBoard(req, res) {
    try {

        if (!mongoose.isValidObjectId(req.params.boardId)) {
            return res.status(404).json({ message: "Board not found" });
        }

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

        if (!mongoose.isValidObjectId(req.params.boardId)) {
            return res.status(404).json({ message: "Board not found" });
        }

        const deletedBoard = await Board.findOneAndDelete({
            _id: req.params.boardId,
            user: req.user.id,
        });

        if (!deletedBoard) return res.status(404).json({message: "Board not found"});

        await Promise.all([
            Note.deleteMany({ board: deletedBoard._id }),
            Label.deleteMany({ board: deletedBoard._id }),
            Column.deleteMany({ board: deletedBoard._id }),
        ]);

        res.status(200).json({message: "Board deleted", board: deletedBoard});
    } catch (error) {
        console.error("Error in deleteBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};