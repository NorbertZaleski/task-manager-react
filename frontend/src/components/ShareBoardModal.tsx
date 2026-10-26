import { ChevronDown, Link2, X } from "lucide-react";
import Button from "./Button";
import MembersList from "./MembersList";
import type { Board } from "../types/types";
import Input from "./Input";

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
            bg-(--bg-modal) rounded-2xl overflow-hidden py-4 px-6 flex flex-col gap-6
            ">

                <div className="flex justify-between">
                    <h2 className="text-xl">Share board</h2>
                    <button
                    type="button"
                    onClick={()=> onClose()}
                    className="hover:text-(--text-mute)"
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div className="flex w-full justify-between gap-2">
                    <Input
                    placeholder="E-mail or username"
                    />
                    <div className="flex gap-2">
                        <Button
                        variant="list"
                        iconr={<ChevronDown size={16} className="-mr-0.5"/>}
                        >
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
                    <div className="bg-(--bg-icon) p-2 rounded-sm"><Link2 size={20} className="-rotate-45"/></div>
                    <div className="flex flex-col">
                        <p className="font-semibold">Invite to board via a link</p>
                        <p className="text-sm underline">Create link</p>
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