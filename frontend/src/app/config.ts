

const getApiBaseUrl = (): string => {
  // 1. Inyección de entorno en Node.js / SSR
  if (typeof process !== 'undefined' && process.env && process.env['API_URL']) {
    return process.env['API_URL'];
  }

  // 2. Ejecución en Navegador (Cliente)
  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.__env && win.__env.API_URL) {
      return win.__env.API_URL;
    }

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }

    return 'https://sistemamultiservicio-rafael.onrender.com';
  }

  // 3. Fallback seguro para SSR / Cloud
  return 'https://sistemamultiservicio-rafael.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();