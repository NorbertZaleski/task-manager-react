import { Check } from "lucide-react";

type BackgroundTileProps = {
    selected?: boolean;
    onSelect: () => void;
    className?: string;
} & (
    | {variant: "color"; color: string}
    | {variant: "image"; src: string; alt?: string}
);
 
function BackgroundTile(props: BackgroundTileProps){
    const {selected = false, onSelect, className=""} = props;

    const base =
        "relative overflow-hidden rounded-md transition " +
        "after:pointer-events-none after:absolute after:inset-0 after:bg-white/0 after:transition " +
        "hover:after:bg-white/10";
    const state = selected ? "after:bg-white/10" : "";
    const size = 
        props.variant === "color"
            ? "h-[32px] w-[40px]"
            : "h-10 w-15"

    return(
        <button 
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`${base} ${size} ${state} ${className}`}
        style=
            {props.variant ==="color"
                ? { backgroundColor: props.color }
                : undefined
            }
        >
            {props.variant === "image" && (
                <img
                    src={props.src}
                    alt={props.alt ?? ""}
                    className="h-full w-full object-cover"
                />
            )}
            {selected && (
                <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/50">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                </span>
            )}

        </button>
    )
}

export default BackgroundTile;