import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { BoardRole } from "../types/types";
import type { BoardPermissions, PermissionKey } from "../types/permissions";
import { ROLE_RANK } from "../utils/roles";

type Value = { can: (action: PermissionKey) => boolean };

const Ctx = createContext<Value>({ can: () => false });

export function BoardPermissionsProvider({
  myRole,
  permissions,
  children,
}: {
  myRole: BoardRole;
  permissions: BoardPermissions;
  children: ReactNode;
}) {
  const value = useMemo<Value>(
    () => ({
      can: (action) => {
        const required = permissions[action];
        return !!required && ROLE_RANK[myRole] >= ROLE_RANK[required];
      },
    }),
    [myRole, permissions]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCan = (action: PermissionKey) => useContext(Ctx).can(action);