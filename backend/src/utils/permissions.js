export const DEFAULT_PERMISSIONS = {
    updateBoard: "admin",
    inviteMembers: "admin",
    removeMembers: "admin",
    changeMemberRoles: "admin",
    manageColumns: "member",
    manageLabels: "member",
    deleteBoard: "owner",
    editPermissions: "owner",
};

export const LOCKED_PERMISSIONS = ["deleteBoard", "editPermissions"];

export function resolvePermissions(overrides = {}) {
    const locked = Object.fromEntries(
        LOCKED_PERMISSIONS.map((k) => [k, DEFAULT_PERMISSIONS[k]])
    );
    return { ...DEFAULT_PERMISSIONS, ...overrides, ...locked };
}