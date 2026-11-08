import { apiClient } from '../api/apiClient';

export const loginUser = async ( user ) => {
  
  return true;

  const response = await apiClient.post('/login', user,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
    
    console.log("res",response);
    if (response.data == null ) {
      console.log("daataaaaa",response)
      // Maneja los errores de la API, por ejemplo, credenciales incorrectas
      return 0;
    }  else return response;
};