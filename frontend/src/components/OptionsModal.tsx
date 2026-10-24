import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type OptionsModalProps = {
    title: string;
    onClose: () => void;
};

function OptionsModal({title, onClose}: OptionsModalProps) {
    const { user, logout } = useAuth();
    
    return (
        <>
            <div className="fixed inset-0 z-99" onClick={onClose} />

            <div className="fixed top-12 right-3 z-100 w-72 rounded-lg bg-(--panel) p-3 shadow-lg flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <button
                    type="button"
                    onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {user && <p className="text-sm">{user.name}</p>}

                <button
                type="button"
                onClick={()=> {
                    logout();
                    onClose();
                }}
                className="rounded-sm hover:bg-(--hover-white) px-2 py-1 text-left text-sm"
                >
                    Log out
                </button>
            </div>
        </>
    );
}

export default OptionsModal;