import NoteActivity from "../models/NoteActivity.model.js";

export const logActivity = async ({ note, author, action, meta }) => {
  try {
    await NoteActivity.create({
      board: note.board,
      note: note._id,
      author,
      type: "activity",
      action,
      meta,
    });
  } catch (err) {
    console.error("logActivity failed:", err.message);
  }
};

export default logActivity;