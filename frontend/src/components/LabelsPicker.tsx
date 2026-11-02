import { Edit } from "lucide-react";
import type { Label } from "../types/types";
import Button from "./Button";
import { getTextColor } from "../utils/getTextColor";
import { useState } from "react";

type LabelsPickerProps = {
    labels: Label[];
    selectedIds: string[];
    onToggle: (labelId: string)=> void | Promise<void>;
    onEdit: (label: Label) => void;
    max?: number;
}

function LabelsPicker({labels, selectedIds, onToggle, onEdit, max=10}: LabelsPickerProps) {
    const [numberOfLabelsToShow, setNumberOfLabelsToShow] = useState(max);
    const visible = labels.slice(0, numberOfLabelsToShow)

    return (
        <>
            <div className="w-full flex flex-col py-2 max-h-125 scrollbar-thick scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent overflow-auto">
                {visible.map((label)=> {
                    const selected = selectedIds.includes(label.id);

                    return (
                        <div 
                        key={label.id} 
                        className="flex gap-2 py-0.5 items-center w-full h-max-150 px-1"
                        onClick={()=>onToggle(label.id)}
                        >
                            <input type="checkbox" checked={selected} readOnly tabIndex={-1} className="size-5"/>
                            <span className="w-full w-max-[212px] h-8 rounded px-2 py-1 truncate overflow-hidden select-none" 
                            style={{backgroundColor: label.color, color: getTextColor(label.color)}}>
                                {label.title}
                            </span>
                            <button 
                            className="p-2 rounded hover:bg-(--mute)/20"
                            onClick={(e)=> {
                                e.stopPropagation();
                                onEdit(label);
                            }}
                            >
                                <Edit size={16}/>
                            </button>
                        </div>
                    )
                })}
            </div>
            <div className="flex w-full items-center pt-1">
                {numberOfLabelsToShow === max ? (
                    <Button
                    className="w-full"
                    onClick={()=> setNumberOfLabelsToShow(labels.length)}
                    >
                        <span>Show more</span>
                    </Button>
                    ) : (
                    <Button
                    className="w-full"
                    onClick={()=> setNumberOfLabelsToShow(max)}
                    >
                        <span>Show less</span>
                    </Button>
                    )}
            </div>
        </>
    )
}

export default LabelsPicker;