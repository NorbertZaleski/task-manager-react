import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

  export function ProtectedRoute() {
      const { user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return user ? <Outlet /> : <Navigate to="/login" replace />;
  }

  export function GuestRoute() {
      const { user, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      return user ? <Navigate to="/boards" replace /> : <Outlet />;
  }