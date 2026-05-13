import { useAuth } from "../store/authStore";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const {
    loading,
    currentUser,
    isAuthenticated,
  } = useAuth();

  // loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // role check
  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser?.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ redirectTo: "/" }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;