import { COLORS_AVATAR } from "../constants/backgroundConstants";
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

const getAvatarColor = (seed: string) => {
    let hash = 0;
    for (let i=0; i<seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i) >>> 0);
    }
    return COLORS_AVATAR[hash % COLORS_AVATAR.length];
};

function Avatar ({user, className=""}: AvatarProps) {

    const base = "flex items-center justify-center size-7 rounded-full overflow-hidden text-sm font-medium text-(--text)"
    return (
        <div 
        key={user.id}
        title={user.name}
        className={`${base} ${className}`}
        style={user.avatar ? undefined : {backgroundColor: getAvatarColor(user.id) }}
        >
            
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