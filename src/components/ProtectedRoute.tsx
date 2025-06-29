import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to auth page if authentication is required but user is not logged in
        navigate('/auth');
      } else if (!requireAuth && user) {
        // Redirect to dashboard if user is already logged in and tries to access auth pages
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, requireAuth]);

  // Show nothing while checking authentication
  if (loading) {
    return null;
  }

  // If authentication check is complete, render children if conditions are met
  if (requireAuth && !user) {
    return null;
  }

  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
