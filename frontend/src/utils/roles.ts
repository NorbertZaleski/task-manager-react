import type { AssignableRole, BoardRole } from "../types/types";

export const ROLE_LABEL: Record<BoardRole, string> = {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
};

export const ASSIGNABLE_ROLES: AssignableRole[] = ["admin", "member"];

export const ROLE_OPTIONS: { value: AssignableRole; label: string }[] =
    ASSIGNABLE_ROLES.map((value) => ({ value, label: ROLE_LABEL[value] }));