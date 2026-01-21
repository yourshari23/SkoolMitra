import { Navigate } from "react-router-dom";
import { getAuth } from "./auth";

export default function ProtectedRoute({ children, role }) {
  const auth = getAuth();

  if (!auth.isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
