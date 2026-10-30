import { PRESET_COLORS_LABEL } from "../constants/backgroundConstants";

type ColorPickerProps = {
    value: string;
    onChange: (color: string) => void;
};

function ColorPicker({ value, onChange }: ColorPickerProps) {
    return (
        <div className="flex flex-wrap gap-2 items-center">
            {PRESET_COLORS_LABEL.map((color) => (
                <button
                    key={color}
                    type="button"
                    aria-label={color}
                    onClick={() => onChange(color)}
                    className={`w-8 h-6 rounded ${
                        value === color ? "ring-2 ring-white" : ""
                    }`}
                    style={{ backgroundColor: color }}
                />
            ))}
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Custom color"
                className="w-8 h-6 p-0 bg-transparent cursor-pointer"
            />
        </div>
    );
}

export default ColorPicker;