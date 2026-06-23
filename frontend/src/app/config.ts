// =========================================================================
// CONFIGURACIÓN DINÁMICA DE LA API PARA DESPLIEGUE Y DESARROLLO
// =========================================================================

const getApiBaseUrl = (): string => {
  // 1. En el Servidor (SSR / Node.js)
  // Permite inyectar la URL interna del backend mediante la variable de entorno API_URL
  if (typeof process !== 'undefined' && process.env && process.env['API_URL']) {
    return process.env['API_URL'];
  }

  // 2. En el Cliente (Navegador)
  if (typeof window !== 'undefined') {
    // Si estamos en desarrollo local, apunta al puerto local del backend (8080)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
    // En producción, usamos el origen actual (el dominio de la web).
    // Con Nginx/Dokploy, las llamadas relativas a /api se redirigirán automáticamente al backend.
    return window.location.origin;
  }

  // Fallback por defecto si no se detecta el entorno
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();
