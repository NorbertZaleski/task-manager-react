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
                        className=""
                        onClick={()=>onToggle(label.id)}
                        >
                            <input type="checkbox" checked={selected} readOnly tabIndex={-1} />
                            <span style={{backgroundColor: label.color}}>{label.title}</span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default LabelsPicker;