
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

    const base = "relative overflow-hidden rounded-md border-2 border-white/5 transition";
    const state = selected ? "border-blue-500" : "border-transparent";
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
        </button>
    )
}

export default BackgroundTile;