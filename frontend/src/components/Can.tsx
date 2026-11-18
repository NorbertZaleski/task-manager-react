import { cloneElement, type ReactElement } from "react";
import { useCan } from "../context/BoardPermissionsContext";
import type { PermissionKey } from "../types/permissions";

type DisableableProps = {
  disabled?: boolean;
  className?: string;
  title?: string;
  onClick?: unknown;
  "aria-disabled"?: boolean;
};

type Props = {
  action: PermissionKey;
  mode?: "hide" | "disable";
  children: ReactElement<DisableableProps>;
};

export function Can({ action, mode = "hide", children }: Props) {
  const allowed = useCan(action);

  if (allowed) return children;
  if (mode === "hide") return null;

  return cloneElement(children, {
    disabled: true,
    "aria-disabled": true,
    title: "You do not have permission to do this action",
    className: `${children.props.className ?? ""} cursor-not-allowed opacity-50`.trim(),
    onClick: undefined,
  });
}