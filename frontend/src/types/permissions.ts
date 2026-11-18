import type { BoardRole } from "./types";

export type PermissionKey =
  | "updateBoard" | "inviteMembers" | "removeMembers" | "changeMemberRoles"
  | "manageColumns" | "manageLabels" | "deleteBoard" | "editPermissions";

export type BoardPermissions = Record<PermissionKey, BoardRole>;