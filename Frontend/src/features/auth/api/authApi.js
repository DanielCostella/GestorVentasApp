/**
 * AUTH API
 * =======
 * Funciones para comunicarse con el backend de autenticación.
 * 
 * ANTES: axios.post() directo en los componentes
 * AHORA: Funciones centralizadas que usan apiClient
 * 
 * VENTAJAS:
 * - Reutilización: misma lógica en múltiples lugares
 * - Testing: fácil de mockear
 * - Mantenimiento: cambio en un solo lugar
 */

import { apiClient } from '@/lib/apiClient'

/**
 * Inicia sesión con email y password
 * @param {Object} credentials - Email y password del usuario
 * @returns {Promise<Object>} Datos del empleado + sucursal
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/empleados/login', credentials)
  return response.data
}

/**
 * Cierra sesión (por ahora solo limpia el token)
 * En el futuro puede invalidar tokens en el servidor
 */
export const logoutUser = async () => {
  // Por ahora solo limpiamos el estado local
  // En el futuro: await apiClient.post('/empleados/logout')
  return { success: true }
}

/**
 * Registra un nuevo empleado
 * @param {Object} data - Datos del empleado a registrar
 * @returns {Promise<Object>} Empleado creado
 */
export const registerUser = async (data) => {
  const response = await apiClient.post('/empleados', data)
  return response.data
}
