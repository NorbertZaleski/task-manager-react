import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { LayoutDashboard, StickyNote } from "lucide-react";
import Input from "./Input";
import { searchService } from "../services/search.service";
import type { SearchResults } from "../types/types";

type Hit = { key: string; kind: "board" | "note"; title: string; sub?: string; to: string };

function SearchBox() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const wrapRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const hits = useMemo<Hit[]>(() => {
        if (!results) return [];
        return [
            ...results.boards.map((b) => ({
                key: `b-${b.id}`,
                kind: "board" as const,
                title: b.title,
                to: `/boards/${b.id}`,
            })),
            ...results.notes.map((n) => ({
                key: `n-${n.id}`,
                kind: "note" as const,
                title: n.title || "Untitled",
                sub: [n.boardTitle, n.snippet].filter(Boolean).join(" · "),
                to: `/boards/${n.boardId}?note=${n.id}`,
            })),
        ];
    }, [results]);

    useEffect(() => {
        const q = query.trim();
        if (!q) {
            setResults(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const ctrl = new AbortController();
        const t = setTimeout(async () => {
            try {
                const data = await searchService.search(q, ctrl.signal);
                setResults(data);
                setActive(0);
            } catch (err) {
                if (!ctrl.signal.aborted) {
                    console.error("Search error:", err);
                    setResults({ boards: [], notes: [] });
                }
            } finally {
                if (!ctrl.signal.aborted) setLoading(false);
            }
        }, 250);

        return () => {
            clearTimeout(t);
            ctrl.abort();
        };
    }, [query]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const go = (hit: Hit) => {
        setOpen(false);
        setQuery("");
        setResults(null);
        navigate(hit.to);
    };

    const showPanel = open && query.trim().length > 0;

    return (
        <div ref={wrapRef} className="relative w-195 max-w-full">
            <Input
                value={query}
                placeholder="Search boards and notes"
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setOpen(false);
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActive((i) => Math.min(i + 1, hits.length - 1));
                    }
                    if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActive((i) => Math.max(i - 1, 0));
                    }
                    if (e.key === "Enter" && hits[active]) go(hits[active]);
                }}
                className="w-full"
            />

            {showPanel && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-md border border-(--border-mute) bg-(--bg-modal) p-1 shadow-2xl">
                    {loading && !results && <p className="px-3 py-2 text-sm text-(--text-mute)">Searching...</p>}

                    {!loading && results && hits.length === 0 && (
                        <p className="px-3 py-2 text-sm text-(--text-mute)">No results</p>
                    )}

                    {hits.map((h, i) => (
                        <button
                            key={h.key}
                            type="button"
                            onMouseEnter={() => setActive(i)}
                            onClick={() => go(h)}
                            className={`flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm cursor-pointer ${
                                i === active ? "bg-white/10" : ""
                            }`}
                        >
                            {h.kind === "board" ? (
                                <LayoutDashboard size={16} className="mt-0.5 shrink-0" />
                            ) : (
                                <StickyNote size={16} className="mt-0.5 shrink-0" />
                            )}
                            <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium">{h.title}</span>
                                {h.sub && (
                                    <span className="block truncate text-xs text-(--text-mute)">{h.sub}</span>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBox;