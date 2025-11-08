import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute skyddar routes baserat på login och roll
 * @param {Object} user - Användarobjektet från App state / localStorage
 * @param {ReactNode} children - Komponenten som ska renderas om access godkänns
 * @param {string} requiredRole - Optional, "USER" eller "ADMIN"
 */
export default function ProtectedRoute({ user, children, requiredRole }) {
  console.log("ProtectedRoute, user:", user, "requiredRole:", requiredRole);

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/user"} replace />;
  }

  return children;
}
