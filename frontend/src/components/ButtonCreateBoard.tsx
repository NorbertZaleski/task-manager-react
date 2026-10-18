import { ChevronLeft, Ellipsis, X } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import BackgroundTile from "./BackgroundTile";
import type { BoardBackground } from "../types/types";
import { COLORS, IMAGES } from "../constants/backgroundConstants";
import { getBackgroundStyle } from "../utils/getBackgroundStyle";

type ButtonCreateBoardProps = {
    onCreate: (title: string, background: BoardBackground) => Promise<void>;
}

function ButtonCreateBoard({ onCreate }: ButtonCreateBoardProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [background, setBackground] = useState<BoardBackground>({
        type: "color",
        value: COLORS[0],
    });

    function open() {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            setPos({ top: rect.bottom + 8, left: rect.left });
        }
        setIsAdding(true);
    }

    async function handleCreateBoard(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await onCreate(title.trim(), background);
            setTitle("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error in handleCreateBoard:", error);
        }
    }

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={open}
                className="flex w-full items-center text-sm"
            >
                Create board
            </button>

            {isAdding &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-99"
                            onClick={() => setIsAdding(false)}
                        />

                        <form
                            onSubmit={handleCreateBoard}
                            style={{ top: pos.top, left: pos.left }}
                            className="fixed z-100 w-80 max-h-[80vh] overflow-y-auto rounded-lg border bg-(--panel) p-3 shadow-lg flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <ChevronLeft />
                                <h3>Create board</h3>
                                <button type="button" onClick={() => setIsAdding(false)}>
                                    <X />
                                </button>
                            </div>

                            <div
                                className="h-24 rounded border bg-cover bg-center"
                                style={getBackgroundStyle(background)}
                            >
                            </div>

                            <div>
                                <h4>Background</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {IMAGES.map((src)=> (
                                        <BackgroundTile
                                            key={src}
                                            variant="image"
                                            src={src}
                                            selected={background.type === "image" && background.value === src}
                                            onSelect={() => setBackground({ type: "image", value: src })}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-2 items-center">
                                        {COLORS.map((color) => (
                                            <BackgroundTile
                                                key={color}
                                                variant="color"
                                                color={color}
                                                selected={background.type === "color" && background.value === color}
                                                onSelect={() => setBackground({ type: "color", value: color })}
                                            />
                                        ))}
                                        <button type="button">
                                            <Ellipsis />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <input
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Board title"
                                    className="w-full rounded border p-1"
                                />
                                {!title && <p className="text-sm text-red-500">Board title is required</p>}
                            </div>

                            <div>Visibility options</div>

                            <button type="submit">Create</button>
                        </form>
                    </>,
                    document.body
                )}
        </>
    );
}

export default ButtonCreateBoard;