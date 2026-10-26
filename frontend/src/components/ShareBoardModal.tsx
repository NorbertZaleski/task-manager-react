import { Link, X } from "lucide-react";
import Button from "./Button";
import MembersList from "./MembersList";
import type { Board } from "../types/types";

type ShareBoardModalProps = {
    board: Board;
    onClose: () => void;
}

function ShareBoardModal({board, onClose}: ShareBoardModalProps) {
    return (
        <div className="fixed inset-0 z-98 bg-black/80"
                onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
        >
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 w-fit min-w-146 min-h-202 max-h-[calc(100dvh-128px)
            bg-(--bg-modal) rounded-2xl overflow-hidden py-3 px-6 flex flex-col gap-6
            ">

                <div className="flex justify-between">
                    <h2 className="text-xl">Share board</h2>
                    <button
                    type="button"
                    onClick={()=> onClose()}
                    className=""
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div className="flex w-full justify-between">
                    <input 
                    placeholder="E-mail or username"
                    className="outline-(--border-mute) flex-1"
                    />
                    <div className="flex gap-2">
                        <Button
                        variant="ghost">
                            Member
                        </Button>
                        <Button 
                        variant="primary"
                        >
                            Invite
                        </Button>
                    </div>
                </div>

                <div className="flex text-left gap-2 items-center">
                    <Link size={24} className="bg-(--bg-icon)"/>
                    <div className="flex flex-col">
                        <p className="font-semibold">Invite to board via a link</p>
                        <p className="text-sm">Create link</p>
                    </div>
                </div>

                <div>
                    <MembersList members={board.members} />
                </div>
            </div>
        </ div>
    )
}

export default ShareBoardModal;