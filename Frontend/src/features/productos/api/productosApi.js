/**
 * PRODUCTOS API
 * =============
 * Funciones para comunicarse con el backend de productos.
 */

import { apiClient } from '@/lib/apiClient'

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} Lista de productos
 */
export const getProductos = async () => {
  const response = await apiClient.get('/productos/obtener-productos')
  return response.data
}

/**
 * Obtiene un producto por ID
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto
 */
export const getProducto = async (id) => {
  const response = await apiClient.get(`/productos/obtener-producto/${id}`)
  return response.data
}

/**
 * Crea un nuevo producto
 * @param {Object} data - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
export const createProducto = async (data) => {
  const response = await apiClient.post('/productos/agregar-producto', data)
  return response.data
}

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {Object} data - Datos actualizados
 * @returns {Promise<Object>} Producto actualizado
 */
export const updateProducto = async (id, data) => {
  const response = await apiClient.put(`/productos/actualizar-producto/${id}`, data)
  return response.data
}

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Respuesta de eliminación
 */
export const deleteProducto = async (id) => {
  const response = await apiClient.delete(`/productos/eliminar-producto/${id}`)
  return response.data
}

/**
 * Importa productos desde Excel
 * @param {FormData} formData - Archivo Excel
 * @returns {Promise<Object>} Respuesta de importación
 */
export const importarProductosExcel = async (formData) => {
  const response = await apiClient.post('/productos/importar-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}
