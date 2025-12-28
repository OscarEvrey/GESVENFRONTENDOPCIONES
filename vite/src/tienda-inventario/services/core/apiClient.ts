import { getCurrentUserId } from '@/lib/gesven-session';

// Configuración Base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5022';

// Interfaz estándar de respuesta del Backend
export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  datos: T | null;
  errores: string[];
}

/**
 * Construye los headers estándar (incluyendo Auth/UsuarioId)
 */
function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const userId = getCurrentUserId();
  const base: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(userId !== null ? { 'X-Gesven-UsuarioId': String(userId) } : {}),
  };

  return { ...base, ...(extra ?? {}) };
}

/**
 * Manejador central de respuestas
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Intentamos leer el body, si falla asumimos vacío
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // Si el backend mandó un mensaje de error, lo usamos. Si no, el status HTTP.
    const mensajeError = body?.mensaje || `Error HTTP: ${response.status}`;
    const detalles = body?.errores ? `: ${body.errores.join(', ')}` : '';
    throw new Error(`${mensajeError}${detalles}`);
  }

  // Verificamos el flag lógico de éxito del backend
  const data = body as RespuestaApi<T>;
  if (!data.exito) {
    throw new Error(data.mensaje || 'La operación falló en el servidor.');
  }

  // Retornamos solo los datos limpios (o null as T si viene vacío)
  return data.datos as T;
}

/**
 * Cliente HTTP Reutilizable
 */
export const apiClient = {
  // GET
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(),
    });

    return handleResponse<T>(response);
  },

  // POST
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  // PUT
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  // PATCH
  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  // DELETE
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    });

    return handleResponse<T>(response);
  },
};