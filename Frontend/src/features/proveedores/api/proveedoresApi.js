import { apiClient } from '@/lib/apiClient'

export const getProveedores = async () => {
  const response = await apiClient.get('/proveedores/obtener-proveedores')
  return response.data
}

export const createProveedor = async (data) => {
  const response = await apiClient.post('/proveedores/agregar-proveedor', data)
  return response.data
}

export const updateProveedor = async (id, data) => {
  const response = await apiClient.put(`/proveedores/actualizar-proveedor/${id}`, data)
  return response.data
}

export const deleteProveedor = async (id) => {
  const response = await apiClient.delete(`/proveedores/eliminar-proveedor/${id}`)
  return response.data
}
