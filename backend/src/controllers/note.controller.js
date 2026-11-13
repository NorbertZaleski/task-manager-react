import mongoose from "mongoose";
import Note from "../models/Note.model.js";
import Label from "../models/Label.model.js";
import Column from "../models/Column.model.js";
import { toClientNote } from "./board.controller.js";
import { getMembership } from "../middleware/boardAccess.js";
import logActivity from "../utils/logActivity.js";
import NoteActivityModel from "../models/NoteActivity.model.js";
import { UPLOAD_DIR } from "../middleware/upload.js";
import fs from "fs/promises";
import path from "path";

async function resolveLabels(labels, boardId) {
    if (!Array.isArray(labels) || !labels.every((l) => mongoose.isValidObjectId(l))) return null;
    const unique = [...new Set(labels.map(String))];
    const count = await Label.countDocuments({ _id: { $in: unique }, board: boardId });
    return count === unique.length ? unique : null;
};

async function logEvents(note, author, events) {
    for (const event of events) {
        await logActivity({ note, author, ...event });
    }
};

async function diffLabels(oldIds, newIds) {
    const oldSet = new Set(oldIds);
    const newSet = new Set(newIds);
    const added = newIds.filter((id) => !oldSet.has(id));
    const removed = oldIds.filter((id) => !newSet.has(id));
    if (!added.length && !removed.length) return [];

    const docs = await Label.find({ _id: { $in: [...added, ...removed] } })
        .select("title color")
        .lean();
    const byId = new Map(docs.map((l) => [String(l._id), l]));
    const toMeta = (id) => ({
        title: byId.get(id)?.title ?? "",
        color: byId.get(id)?.color ?? "",
    });

    return [
        ...added.map((id) => ({ action: "label_added", meta: toMeta(id) })),
        ...removed.map((id) => ({ action: "label_removed", meta: toMeta(id) })),
    ];
}

export async function getAllNotes(req, res) {
    try {
        const { boardId } = req.params;

        if (!mongoose.isValidObjectId(boardId)) {
            return res.status(400).json({ message: "Invalid board id" });
        }

        const membership = await getMembership(boardId, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        const notes = await Note.find({board: boardId}).sort({createdAt: -1}).lean();

        res.status(200).json(notes.map(toClientNote));
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getNote(req,res) {
    try {

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({message: "Invalid note ID"});
        }

        const note = await Note.findById(id).populate("labels").lean();
        if (!note) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        res.status(200).json(toClientNote(note));
    } catch (error) {
        console.error("Error in getNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createNote(req,res) {
    try {
        const { columnId } = req.params;
        const { title, content="", labels = [] } = req.body;

        if (!mongoose.isValidObjectId(columnId)) {
            return res.status(400).json({ message: "Invalid column ID" });
        }

        const column = await Column.findById(columnId);
        if (!column) return res.status(404).json({ message: "Column not found" });

        const membership = await getMembership(column.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        const labelIds = await resolveLabels(labels, column.board);
        if (!labelIds) return res.status(400).json({ message: "Invalid labels" });

        const last = await Note.findOne({ column: column._id }).sort({ position: -1 });
        const position = last ? last.position + 1 : 0;

        const note = await Note.create({
            board: column.board,
            column: column._id,
            title,
            content,
            labels: labelIds,
            position,
        });

        await logActivity({
            note,
            author: req.user._id,
            action: "created",
            meta: { columnTitle: column.title },
        });

        res.status(201).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function updateNote(req, res) {
    try {
        const {id} = req.params;
        const {title, content, columnId, labels, position} = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        const prev = {
            title: note.title,
            column: String(note.column),
            labels: note.labels.map(String),
        };
        const events = [];

        if (title !== undefined) {
            note.title = title;
            if (note.title !== prev.title) {
                events.push({ action: "renamed", meta: { from: prev.title, to: note.title } });
            }
        }
        if (content !== undefined) note.content = content;

        if (position !== undefined) {
            if (typeof position !== "number" || !Number.isFinite(position)) {
                return res.status(400).json({ message: "Invalid position" });
            }
            note.position = position;
        }

        if (columnId !== undefined) {
            if (!mongoose.isValidObjectId(columnId)) {
                return res.status(400).json({ message: "Invalid column ID" });
            }
            const column = await Column.findOne({ _id: columnId, board: note.board });
            if (!column) return res.status(404).json({ message: "Column not found" });

            if (String(column._id) !== prev.column) {
                const from = await Column.findById(prev.column).select("title").lean();
                events.push({
                    action: "moved",
                    meta: { from: from?.title ?? "", to: column.title },
                });
            }
            note.column = column._id;
        }

        if (labels !== undefined) {
            const labelIds = await resolveLabels(labels, note.board);
            if (!labelIds) return res.status(400).json({ message: "Invalid labels" });
            events.push(...(await diffLabels(prev.labels, labelIds)));
            note.labels = labelIds;
        }

        await note.save();
        await logEvents(note, req.user._id, events);

        res.status(200).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function deleteNote(req, res){
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        await Promise.all([
            note.deleteOne(),
            NoteActivityModel.deleteMany({ note: note._id }),
            removeFiles(note.attachments.map((a) => a.filename)),
        ]);

        res.status(200).json({message: "note deleted", note: note});
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function setNoteLabels(req, res) {
    try {
        const { id } = req.params;
        const { labels } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const before = await Note.findById(id).select("board labels").lean();
        if (!before) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(before.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        const labelIds = await resolveLabels(labels, before.board);
        if (!labelIds) return res.status(400).json({ message: "Invalid labels" });

        const events = await diffLabels(before.labels.map(String), labelIds);

        const note = await Note.findByIdAndUpdate(
            id,
            { $set: { labels: labelIds } },
            { new: true }
        ).lean();
        if (!note) return res.status(404).json({ message: "Note not found" });

        await logEvents(note, req.user._id, events);

        return res.status(200).json(toClientNote(note));
    } catch (error) {
        console.error("Error in setNoteLabels controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function setNoteDueDate(req, res) {
    try {
        const { id } = req.params;
        const { dueDate, dueComplete } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const before = await Note.findById(id).lean();
        if (!before) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(before.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        const update = {};
        const filter = { _id: id };

        if (dueDate !== undefined) {
            if (dueDate === null) {
                update.dueDate = null;
                update.dueComplete = false;
            } else {
                const parsed = typeof dueDate === "string" ? new Date(dueDate) : null;
                if (!parsed || Number.isNaN(parsed.getTime())) {
                    return res.status(400).json({ message: "Invalid due date" });
                }
                update.dueDate = parsed;
            }
        }

        if (dueComplete !== undefined && update.dueDate !== null) {
            if (typeof dueComplete !== "boolean") {
                return res.status(400).json({ message: "Invalid dueComplete" });
            }
            update.dueComplete = dueComplete;

            if (dueDate === undefined) filter.dueDate = { $ne: null };
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "Nothing to update" });
        }

        const note = await Note.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
        });
        if (!note) return res.status(404).json({ message: "Note not found" });

        const events = [];
        const beforeTime = before.dueDate ? new Date(before.dueDate).getTime() : null;
        const afterTime = note.dueDate ? note.dueDate.getTime() : null;

        if (afterTime !== beforeTime) {
            events.push(
                afterTime === null
                    ? { action: "due_removed" }
                    : { action: "due_set", meta: { dueDate: note.dueDate.toISOString() } }
            );
        }
        if (note.dueDate && Boolean(before.dueComplete) !== Boolean(note.dueComplete)) {
            events.push({ action: note.dueComplete ? "due_completed" : "due_reopened" });
        }
        await logEvents(note, req.user._id, events);

        res.status(200).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in setNoteDueDate controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};;

export async function setNoteCompleted(req, res) {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }
        if (typeof completed !== "boolean") {
            return res.status(400).json({ message: "Invalid completed value" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        const membership = await getMembership(note.board, req.user._id);
        if (!membership) return res.status(404).json({ message: "Board not found" });

        if (note.completed !== completed) {
            note.completed = completed;
            await note.save();
            await logActivity({
                note,
                author: req.user._id,
                action: completed ? "completed" : "reopened",
            });
        }

        res.status(200).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in setNoteCompleted controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const removeFiles = (names) =>
    Promise.all(names.map((n) => fs.unlink(path.join(UPLOAD_DIR, n)).catch(() => {})));

const INLINE_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
]);

export async function uploadAttachments(req, res) {
    const files = req.files ?? [];
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            await removeFiles(files.map((f) => f.filename));
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        const membership = note && (await getMembership(note.board, req.user._id));
        if (!note || !membership) {
            await removeFiles(files.map((f) => f.filename));
            return res.status(404).json({ message: "Note not found" });
        }

        note.attachments.push(
            ...files.map((f) => ({
                filename: f.filename,
                originalName: Buffer.from(f.originalname, "latin1").toString("utf8"),
                mimeType: f.mimetype,
                size: f.size,
                uploadedBy: req.user._id,
            }))
        );
        await note.save();

        res.status(201).json(toClientNote(note.toObject()));
    } catch (error) {
        await removeFiles(files.map((f) => f.filename));
        console.error("Error in uploadAttachments controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function downloadAttachment(req, res) {
    try {
        const { id, attachmentId } = req.params;
        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(attachmentId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const note = await Note.findById(id).lean();
        const membership = note && (await getMembership(note.board, req.user._id));
        if (!note || !membership) return res.status(404).json({ message: "Note not found" });

        const att = note.attachments?.find((a) => String(a._id) === attachmentId);
        if (!att) return res.status(404).json({ message: "Attachment not found" });

        const filePath = path.join(UPLOAD_DIR, att.filename);
        const type = (att.mimeType ?? "").split(";")[0].trim().toLowerCase();
        const inline = req.query.inline === "1" && INLINE_TYPES.has(type);

        res.setHeader("X-Content-Type-Options", "nosniff");

        if (inline) {
            res.setHeader(
                "Content-Type",
                type === "text/plain" ? "text/plain; charset=utf-8" : type
            );
            res.setHeader("Content-Disposition", "inline");
            return res.sendFile(filePath);
        }

        res.setHeader("Content-Type", "application/octet-stream");
        res.download(filePath, att.originalName);
    } catch (error) {
        console.error("Error in downloadAttachment controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function deleteAttachment(req, res) {
    try {
        const { id, attachmentId } = req.params;
        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(attachmentId)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const note = await Note.findById(id);
        const membership = note && (await getMembership(note.board, req.user._id));
        if (!note || !membership) return res.status(404).json({ message: "Note not found" });

        const att = note.attachments.id(attachmentId);
        if (!att) return res.status(404).json({ message: "Attachment not found" });

        const filename = att.filename;
        att.deleteOne();
        await note.save();
        await removeFiles([filename]);

        res.status(200).json(toClientNote(note.toObject()));
    } catch (error) {
        console.error("Error in deleteAttachment controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};