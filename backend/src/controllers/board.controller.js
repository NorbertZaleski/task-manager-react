import Board from "../models/Board.model.js";
import Label from "../models/Label.model.js";
import Note from "../models/Note.model.js";
import Column from "../models/Column.model.js";
import mongoose from "mongoose";
import { parseBackground } from "../utils/parseBackground.js";
import BoardMember from "../models/BoardMember.model.js";

const toClientBoard = ({ _id, __v, ...rest }) => ({ id: _id.toString(), ...rest });

export const toClientColumn = ({ _id, __v, board, ...rest }) => ({ id: _id.toString(), ...rest });

const toClientLabel = ({ _id, __v, board, ...rest }) => ({ id: _id.toString(), ...rest });

export const toClientNote = ({ _id, __v, board, column, labels = [], ...rest }) => ({
    id: _id.toString(),
    columnId: column.toString(),
    labelIds: labels.map((l) => l.toString()),
    ...rest,
});

const toClientMember = (m) => ({
    id: m.user._id.toString(),
    name: m.user.name,
    email: m.user.email,
    avatar: m.user.avatar,
    role: m.role,
});

export async function getAllBoards(req, res) {
    try {
        const memberships = await BoardMember
            .find({user: req.user._id})
            .select("board")
            .lean();
        
        const boardIds = memberships.map((m) => m.board);

        const boards = await Board
        .find({ _id: { $in: boardIds } })
        .sort({ createdAt: -1 })
        .lean();

        res.status(200).json(boards.map(toClientBoard));
    } catch (error) {
        console.error("Error in getAllBoards controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getBoard(req,res) {
    try {

        const board = await Board.findById(req.params.boardId).lean();
        if (!board) return res.status(404).json({message:"Board not found"});

        const [columns, notes, members] = await Promise.all([
            Column.find({ board: board._id }).sort({ position: 1, createdAt: 1 }).lean(),
            Note.find({ board: board._id }).lean(),
            BoardMember.find({ board: board._id })
                .populate("user", "name email avatar")
                .lean(),
        ]);

        res.status(200).json({
            ...toClientBoard(board),
            columns: columns.map(toClientColumn),
            notes: notes.map(toClientNote),
            members: members.filter((m) => m.user).map(toClientMember),
        });
    } catch (error) {
        console.error("Error in getBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createBoard(req, res) {
    try {
        const user = req.user?._id;
        const { title, background } = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const parsed = parseBackground(background);
        if (!parsed.ok) {
            return res.status(400).json({ message: "Invalid background" });
        }

        const savedBoard = await Board.create({ 
            user, 
            title : title.trim(),
            ...(parsed.value && {background: parsed.value}),
        });

        const [columns] = await Promise.all([
            Column.insertMany([
                { board: savedBoard._id, title: "Do zrobienia", position: 0 },
                { board: savedBoard._id, title: "W trakcie", position: 1 },
                { board: savedBoard._id, title: "Zrobione", position: 2 },
            ]),
            BoardMember.create({board: savedBoard._id, user, role:"owner"}),
        ]);


        res.status(201).json({
            id: savedBoard._id.toString(),
            title: savedBoard.title,
            background: {
                type: savedBoard.background.type,
                value: savedBoard.background.value,
            },
            columns: columns.map((c) => ({
                id: c._id.toString(),
                title: c.title,
                color: c.color,
            })),
            notes: [],
        });
    } catch (error) {
        await Promise.allSettled([
            Board.deleteOne({ _id: savedBoard._id }),
            Column.deleteMany({ board: savedBoard._id }),
            BoardMember.deleteMany({ board: savedBoard._id }),
        ]);
        console.error("Error in createBoard controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function updateBoard(req, res) {
    try {

        const { title, background } = req.body;
        const update = {};

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({ message: "Title is required" });
            }
            update.title = title.trim();
        }

        if (title.trim().length > 50) {
            return res.status(400).json({ message: "Title is too long (max 50 characters)" });
        }
        
        if (background !== undefined) {
            const parsed = parseBackground(background);
            if (!parsed.ok) {
                return res.status(400).json({ message: "Invalid background" });
            }
            update.background = parsed.value;
        }

        const updatedBoard = await Board.findOneAndUpdate(
            { _id: req.params.boardId, user: req.user.id },
            update,
            { new: true, runValidators: true }
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

        const deletedBoard = await Board.findByIdAndDelete(req.params.boardId);

        if (!deletedBoard) return res.status(404).json({message: "Board not found"});

        await Promise.all([
            Note.deleteMany({ board: deletedBoard._id }),
            Label.deleteMany({ board: deletedBoard._id }),
            Column.deleteMany({ board: deletedBoard._id }),
            BoardMember.deleteMany({ board: deletedBoard._id }),
        ]);

        res.status(200).json({message: "Board deleted", board: deletedBoard});
    } catch (error) {
        console.error("Error in deleteBoard controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};