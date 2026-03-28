import { Navigate } from "react-router-dom";
import useRole from "../hooks/useRole";
import Spinner from "../components/Spinner";

const AdminRoute = ({ children }) => {
  const [role, isLoading] = useRole();
  if (isLoading) return <Spinner />;
  if (role === "admin") return children;
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;