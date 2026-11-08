// components/guards/PermissionGate.jsx
import { useAuth } from '../../context/AuthContext';

export default function PermissionGate({ allowedRoles, fallback = null, children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback; // Puede ser null (ocultar) o un mensaje/botón deshabilitado
  }

  return children;
}
