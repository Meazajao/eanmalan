import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute skyddar routes baserat på login och roll.
 *
 * @param {Object} props
 * @param {Object|null} props.user - Användarobjekt från App state eller localStorage
 * @param {React.ReactNode} props.children - Komponenten som ska renderas om access godkänns
 * @param {"USER"|"ADMIN"} [props.requiredRole] - Optional, specificerar roll som krävs
 */
export default function ProtectedRoute({ user, children, requiredRole }) {
  // Om användaren inte finns, redirect till login
  if (!user) return <Navigate to="/login" replace />;

  // Om en specifik roll krävs
  if (requiredRole && user.role !== requiredRole) {
    // Om user.role inte är definierad skickas till login
    if (!user.role) return <Navigate to="/login" replace />;

    // Redirect baserat på roll
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "USER") return <Navigate to="/user" replace />;

    // Fallback, skickar till login om okänd roll
    return <Navigate to="/login" replace />;
  }

  // Allt ok, rendera barnkomponenten
  return children;
}
