import Board from "../models/Board.model.js";
import BoardMember from "../models/BoardMember.model.js";
import Note from "../models/Note.model.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function snippet(text, q, radius = 40) {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return "";
    const start = Math.max(0, i - radius);
    const end = Math.min(text.length, i + q.length + radius);
    return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

const stripHtml = (html = "") =>
    html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

export async function search(req, res) {
    try {
        const q = String(req.query.q ?? "").trim();
        if (!q || q.length > 100) return res.status(200).json({ boards: [], notes: [] });

        const memberships = await BoardMember.find({ user: req.user._id }).select("board").lean();
        const boardIds = memberships.map((m) => m.board);
        if (!boardIds.length) return res.status(200).json({ boards: [], notes: [] });

        const rx = new RegExp(escapeRegex(q), "i");
        const searchContent = q.length >= 3;

        const noteFilters = [{ title: rx }, { "checklists.items.text": rx }];
        if (searchContent) noteFilters.push({ content: rx });

        const [boards, rawNotes] = await Promise.all([
            Board.find({ _id: { $in: boardIds }, title: rx }).select("title").limit(5).lean(),
            Note.find({ board: { $in: boardIds }, $or: noteFilters })
                .select("title content board checklists")
                .sort({ updatedAt: -1 })
                .limit(60)
                .lean(),
        ]);

        const notes = rawNotes
            .map((n) => {
                const titleMatch = rx.test(n.title ?? "");
                let match = "";
                if (!titleMatch) {
                    if (searchContent) match = snippet(stripHtml(n.content), q);
                    if (!match) {
                        const item = (n.checklists ?? [])
                            .flatMap((c) => c.items ?? [])
                            .find((i) => rx.test(i.text));
                        match = item ? snippet(item.text, q) : "";
                    }
                }
                return { n, titleMatch, match };
            })
            .filter(({ titleMatch, match }) => titleMatch || match)
            .sort((a, b) => Number(b.titleMatch) - Number(a.titleMatch))
            .slice(0, 20);

        const noteBoardIds = [...new Set(notes.map(({ n }) => String(n.board)))];
        const noteBoards = await Board.find({ _id: { $in: noteBoardIds } }).select("title").lean();
        const boardTitle = new Map(noteBoards.map((b) => [String(b._id), b.title]));

        res.status(200).json({
            boards: boards.map((b) => ({ id: String(b._id), title: b.title })),
            notes: notes.map(({ n, match }) => ({
                id: String(n._id),
                title: n.title ?? "",
                boardId: String(n.board),
                boardTitle: boardTitle.get(String(n.board)) ?? "",
                snippet: match,
            })),
        });
    } catch (error) {
        console.error("Error in search controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}