import { useAuth } from "../store/authStore";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const {
    loading,
    currentUser,
    isAuthenticated,
  } = useAuth();

  console.log("Current User:", currentUser);
  console.log("Allowed Roles:", allowedRoles);
  console.log("User Role:", currentUser?.role);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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