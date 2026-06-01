import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  role,
  user
}) => {

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    role &&
    user.role !== role
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;