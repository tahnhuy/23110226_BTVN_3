import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Chỉ cho phép truy cập khi đã có phiên (token trong localStorage hoặc user trong Redux).
 */
function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();
    const token =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!user && !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default ProtectedRoute;
