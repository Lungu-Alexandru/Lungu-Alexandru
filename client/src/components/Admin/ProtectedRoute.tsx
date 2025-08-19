import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Se verifică autentificarea..." fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirecționează către login cu informația despre locația dorită
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    // Utilizatorul este autentificat dar nu are drepturi de admin
    return (
      <Navigate 
        to="/unauthorized" 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;