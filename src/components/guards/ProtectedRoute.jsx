import { Link, Navigate, useNavigate, Outlet } from '@tanstack/react-router';
import { useAuth } from '../../context/Auth/AuthProvider'

export default function ProtectedRoute ({allowedRoles}){
    const { user, isLoading } = useAuth();

    if(isLoading) return <div>Cargando...</div>;
    if(!user) return <Navigate to="/login" replace />;

    // Si se especifican roles y el usuario no lo tiene "Unauthorized"
    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorized" replace></Navigate>
    }

    return <Outlet />; // Renderiza la sub-ruta protegida
}