const API_BASE_URL = 'http://localhost:3009/api';

/**
 * Función genérica para realizar peticiones HTTP.
 * @param {string} endpoint - El endpoint específico de la API (ej. '/posts').
 * @param {object} [options={}] - Opciones de configuración para la petición fetch.
 * @returns {Promise<object>} - Promesa que resuelve con los datos de la respuesta.
 */

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('apiToken');
  // Encabezados predeterminados, como para JSON y autenticación
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'authorization': `Bearer ${token}` // Ejemplo de autenticación
  };

  if (token) {
    defaultHeaders['authorization'] = `Bearer ${token}`;
  }


  const config = {
    ...options, // Se conservan las opciones personalizadas
    headers: {
      ...defaultHeaders
     // ...options.headers, // Se sobreescriben los encabezados si se especifican
    },
  };
  
  try {
    const response = await fetch(url, config);
    const res = await response.json()
    
    // El método `fetch` no lanza un error en respuestas 4xx o 5xx. Hay que verificar `response.ok`.
    if (res.status == "error") {
      
      return res.status;
    }
    
    // Maneja la respuesta si está vacía (por ejemplo, para peticiones DELETE).
    if (res.status == 'success') {
      return res;
    }
  } catch (error) {
    console.error('Error en la petición a la API:', error);
    throw error; // Propaga el error para que sea manejado por el código que hizo la llamada.
  }
}

// Exportación de funciones para métodos HTTP comunes
export const apiClient = {
  
  get: (endpoint, options) => apiFetch(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options) => apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }),
  put: (endpoint, data, options) => apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }),
  del: (endpoint, data, options) => apiFetch(endpoint, { 
    method: 'DELETE',
    body: JSON.stringify(data),
     ...options 
    }),
};