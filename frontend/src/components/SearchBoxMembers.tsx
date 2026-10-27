import { useRef, useState } from "react";
import Input from "./Input";
import type { User } from "../types/types";
import useUserSearch from "../hooks/useUserSearch";
import MembersModal from "./MembersModal";

type SearchBoxMembersProps = {
    onSelect: (user: User) => void;
}

function SearchBoxMembers({onSelect}: SearchBoxMembersProps) {
    const [inputValue, setInputValue] = useState("");
    const {results} = useUserSearch(inputValue);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col w-full">
            <Input
            placeholder="E-mail or username"
            value={inputValue}
            onChange={(e)=> {
                setInputValue(e.target.value);
                setIsModalOpen(true);
            }}
            ref={inputRef}
            className="bg-(--bg-input) rounded-sm"
            />
            {isModalOpen && (
                <MembersModal 
                onSelect={onSelect}
                onClose={()=>setIsModalOpen(false)}
                results={results}
                anchorRef={inputRef}
                />
            )}
        </div>
    )
}

export default SearchBoxMembers;