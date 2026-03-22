import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../services/auth";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

/**
 * Route guard that restricts access based on user role.
 * Redirects unauthenticated users to /login,
 * and unauthorized users to their own dashboard.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const roleHome: Record<UserRole, string> = {
      company: "/company",
      teacher: "/teacher",
      student: "/student",
    };
    return <Navigate to={roleHome[user.role]} replace />;
  }

  return <>{children}</>;
}
