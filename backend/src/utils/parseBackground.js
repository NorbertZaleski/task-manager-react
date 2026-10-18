const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function parseBackground(bg) {
    if (bg === undefined) return { ok: true, value: undefined };
    if (!bg || typeof bg.value !== "string") return { ok: false };

    if (bg.type === "color" && HEX_COLOR.test(bg.value)) {
        return { ok: true, value: { type: "color", value: bg.value } };
    }

    if (bg.type === "image") {
        try {
            const url = new URL(bg.value);
            if (url.protocol === "https:") {
                return { ok: true, value: { type: "image", value: url.href } };
            }
        } catch {
            console.log("Incorrect URL")
        }
    }

    return { ok: false };
}