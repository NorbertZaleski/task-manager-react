import type { User } from "../types/types";

type AvatarProps = {
    user: User
    className?: string;
};

const getInitial = (name: string) => 
    name
        .trim()
        .split(/\s+/)
        .slice(0,2)
        .map((part)=> part[0]?.toUpperCase() ?? "")
        .join("");

function Avatar ({user, className}: AvatarProps) {

    const base = "flex items-center justify-center size-7 rounded-full ring-2 ring-(--border-avatar) bg-amber-600 overflow-hidden text-sm font-medium text-(--text)"
    return (
        <div 
        key={user.id}
        title={user.name}
        className={`${base} ${className}`}>
            
            {user.avatar ? (
                <img 
                src={user.avatar}
                alt={user.name}
                className="size-full object-cover"
                />
            ) : (
                getInitial(user.name)
            )}

        </div>
    )
}

export default Avatar;