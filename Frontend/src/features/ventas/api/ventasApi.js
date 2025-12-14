import { apiClient } from '@/lib/apiClient'

export const getVentas = async () => {
  const response = await apiClient.get('/ventas/obtener-ventas')
  return response.data
}

export const createVenta = async (data) => {
  const response = await apiClient.post('/ventas/agregar-venta', data)
  return response.data
}

export const deleteVenta = async (id) => {
  const response = await apiClient.delete(`/ventas/eliminar-venta/${id}`)
  return response.data
}
