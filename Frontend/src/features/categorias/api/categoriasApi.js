import { apiClient } from '@/lib/apiClient'

export const getCategorias = async () => {
  const response = await apiClient.get('/categorias/obtener-categorias')
  return response.data
}

export const createCategoria = async (data) => {
  const response = await apiClient.post('/categorias/agregar-categoria', data)
  return response.data
}

export const updateCategoria = async (id, data) => {
  const response = await apiClient.put(`/categorias/actualizar-categoria/${id}`, data)
  return response.data
}

export const deleteCategoria = async (id) => {
  const response = await apiClient.delete(`/categorias/eliminar-categoria/${id}`)
  return response.data
}
