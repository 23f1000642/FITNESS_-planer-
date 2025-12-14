import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireTrainer = false, requireUser = false }) => {
  const { isAuthenticated, isTrainer, isUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireTrainer && !isTrainer) {
    return <Navigate to="/" replace />;
  }

  if (requireUser && !isUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;