import { PERMISSIONS } from "../constants/permissions";

export const hasPermission = (user, perm) => {
  if (!user) return false;
  if (user.role === "platform_owner") return true;
  if (user.role === "admin") {
    if (perm === PERMISSIONS.MANAGE_TRACKER_MODELS) return false;
    return true;
  }
  return user.permissions?.includes(perm);
};