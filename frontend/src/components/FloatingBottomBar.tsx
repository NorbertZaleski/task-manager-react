import { LayoutGrid, List, Pin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import useBoards from "../hooks/useBoards";
import type { Board } from "../types/types";
import { getBackgroundStyle } from "../utils/getBackgroundStyle";
import Input from "./Input";
import Button from "./Button";

function BoardPickerTile({ board, active, onPick }: { board: Board; active: boolean; onPick: () => void }) {
    return (
        <Link
            to={`/boards/${board.id}`}
            onClick={onPick}
            aria-current={active ? "page" : undefined}
            className="group flex flex-col overflow-hidden rounded-md bg-white/5 transition hover:bg-white/10 ease-in duration-75"
        >
            <div
                className="relative h-18 w-full bg-(--card)"
                style={getBackgroundStyle(board.background)}
            >
                {active && (
                    <span className="absolute left-2 top-2 size-3.5 rounded-full border-2 border-black/80 bg-(--border-active-textarea)" />
                )}
            </div>
            <span className="truncate px-2.5 py-2 text-sm font-semibold">{board.title}</span>
        </Link>
    );
}

function BoardPickerRow({ board, active, onPick }: { board: Board; active: boolean; onPick: () => void }) {
    return (
        <Link
            to={`/boards/${board.id}`}
            onClick={onPick}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center gap-3 rounded-md px-2 py-1.5 transition ease-in duration-75 ${
                active ? "bg-blue-500/15" : "hover:bg-white/10"
            }`}
        >
            {active && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-(--border-active-textarea)" />
            )}
            <div
                className="h-8 w-10 shrink-0 rounded-sm bg-(--card)"
                style={getBackgroundStyle(board.background)}
            />
            <span className="truncate text-sm font-semibold">{board.title}</span>
        </Link>
    );
}

type BoardPickerView = "grid" | "list";

function FloatingBottomBar() {
    const { boards } = useBoards();
    const { boardId } = useParams();
    const [isBoardPickerOpen, setIsBoardPickerOpen] = useState(false);
    const [query, setQuery] = useState("");

    const [view, setView] = useState<BoardPickerView>("grid");

    const closePicker = () => {
        setIsBoardPickerOpen(false);
        setQuery("");
    };

    useEffect(() => {
        if (!isBoardPickerOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closePicker();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isBoardPickerOpen]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? boards.filter((b) => b.title.toLowerCase().includes(q)) : boards;
    }, [boards, query]);

    return (
        <>
            {isBoardPickerOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40 backdrop-blur-xs" 
                        onClick={closePicker} 
                    />

                    <div className="fixed bottom-16 left-1/2 z-50 flex max-h-170 w-146 max-w-[calc(100vw-1rem)] -translate-x-1/2 
                    flex-col rounded-lg border-2 border-(--card) bg-(--bg-modal) p-4 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-mute)" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search your boards"
                                    className="w-full py-2 pl-9 pr-3 text-sm"
                                />
                            </div>
                            <Button
                                variant="outline_small"
                                onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
                                aria-label={view === "grid" ? "List view" : "Grid view"}
                            >
                                {view === "grid" ? <List size={16} strokeWidth={2} /> : <LayoutGrid size={16} strokeWidth={2} />}
                            </Button>
                            <Button
                                variant="outline_small"
                                onClick={closePicker}
                                aria-label="Pin as a sidebar"
                                className=""
                            >
                                <Pin size={16} strokeWidth={2} />
                            </Button>
                        </div>

                        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                            {filtered.length === 0 ? (
                                <p className="py-8 text-center text-sm text-(--text-mute)">No boards found</p>
                            ) : view === "grid" ? (
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                                    {filtered.map((board) => (
                                        <BoardPickerTile
                                            key={board.id}
                                            board={board}
                                            active={board.id === boardId}
                                            onPick={closePicker}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {filtered.map((board) => (
                                        <BoardPickerRow
                                            key={board.id}
                                            board={board}
                                            active={board.id === boardId}
                                            onPick={closePicker}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <div className="fixed bottom-3 left-1/2 z-50 flex h-fit w-fit -translate-x-1/2 gap-2 rounded-md border-2 border-(--card) bg-(--panel) p-2 font-semibold">
                <button type="button">Calendar</button>
                <button type="button">Board</button>
                <button type="button" onClick={() => setIsBoardPickerOpen((o) => !o)}>
                    Swap board
                </button>
            </div>
        </>
    );
}

export default FloatingBottomBar;