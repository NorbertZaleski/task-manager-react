import { Edit } from "lucide-react";
import type { Label } from "../types/types";

type LabelsPickerProps = {
    labels: Label[];
    selectedIds: string[];
    onToggle: (labelId: string)=> void | Promise<void>;
}

function LabelsPicker({labels, selectedIds, onToggle}: LabelsPickerProps) {

    return (
        <>
            <div>
                {labels.map((label)=> {
                    const selected = selectedIds.includes(label.id);

                    return (
                        <div 
                        key={label.id} 
                        className="flex gap-2 py-0.5 items-center"
                        onClick={()=>onToggle(label.id)}
                        >
                            <input type="checkbox" checked={selected} readOnly tabIndex={-1} />
                            <span className="w-full w-max-[212px] h-8 rounded px-2 py-1" style={{backgroundColor: label.color}}>{label.title}</span>
                            <button 
                            className="p-2 rounded hover:bg-(--mute)/20"
                            onClick={()=> onEdit()}
                            >
                                <Edit size={16}/>
                            </button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default LabelsPicker;