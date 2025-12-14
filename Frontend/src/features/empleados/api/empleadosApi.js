import { apiClient } from '@/lib/apiClient'

export const getEmpleados = async () => {
  const response = await apiClient.get('/empleados/obtener-empleados')
  return response.data
}

export const createEmpleado = async (data) => {
  const response = await apiClient.post('/empleados/agregar-empleado', data)
  return response.data
}

export const updateEmpleado = async (id, data) => {
  const response = await apiClient.put(`/empleados/actualizar-empleado/${id}`, data)
  return response.data
}

export const deleteEmpleado = async (id) => {
  const response = await apiClient.delete(`/empleados/eliminar-empleado/${id}`)
  return response.data
}
