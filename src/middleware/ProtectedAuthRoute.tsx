import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedAuthRouteProps {
  children: React.ReactNode;
}

const ProtectedAuthRoute: React.FC<ProtectedAuthRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedAuthRoute;