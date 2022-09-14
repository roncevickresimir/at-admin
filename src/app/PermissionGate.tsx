import { Navigate } from "react-router-dom";

import { PATHS } from "./routes";
import { getUserRoleAbrv } from "./utils/getUserData";

export default function PermissionsGate(props: any) {
  const { children, roles } = props;
  const userRole = getUserRoleAbrv();
  const permissionGranted = roles.some((role: string) => role === userRole);

  if (!permissionGranted) {
    console.log("Permission denied.");
    return <Navigate to={PATHS.LOGIN} />;
  }

  return <>{children}</>;
}
