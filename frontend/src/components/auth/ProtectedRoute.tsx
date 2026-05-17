import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!user && !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
