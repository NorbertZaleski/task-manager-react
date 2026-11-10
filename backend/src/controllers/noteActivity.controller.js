import mongoose from "mongoose";
import Note from "../models/Note.model.js";
import noteActivityModel from "../models/NoteActivity.model.js";
import NoteActivityModel from "../models/NoteActivity.model.js";

const AUTHOR_FIELDS = "name avatar";

const toClientActivity = (a) => ({
  id: a._id.toString(),
  noteId: a.note.toString(),
  type: a.type,
  text: a.text,
  action: a.action,
  meta: a.meta,
  editedAt: a.editedAt ?? null,
  createdAt: a.createdAt,
  author: a.author
    ? { id: a.author._id.toString(), name: a.author.name, avatar: a.author.avatar }
    : null,
});

const findBoardNote = async (boardId, noteId) => {
  if (!mongoose.isValidObjectId(noteId)) return null;
  return Note.findOne({ _id: noteId, board: boardId });
};

const validateText = (text) => {
  if (typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 2000) return null;
  return trimmed;
};

export const getNoteActivity = async (req, res) => {
  const note = await findBoardNote(req.params.boardId, req.params.noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  const limit = Math.min(Number(req.query.limit) || 30, 100);
  const filter = { note: note._id };
  if (req.query.before) {
    const before = new Date(req.query.before);
    if (!isNaN(before)) filter.createdAt = { $lt: before };
  }

  const items = await noteActivityModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate("author", AUTHOR_FIELDS);

  res.json({
    items: items.slice(0, limit).map(toClientActivity),
    hasMore: items.length > limit,
  });
};

export const createComment = async (req, res) => {
  const note = await findBoardNote(req.params.boardId, req.params.noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  const text = validateText(req.body.text);
  if (!text) return res.status(400).json({ message: "Comment text is required (max 2000 chars)" });

  const comment = await NoteActivityModel.create({
    board: note.board,
    note: note._id,
    author: req.user._id,
    type: "comment",
    text,
  });
  await comment.populate("author", AUTHOR_FIELDS);

  res.status(201).json(toClientActivity(comment));
};

export const updateComment = async (req, res) => {
  const note = await findBoardNote(req.params.boardId, req.params.noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  const text = validateText(req.body.text);
  if (!text) return res.status(400).json({ message: "Comment text is required (max 2000 chars)" });

  if (!mongoose.isValidObjectId(req.params.commentId))
    return res.status(404).json({ message: "Comment not found" });

  const comment = await NoteActivityModel.findOne({
    _id: req.params.commentId,
    note: note._id,
    type: "comment",
  });
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (!comment.author.equals(req.user._id))
    return res.status(403).json({ message: "You can edit only your own comments" });

  comment.text = text;
  comment.editedAt = new Date();
  await comment.save();
  await comment.populate("author", AUTHOR_FIELDS);

  res.json(toClientActivity(comment));
};

export const deleteComment = async (req, res) => {
  const note = await findBoardNote(req.params.boardId, req.params.noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (!mongoose.isValidObjectId(req.params.commentId))
    return res.status(404).json({ message: "Comment not found" });

  const comment = await NoteActivityModel.findOne({
    _id: req.params.commentId,
    note: note._id,
    type: "comment",
  });
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (!comment.author.equals(req.user._id))
    return res.status(403).json({ message: "You can delete only your own comments" });

  await comment.deleteOne();
  res.status(204).end();
};