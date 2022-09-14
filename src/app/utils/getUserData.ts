import { getAppState } from "./getAppState";

export function getUserRoleAbrv() {
  const { user } = getAppState();
  return user.role.abrv;
}

export function getUserId() {
  const { user } = getAppState();
  return user.role.id;
}
