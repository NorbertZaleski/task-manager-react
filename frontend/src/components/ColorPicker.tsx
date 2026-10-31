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
                    className={`w-9 h-8 rounded ${
                        value === color ? "ring-2 ring-white" : ""
                    }`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
}

export default ColorPicker;