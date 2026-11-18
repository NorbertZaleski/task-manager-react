import type { AssignableRole, BoardRole } from "../types/types";

export const ROLE_RANK: Record<BoardRole, number> = {
  guest: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

export const ROLE_LABEL: Record<BoardRole, string> = {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
    guest: "Guest",
};

export const ASSIGNABLE_ROLES: AssignableRole[] = ["admin", "member", "guest"];

export const ROLE_OPTIONS: { value: AssignableRole; label: string }[] =
    ASSIGNABLE_ROLES.map((value) => ({ value, label: ROLE_LABEL[value] }));