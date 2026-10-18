import type { CSSProperties } from "react";
import type { BoardBackground } from "../types/types";

export function getBackgroundStyle(bg?: BoardBackground): CSSProperties {
    if (!bg) return {};
    return bg.type === "color"
        ? { backgroundColor: bg.value }
        : {
              backgroundImage: `url(${bg.value})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          };
}

export function getBoardStyle(bg?: BoardBackground): CSSProperties {
    const theme =
        bg?.type === "image"
            ? { "--board-panel": "rgb(0 0 0 / 0.45)", "--board-text": "#fff" }
            : { "--board-panel": "rgb(0 0 0 / 0.25)", "--board-text": "#fff" };

    return { ...getBackgroundStyle(bg), ...theme } as CSSProperties;
}