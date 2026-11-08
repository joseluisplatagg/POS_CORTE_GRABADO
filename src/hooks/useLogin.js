import { useMutation, useQueryClient,useQuery  } from '@tanstack/react-query';
import { loginUser } from '../api/auth.js';

export const useLogin = () => {
    const queryClient = useQueryClient(); // Obtiene el cliente de React Query
    return useMutation({
        mutationFn: loginUser,
        onError: (error) => {
        console.error('Login fallido:', error);
        // Puedes mostrar una notificación al usuario aquí
        // Opcional: limpiar la caché o el token en caso de un error
        localStorage.removeItem('access_token');
        queryClient.removeQueries({ queryKey: ['user'] });
        },
    });
};