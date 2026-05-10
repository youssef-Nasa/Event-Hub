import { useAuth } from "../context/AuthContext";

/**
 * A wrapper component that only renders its children if the user has the required permission.
 */
export default function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}
