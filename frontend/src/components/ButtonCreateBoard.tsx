import { ChevronLeft, Ellipsis, X } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import BackgroundTile from "./BackgroundTile";
import type { BoardBackground } from "../types/types";
import { COLORS, IMAGES } from "../constants/backgroundConstants";
import { getBackgroundStyle } from "../utils/getBackgroundStyle";
import Button from "./Button";

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
        
            <Button
                ref={buttonRef}
                type="button"
                onClick={open}
                variant="primary"
            >
                <p className="font-semibold">Create board</p>
            </Button>

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
                            className="fixed z-100 w-76 max-h-[80vh] overflow-y-auto rounded-lg bg-(--panel) p-3 shadow-lg flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <ChevronLeft />
                                <h3>Create board</h3>
                                <button type="button" onClick={() => setIsAdding(false)}>
                                    <X />
                                </button>
                            </div>

                            <div
                                className="h-30 w-50 rounded bg-cover bg-center flex items-center justify-center mx-auto shadow-lg"
                                style={getBackgroundStyle(background)}
                            >
                            </div>

                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-xs">Background</h4>
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
                                        <button 
                                        type="button"
                                        className="rounded outline-1 outline-(--border-mute) w-10 h-8 flex items-center justify-center"
                                        >
                                            <Ellipsis size={24} className="text-(--mute)"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <input
                                    autoFocus
                                    maxLength={30}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Board title"
                                    className="w-full rounded outline-1 outline-(--border-mute) px-2 py-1"
                                />
                                {!title && <p className="text-sm text-(--mute) font-medium">Board title is required</p>}
                                {title.length>=30 && <p className="text-sm text-(--mute) font-medium">Board title can't be longer than 30 characters</p>}
                            </div>

                            <div>Visibility options</div>

                            <button 
                            type="submit"
                            className={`w-full h-8 rounded-sm text-(--text-dark) pt-0.5 pb-1 px-2 font-semibold flex items-center justify-center ${
                                title ? "bg-(--button)" : "bg-(--mute)"
                            }`}
                            >
                                Create
                            </button>
                        </form>
                    </>,
                    document.body
                )}
        </>
    );
}

export default ButtonCreateBoard;