import type { BoardRole } from "./types";

export type PermissionKey =
  | "renameBoard" | "inviteMembers" | "removeMembers" | "changeMemberRoles"
  | "manageColumns" | "manageLabels" | "deleteBoard" | "editPermissions";

export type BoardPermissions = Record<PermissionKey, BoardRole>;