import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../../services/authSession';
import { useAppSelector } from '../../store/hooks';

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();
    const token = getAccessToken();

    if (!user && !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
