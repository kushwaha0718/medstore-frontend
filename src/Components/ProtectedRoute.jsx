import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("adminInfo");

  return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
}
