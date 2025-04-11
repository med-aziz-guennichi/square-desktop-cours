import { useUserStore } from '@/store/user-store';
import { FC } from 'react';
import { Navigate } from 'react-router-dom';

type RouteProps = {
  children: React.ReactNode;
};

export const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const { user } = useUserStore();
  return user ? children : <Navigate to="/" replace />;
};

export const PublicRoute: FC<RouteProps> = ({ children }) => {
  const { user } = useUserStore();
  return user ? <Navigate to="/dashboard/classes" /> : children;
};
