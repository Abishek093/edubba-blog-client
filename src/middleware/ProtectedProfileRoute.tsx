import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import NotFound from '../components/common/404/display';

interface ProtectedProfileRouteProps {
  children: React.ReactNode;
}

const ProtectedProfileRoute: React.FC<ProtectedProfileRouteProps> = ({ children }) => {
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Get the current user ID as a string
  const currentUserId = typeof user._id === 'string' 
    ? user._id 
    : String(user._id); // Convert to string regardless of type
  
  // Check if the user is trying to access another profile
  // Only show 404 if explicitly trying to access another user's profile
  if (userId && currentUserId !== userId) {
    return <NotFound />;
  }
  
  // User is authenticated and accessing their own profile
  return <>{children}</>;
};

export default ProtectedProfileRoute;